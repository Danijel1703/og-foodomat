import { isEmpty, map } from "lodash-es";
import {
	ChangeEventHandler,
	MouseEventHandler,
	useEffect,
	useState,
} from "react";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
	TForm,
	TFormField,
} from "synergy-form-generator";
import { DropdownInput } from "../../components";
import WithAuth from "../../hoc/WithAuth";
import { TMenuItem, TVenue } from "../../types";
import { generateId } from "../../utils";
import { menuCreateFields, menuItemCreateFields } from "../form-fields";
import { SingleValue } from "react-select";
import { MenuService } from "../../API";

type TSelectable = { id: string; value: string; label: string };

function MenuCreate() {
	const form = createForm({
		fieldProps: menuCreateFields,

		onSubmit: async (event: Event) => {
			event.preventDefault();
			const { values } = form;
			const menu = { ...values };
			await MenuService.createMenu(menu);
		},
	});
	const {
		fields: { venueId },
	} = form;

	const onVenueChange = (item: SingleValue<TVenue>) =>
		venueId.setValue(item?.id);

	return (
		<WithAuth>
			<FormComponent form={form}>
				<FieldComponent
					field={venueId}
					component={(props) => (
						<DropdownInput
							{...props}
							onChange={onVenueChange}
							dropdownStore={venueId.dropdownStore}
							className=""
						/>
					)}
				/>
			</FormComponent>
			<MenuItems form={form} />
			<Submit
				form={form}
				component={() => (
					<input
						type="submit"
						value="Create Menu"
						onClick={form.onSubmit as MouseEventHandler<HTMLInputElement>}
					/>
				)}
			/>
		</WithAuth>
	);
}

function MenuItems({ form }: { form: TForm }) {
	const [items, setMenuItems] = useState<Array<TMenuItem>>([]);
	const addItem = (item: TMenuItem) => {
		setMenuItems([...items, item]);
	};

	useEffect(() => {
		const {
			fields: { menuItems },
		} = form;
		menuItems.setValue(items);
	}, [items]);

	return (
		<>
			<MenuItemForm addItem={addItem} />
			{map(items, (item) => {
				const { id, name, description, sizeVariants, extras } = item;
				return (
					<div key={id}>
						<div>{name}</div>
						<div>{description}</div>
						<div>{map(sizeVariants, (v) => v.label).join(",")}</div>
						<div>{map(extras, (e) => e.label).join(",")}</div>
					</div>
				);
			})}
		</>
	);
}

function MenuItemForm({ addItem }: { addItem: (item: TMenuItem) => void }) {
	const form = createForm({
		fieldProps: menuItemCreateFields,
		onSubmit: (event: Event) => {
			event.preventDefault();
			const { values } = form;
			addItem(values);
		},
	});

	const {
		fields: { name, categoryId, description, sizeVariants, extras },
	} = form;

	const onCategoryChange = (item: SingleValue<TVenue>) =>
		categoryId.setValue(item?.id);

	return (
		<FormComponent form={form}>
			<FieldComponent field={name} />
			<FieldComponent
				field={categoryId}
				component={(props) => (
					<DropdownInput
						{...props}
						dropdownStore={categoryId.dropdownStore}
						onChange={onCategoryChange}
					/>
				)}
			/>
			<FieldComponent field={description} />
			<SelectableOptions field={sizeVariants} />
			<SelectableOptions field={extras} withPrice={true} />
			<Submit
				form={form}
				component={() => (
					<input
						type="submit"
						onClick={form.onSubmit as MouseEventHandler<HTMLInputElement>}
						value="Add Item"
					/>
				)}
			/>
		</FormComponent>
	);
}

const optionDefaults = { id: "", label: "", value: "", price: 0 };
const SelectableOptions = ({
	field,
	withPrice = false,
}: {
	field: TFormField;
	withPrice?: boolean;
}) => {
	const [newOption, setNewOption] = useState<TSelectable & { price?: number }>(
		optionDefaults
	);
	const [options, setOptions] = useState<Array<TSelectable>>([]);
	const [price, setPrice] = useState(0);
	const removeOption = (id: string) =>
		setOptions(options.filter((o) => o.id !== id));

	const addOption: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		if (withPrice) {
			newOption.price = price;
		} else {
			delete newOption.price;
		}
		setOptions([...options, newOption]);
		field.setValue([...options, newOption]);
		setNewOption(optionDefaults);
	};

	const setNewOptionValue: ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = e.target.value;
		setNewOption({
			id: generateId(),
			value: value,
			label: value,
			price: 0,
		});
	};

	const setNewOptionPrice: ChangeEventHandler<HTMLInputElement> = (e) =>
		setPrice(Number(e.target.value));

	return (
		<div>
			<input type="text" onChange={setNewOptionValue} value={newOption.label} />
			{withPrice && (
				<input type="number" onChange={setNewOptionPrice} value={price} />
			)}
			<button onClick={addOption} disabled={isEmpty(newOption.label)}>
				Add
			</button>
			{options.map((option) => {
				const { label, id } = option;
				return (
					<div key={id}>
						<div>{label}</div>
						<button onClick={() => removeOption(id)}>Remove</button>
					</div>
				);
			})}
		</div>
	);
};

export default MenuCreate;
