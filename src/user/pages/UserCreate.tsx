import { Button } from "@mui/material";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { UserService } from "../../API";
import { TUser } from "../../types";
import { userCreateFields } from "../form-fields";
import { map } from "lodash-es";
import "../styles/UserCreate.scss";
import { useNavigate } from "react-router-dom";

const UserCreate = () => {
	const navigate = useNavigate();
	const form = createForm({
		fieldProps: userCreateFields,
		onSubmit: async (user: TUser) => {
			await UserService.register(user);
			await UserService.login({ ...user });
			navigate("/venue/list");
		},
	});

	const {
		fields: {
			email,
			password,
			firstName,
			lastName,
			username,
			confirmPassword,
			image,
		},
	} = form;
	const userFields = [
		email,
		password,
		confirmPassword,
		firstName,
		lastName,
		username,
		image,
	];
	return (
		<div className="user-create">
			<FormComponent form={form}>
				<h1>User register: </h1>
				{map(userFields, (field) => (
					<FieldComponent field={field} />
				))}
				<Submit
					form={form}
					component={() => (
						<Button
							disabled={!form.isValid}
							variant="contained"
							onClick={() => form.onSubmit(form.getValues())}
							className="f-right"
							sx={{ alignSelf: "flex-end" }}
						>
							Register
						</Button>
					)}
				/>
			</FormComponent>
		</div>
	);
};

export default UserCreate;
