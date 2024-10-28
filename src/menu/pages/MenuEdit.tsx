import { Button } from "@mui/material";
import { each } from "lodash-es";
import { useLoaderData } from "react-router-dom";
import { SingleValue } from "react-select";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { MenuService } from "../../API";
import { DropdownInput } from "../../components";
import WithAuth from "../../hoc/WithAuth";
import { TMenu, TVenue } from "../../types";
import { generateId } from "../../utils";
import { MenuItems } from "../components";
import { menuCreateFields } from "../form-fields";
import { EditIcon } from "../../icons";

function MenuEdit() {
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
		},
	});
	const {
		fields: { venueId },
	} = form;

	const onVenueChange = (item: SingleValue<TVenue>) =>
		venueId.setValue(item?.id);

	return (
		<WithAuth>
			<div className="menu-create">
				<div className="form-wrapper">
					<h1 className="venue-title">Venue</h1>
					<FormComponent form={form}>
						<FieldComponent
							field={venueId}
							component={(props) => (
								<DropdownInput
									{...props}
									placeholder="Select venue..."
									onChange={onVenueChange}
									dropdownStore={venueId.dropdownStore}
									className="dropdown"
								/>
							)}
						/>
					</FormComponent>
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
