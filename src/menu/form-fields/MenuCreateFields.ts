import { TFieldProps } from "synergy-form-generator";

const menuCreateFields: Array<TFieldProps> = [
	{
		name: "venueId",
	},
	{
		name: "menuItems",
		rules: {
			required: true,
		},
	},
];

export default menuCreateFields;
