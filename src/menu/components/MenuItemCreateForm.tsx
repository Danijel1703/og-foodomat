import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { menuItemCreateFields } from "../form-fields";
import { TMenuItem, TVenue } from "../../types";
import { SingleValue } from "react-select";
import MenuItemSelectableOptions from "./MenuItemSelectableOptions";
import { DropdownInput } from "../../components";
import { Button } from "@mui/material";
import { AddIcon } from "../../icons";

function MenuItemCreateForm({
	addItem,
}: {
	addItem: (item: TMenuItem) => void;
}) {
	const form = createForm({
		fieldProps: menuItemCreateFields,
		onSubmit: (event: Event) => {
			event.preventDefault();
			addItem(form.getValues());
		},
	});

	const {
		fields: { name, categoryId, description, sizeVariants, extras, price },
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
						isRequired={true}
					/>
				)}
			/>
			<FieldComponent field={description} />
			<FieldComponent field={price} />
			<FieldComponent
				field={sizeVariants}
				component={() => (
					<MenuItemSelectableOptions
						label="Size variants"
						field={sizeVariants}
					/>
				)}
			/>
			<FieldComponent
				field={extras}
				component={() => (
					<MenuItemSelectableOptions field={extras} label="Extras" />
				)}
			/>
			<Submit
				form={form}
				component={() => (
					<Button
						type="submit"
						disabled={!form.isValid}
						onClick={(e) => form.onSubmit(e)}
						variant="contained"
						className="add-option"
						endIcon={<AddIcon />}
					>
						Add Item
					</Button>
				)}
			/>
		</FormComponent>
	);
}

export default MenuItemCreateForm;
