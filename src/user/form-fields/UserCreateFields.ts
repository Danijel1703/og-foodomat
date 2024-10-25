import { fieldTypeConstants, TFieldProps } from "synergy-form-generator";
import { validationErrors } from "../../constants";

const userCreateFields: Array<TFieldProps> = [
	{
		type: fieldTypeConstants.text,
		name: "firstName",
		rules: {
			required: true,
		},
		placeholder: "Enter First Name",
		label: "First Name",
	},
	{
		type: fieldTypeConstants.text,
		name: "lastName",
		rules: {
			required: true,
		},
		placeholder: "Enter Last Name",
		label: "Last Name",
	},
	{
		type: fieldTypeConstants.email,
		name: "email",
		rules: {
			required: true,
		},
		placeholder: "Enter Email",
		label: "Email",
	},
	{
		type: fieldTypeConstants.text,
		name: "username",
		rules: {
			required: true,
		},
		placeholder: "Enter Username",
		label: "Username",
	},
	{
		type: fieldTypeConstants.password,
		name: "password",
		rules: {
			required: true,
			mustContainLower: true,
			mustContainUpper: true,
			mustContainDigit: true,
			mustContainSpecial: true,
		},
		placeholder: "Enter Password",
		label: "Password",
	},
	{
		type: fieldTypeConstants.password,
		name: "confirmPassword",
		rules: {
			required: true,
			mustContainLower: true,
			mustContainUpper: true,
			mustContainDigit: true,
			mustContainSpecial: true,
		},
		customRules: [
			{
				isActive: true,
				name: "confirmPassword",
				validator: ({ value, form }) => {
					const { password } = form.fields;
					const isValid = value === password.value;
					const error = isValid ? undefined : validationErrors.confirmPassword;
					return { isValid, error: error };
				},
			},
		],
		placeholder: "Confirm Password",
		label: "Confirm Password",
		dependencies: ["password"],
	},
	{
		type: fieldTypeConstants.file,
		name: "image",
		rules: {
			required: true,
		},
		label: "Image",
		placeholder: "Upload image",
	},
];

export default userCreateFields;
