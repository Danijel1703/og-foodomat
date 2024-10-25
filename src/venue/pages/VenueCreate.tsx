import { createForm, FormGenerator } from "synergy-form-generator";
import { venueCreateFields } from "../form-fields";
import VenueService from "../../API/VenueService";
import { TVenue } from "../../types";
import { useNavigate } from "react-router-dom";
import WithAuth from "../../hoc/WithAuth";

function VenueCreate() {
	const navigate = useNavigate();
	const form = createForm({
		fieldProps: venueCreateFields,
		onSubmit: async (venue: TVenue) => {
			await VenueService.create(venue);
			navigate("/venue/list");
		},
	});
	return (
		<WithAuth>
			<div>
				<FormGenerator form={form} />
			</div>
		</WithAuth>
	);
}

export default VenueCreate;
