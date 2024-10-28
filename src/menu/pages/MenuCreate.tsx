import { Button } from "@mui/material";
import { each } from "lodash-es";
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
import { CheckIcon } from "../../icons";
import { TVenue } from "../../types";
import { MenuItems } from "../components";
import { menuCreateFields } from "../form-fields";
import "../styles/MenuCreate.scss";

function MenuCreate() {
	const form = createForm({
		fieldProps: menuCreateFields,
		onSubmit: async (event: Event) => {
			event.preventDefault();
			const { values } = form;
			each(values.menuItems, (i) => delete i.domId);
			await MenuService.createMenu(values);
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
