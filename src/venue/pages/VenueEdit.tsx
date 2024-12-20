import { Button } from "@mui/material";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import VenueService from "../../API/VenueService";
import WithAuth from "../../hoc/WithAuth";
import { TVenue } from "../../types";
import { venueCreateFields } from "../form-fields";
import { CreateIcon } from "../../icons";
import { map } from "lodash-es";

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
			phoneNumber,
		},
	} = form;

	const venueFields = [
		name,
		description,
		address,
		city,
		postalCode,
		phoneNumber,
		country,
		email,
		websiteUrl,
	];

	return (
		<WithAuth>
			<div className="venue-create">
				<FormComponent form={form}>
					{map(venueFields, (field) => (
						<FieldComponent key={field.id} field={field} />
					))}
					<Submit
						component={() => (
							<Button
								variant="contained"
								className="submit"
								endIcon={<CreateIcon />}
								onClick={() => form.onSubmit(form.getValues())}
								disabled={!form.isValid}
								name="update-venue"
							>
								Update
							</Button>
						)}
						form={form}
					/>
				</FormComponent>
			</div>
		</WithAuth>
	);
}

export default VenueEdit;
