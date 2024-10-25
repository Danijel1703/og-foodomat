import { TFieldProps } from "synergy-form-generator";

const venueCreateFields: Array<TFieldProps> = [
	{
		name: "name",
		type: "text",
		rules: {
			required: true,
		},
		label: "Name",
		placeholder: "Venue Name...",
	},
	{
		name: "description",
		type: "text",
		label: "Description",
		placeholder: "Description...",
	},
	{
		name: "address",
		type: "text",
		label: "Address",
		placeholder: "Address...",
		rules: {
			required: true,
		},
	},
	{
		name: "city",
		type: "text",
		label: "City",
		placeholder: "City...",
		rules: {
			required: true,
		},
	},
	{
		name: "postalCode",
		type: "text",
		label: "Postal Code",
		placeholder: "Postal Code...",
		rules: {
			required: true,
		},
	},
	{
		name: "country",
		type: "text",
		label: "Country",
		placeholder: "Country...",
		rules: {
			required: true,
		},
	},
	{
		name: "phoneNumber",
		type: "tel",
		label: "Phone Number",
		placeholder: "Phone Number...",
		rules: {
			required: true,
		},
	},
	{
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "Email...",
	},
	{
		name: "websiteUrl",
		type: "url",
		label: "Website Url",
		placeholder: "Website Url...",
	},
];

export default venueCreateFields;
