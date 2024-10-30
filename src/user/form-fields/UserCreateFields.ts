import { fieldTypeConstants, TFieldProps } from "synergy-form-generator";
import { validationErrors } from "../../constants";
import { UserService } from "../../API";
import { isEmpty } from "lodash-es";

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
		customRules: [
			{
				name: "checkDuplicateEmail",
				isActive: true,
				validator: async (field) => {
					const userExists = await UserService.search("email", field.value);
					const message = "A user with the same email already exists.";
					const isValid = isEmpty(userExists);
					return {
						isValid: isEmpty(userExists),
						error: isValid ? undefined : message,
					};
				},
			},
		],
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
		customRules: [
			{
				name: "checkDuplicateUsername",
				isActive: true,
				validator: async (field) => {
					const userExists = await UserService.search("username", field.value);
					const message = "A user with the same username already exists.";
					const isValid = isEmpty(userExists);
					return {
						isValid: isEmpty(userExists),
						error: isValid ? undefined : message,
					};
				},
			},
		],
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
		label: "Image",
		placeholder: "Upload image",
	},
];

export default userCreateFields;
