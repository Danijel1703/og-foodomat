import { TFieldProps } from "synergy-form-generator";
import { menuItemCategories } from "../../constants";

const menuItemCreateFields: Array<TFieldProps> = [
	{
		name: "name",
		type: "text",
		placeholder: "Item name...",
		label: "Item name",
		rules: {
			required: true,
		},
	},
	{
		name: "categoryId",
		label: "Category",
		type: "dropdown",
		rules: {
			required: true,
		},
		getItems: () => menuItemCategories,
	},
	{
		name: "description",
		type: "text",
		placeholder: "Item description...",
		label: "Item description",
		rules: {
			required: true,
		},
	},
	{
		name: "price",
		type: "price",
		placeholder: "Price...",
		label: "Price",
		rules: {
			required: true,
		},
	},
	{
		name: "sizeVariants",
	},
	{
		name: "extras",
	},
];

export default menuItemCreateFields;
