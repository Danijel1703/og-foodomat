import { TFieldProps } from "synergy-form-generator";
import { menuItemCategories } from "../../constants";

const menuItemCreateFields: Array<TFieldProps> = [
	{
		name: "name",
		type: "text",
		placeholder: "Menu item name...",
		label: "Menu item name",
		rules: {
			required: true,
		},
	},
	{
		name: "categoryId",
		label: "Category",
		type: "dropdown",
		getItems: () => menuItemCategories,
	},
	{
		name: "description",
		type: "text",
		placeholder: "Menu item description...",
		label: "Menu item description",
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
