import { map } from "lodash-es";
import { TFieldProps } from "synergy-form-generator";
import VenueService from "../../API/VenueService";

const menuCreateFields: Array<TFieldProps> = [
	{
		name: "venueId",
		type: "dropdown",
		getItems: async () => {
			const response = await VenueService.get();
			return map(response.items, (i) => ({
				...i,
				label: i.name,
				value: i.id,
			}));
		},

		updateFilter: () => {},
		label: "Venue",
	},
	{
		name: "menuItems",
	},
];

export default menuCreateFields;
