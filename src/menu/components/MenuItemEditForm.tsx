import { MouseEventHandler, useEffect, useState } from "react";
import { TMenuItem, TVenue } from "../../types";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { menuItemCreateFields } from "../form-fields";
import { SingleValue } from "react-select";
import MenuItemSelectableOptions from "./MenuItemSelectableOptions";
import { DropdownInput } from "../../components";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function MenuItemEditForm({
	editItem,
	removeItem,
	item,
}: {
	editItem: (item: TMenuItem) => void;
	removeItem: (item: TMenuItem) => void;
	item: TMenuItem;
}) {
	const [inEdit, setInEdit] = useState(false);
	const form = createForm({
		entity: item,
		fieldProps: menuItemCreateFields,
		onSubmit: (event: Event) => {
			event.preventDefault();
			console.log(form.getValues());
			editItem(form.getValues());
			setInEdit(false);
		},
	});

	const {
		fields: { name, categoryId, description, sizeVariants, extras, price },
	} = form;

	const onCategoryChange = (item: SingleValue<TVenue>) =>
		categoryId.setValue(item?.id);

	const enableEdit = () => {
		form.enable();
		setInEdit(true);
	};

	useEffect(() => {
		if (inEdit) {
			form.enable();
		} else {
			form.disable();
		}
	}, [inEdit]);

	return (
		<div className="added-items">
			<FormComponent form={form}>
				<FieldComponent field={name} />
				<FieldComponent
					field={categoryId}
					component={(props) => (
						<DropdownInput
							{...props}
							dropdownStore={categoryId.dropdownStore}
							onChange={onCategoryChange}
							isRequired={true}
						/>
					)}
				/>
				<FieldComponent field={description} />
				<FieldComponent field={price} />
				<FieldComponent
					field={sizeVariants}
					component={() => (
						<MenuItemSelectableOptions
							label="Size variants"
							field={sizeVariants}
						/>
					)}
				/>
				<FieldComponent
					field={extras}
					component={() => (
						<MenuItemSelectableOptions label="Extras" field={extras} />
					)}
				/>
				<div className="add-option-button">
					{!inEdit ? (
						<Button
							onClick={enableEdit}
							variant="outlined"
							sx={{ marginRight: "1vh" }}
							endIcon={<EditIcon />}
						>
							Edit
						</Button>
					) : (
						<Submit
							form={form}
							component={() => (
								<Button
									onClick={(e) => form.onSubmit(e)}
									value="Save"
									sx={{ marginRight: "1vh" }}
									variant="contained"
									endIcon={<CheckCircleOutlineIcon />}
								>
									Save
								</Button>
							)}
						/>
					)}
					<Button
						onClick={() => removeItem(item)}
						endIcon={<DeleteIcon />}
						variant="contained"
						color="error"
					>
						Remove
					</Button>
				</div>
			</FormComponent>
		</div>
	);
}

export default MenuItemEditForm;
