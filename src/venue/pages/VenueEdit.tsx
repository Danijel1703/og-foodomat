import { useLoaderData, useNavigate } from "react-router-dom";
import { createForm, FormGenerator } from "synergy-form-generator";
import VenueService from "../../API/VenueService";
import { TVenue } from "../../types";
import { venueCreateFields } from "../form-fields";
import WithAuth from "../../hoc/WithAuth";

function VenueEdit() {
	const navigate = useNavigate();
	const venue = useLoaderData();
	const form = createForm({
		entity: venue,
		onSubmit: async (entity: TVenue) => {
			await VenueService.update({ ...(venue as object), ...entity });
			navigate("/venue/list");
		},
		fieldProps: venueCreateFields,
	});
	return (
		<WithAuth>
			<div>
				<FormGenerator form={form} />
			</div>
		</WithAuth>
	);
}

export default VenueEdit;
