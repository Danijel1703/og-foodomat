import { isEmpty } from "lodash-es";
import {
	ChangeEventHandler,
	MouseEventHandler,
	useEffect,
	useState,
} from "react";
import { TFormField, TSelectableItem } from "synergy-form-generator";
import { PriceInput, TextInput } from "../../components";
import { generateId } from "../../utils";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const optionDefaults = { id: "", label: "", value: "", price: 0 };
const MenuItemSelectableOptions = ({
	field,
	label,
}: {
	field: TFormField;
	label: string;
}) => {
	const [newOption, setNewOption] = useState<
		TSelectableItem & { price?: number }
	>(optionDefaults);
	const [options, setOptions] = useState<
		Array<TSelectableItem & { price?: number }>
	>(field.value || []);
	const [price, setPrice] = useState(0);
	const removeOption = (id: string) => {
		setOptions(options.filter((o) => o.id !== id));
	};

	const addOption: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		newOption.price = price;
		setOptions([...options, newOption]);
		setNewOption(optionDefaults);
	};

	const setNewOptionValue: ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = e.target.value;
		setNewOption({
			id: generateId(),
			value: value,
			label: value,
			price: price,
		});
	};

	useEffect(() => {
		field.setValue([...options]);
	}, [options]);

	const setNewOptionPrice: ChangeEventHandler<HTMLInputElement> = (e) =>
		setPrice(Number(e.target.value));

	if (isEmpty(options) && field.disabled) return <></>;
	return (
		<div className="options-wrapper">
			<h1>{label}</h1>
			{!field.disabled && (
				<div className="create-options">
					<TextInput
						onChange={setNewOptionValue}
						placeholder="Option name..."
						label="Option name"
						type="text"
						value={newOption.label}
					/>
					<PriceInput
						onChange={setNewOptionPrice}
						placeholder="Additional price..."
						label="Additional price"
						value={price}
						isRequired={true}
					/>
				</div>
			)}
			<div className="add-option-button">
				{!field.disabled && (
					<Button
						onClick={addOption}
						disabled={isEmpty(newOption.label) || price <= 0}
						endIcon={<AddIcon />}
						variant="contained"
					>
						Add
					</Button>
				)}
			</div>
			{options.map((option) => {
				const { label, id, price } = option;
				return (
					<div key={id} className="options-list">
						<div>
							{label} (+{price} €)
						</div>
						{!field.disabled && (
							<Button
								onClick={() => removeOption(id)}
								endIcon={<DeleteIcon />}
								variant="contained"
								color="error"
							>
								Remove
							</Button>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default MenuItemSelectableOptions;
