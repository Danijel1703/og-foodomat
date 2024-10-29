import { Button } from "@mui/material";
import { each } from "lodash-es";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { createForm, Submit } from "synergy-form-generator";
import { MenuService, VenueService } from "../../API";
import WithAuth from "../../hoc/WithAuth";
import { EditIcon } from "../../icons";
import { TMenu, TVenue } from "../../types";
import { generateId } from "../../utils";
import { MenuItems } from "../components";
import { menuCreateFields } from "../form-fields";

function MenuEdit() {
	const navigate = useNavigate();
	const [venue, setVenue] = useState<TVenue>();
	const entity: TMenu = useLoaderData() as TMenu;
	const form = createForm({
		fieldProps: menuCreateFields,
		entity: entity,
		onSubmit: async (event: Event) => {
			event.preventDefault();
			const { values } = form;
			each(values.menuItems, (i) => {
				delete i.domId;
				if (!i.id) i.id = generateId();
			});
			await MenuService.update({ ...entity, ...values });

			navigate("/venue/list");
		},
	});

	const getVenue = async () => {
		const venue = await VenueService.getById(entity.venueId);
		setVenue(venue as TVenue);
	};

	useEffect(() => {
		getVenue();
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
									endIcon={<EditIcon />}
									sx={{ float: "right" }}
								>
									Edit Menu
								</Button>
							)}
						/>
					</div>
				</div>
			</div>
		</WithAuth>
	);
}

export default MenuEdit;
