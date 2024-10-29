import { TFieldProps } from "synergy-form-generator";

const userLoginFields: Array<TFieldProps> = [
	{
		name: "email",
		type: "email",
		placeholder: "Email...",
		label: "Email",
		rules: {
			required: true,
		},
	},
	{
		name: "password",
		type: "password",
		placeholder: "Password...",
		label: "Password",
		rules: {
			required: true,
		},
	},
];

export default userLoginFields;
