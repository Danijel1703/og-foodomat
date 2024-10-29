import { Button } from "@mui/material";
import { each } from "lodash-es";
import { SingleValue } from "react-select";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { MenuService, VenueService } from "../../API";
import { DropdownInput } from "../../components";
import WithAuth from "../../hoc/WithAuth";
import { CheckIcon } from "../../icons";
import { TVenue } from "../../types";
import { MenuItems } from "../components";
import { menuCreateFields } from "../form-fields";
import "../styles/MenuCreate.scss";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MenuCreate() {
	const navigate = useNavigate();
	const [venue, setVenue] = useState<TVenue>();
	const form = createForm({
		fieldProps: menuCreateFields,
		onSubmit: async (event: Event) => {
			event.preventDefault();
			const { values } = form;
			values.venueId = venue?.id;
			each(values.menuItems, (i) => delete i.domId);
			await MenuService.createMenu(values);

			navigate("/venue/list");
		},
	});
	const item = useLoaderData() as TVenue;

	useEffect(() => {
		setVenue(item as TVenue);
	}, []);

	return (
		<WithAuth>
			<div className="menu-create">
				<div className="form-wrapper">
					<h1 className="venue-title">{venue?.name}</h1>
					<MenuItems form={form} />
					<div className="create-menu-button">
						<Submit
							form={form}
							component={() => (
								<Button
									disabled={!form.isValid}
									variant="contained"
									onClick={(e) => form.onSubmit(e)}
									endIcon={<CheckIcon />}
									className="f-right"
								>
									Create Menu
								</Button>
							)}
						/>
					</div>
				</div>
			</div>
		</WithAuth>
	);
}

export default MenuCreate;
