import { TFieldProps } from "synergy-form-generator";

const userLoginFields: Array<TFieldProps> = [
	{
		name: "email",
		type: "email",
		placeholder: "Email...",
		label: "Email",
	},
	{
		name: "password",
		type: "password",
		placeholder: "Password...",
		label: "Password",
	},
];

export default userLoginFields;
