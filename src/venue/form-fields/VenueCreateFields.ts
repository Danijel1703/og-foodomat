import { isEmpty, some } from "lodash-es";
import { TFieldProps } from "synergy-form-generator";
import { VenueService } from "../../API";

const venueCreateFields: Array<TFieldProps> = [
	{
		name: "name",
		type: "text",
		rules: {
			required: true,
		},
		customRules: [
			{
				name: "checkDuplicateName",
				isActive: true,
				validator: async (field) => {
					const id = field.form.entity.id;
					const venues = await VenueService.search("name", field.value);
					const message = "A venue with the same name already exists.";
					let isValid = isEmpty(venues);
					if (!isEmpty(venues)) {
						isValid = some(venues, (venue) => venue.id === id);
					}
					return {
						isValid: isValid,
						error: isValid ? undefined : message,
					};
				},
			},
		],
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
		customRules: [
			{
				name: "checkDuplicateAddress",
				isActive: true,
				validator: async (field) => {
					const id = field.form.entity.id;
					const venues = await VenueService.search("address", field.value);
					const message = "A venue with the same address already exists.";
					let isValid = isEmpty(venues);
					if (!isEmpty(venues)) {
						isValid = some(venues, (venue) => venue.id === id);
					}
					return {
						isValid: isValid,
						error: isValid ? undefined : message,
					};
				},
			},
		],
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
		customRules: [
			{
				name: "checkDuplicateEmail",
				isActive: true,
				validator: async (field) => {
					const id = field.form.entity.id;
					const venues = await VenueService.search("email", field.value);
					const message = "A venue with the same email already exists.";
					let isValid = isEmpty(venues);
					if (!isEmpty(venues)) {
						isValid = some(venues, (venue) => venue.id === id);
					}
					return {
						isValid: isValid,
						error: isValid ? undefined : message,
					};
				},
			},
		],
	},
	{
		name: "websiteUrl",
		type: "url",
		label: "Website Url",
		placeholder: "Website Url...",
	},
];

export default venueCreateFields;
