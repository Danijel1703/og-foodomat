import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { venueCreateFields } from "../form-fields";
import VenueService from "../../API/VenueService";
import { TVenue } from "../../types";
import { useNavigate } from "react-router-dom";
import WithAuth from "../../hoc/WithAuth";
import "../styles/VenueCreate.scss";
import { Button } from "@mui/material";
import { CheckIcon } from "../../icons";
import { map } from "lodash-es";

function VenueCreate() {
	const navigate = useNavigate();
	const form = createForm({
		fieldProps: venueCreateFields,
		onSubmit: async (venue: TVenue) => {
			await VenueService.create(venue);
			navigate("/venue/list");
		},
	});

	const {
		fields: {
			name,
			description,
			address,
			city,
			postalCode,
			country,
			email,
			websiteUrl,
		},
	} = form;

	const venueFields = [
		name,
		description,
		address,
		city,
		postalCode,
		country,
		email,
		websiteUrl,
	];

	return (
		<WithAuth>
			<div className="venue-create">
				<FormComponent form={form}>
					<h1 className="title">Create Venue: </h1>
					{map(venueFields, (field) => (
						<FieldComponent field={field} />
					))}
					<Submit
						component={() => (
							<Button
								variant="contained"
								className="submit"
								endIcon={<CheckIcon />}
								disabled={!form.isValid}
							>
								Create
							</Button>
						)}
						form={form}
					/>
				</FormComponent>
			</div>
		</WithAuth>
	);
}

export default VenueCreate;
