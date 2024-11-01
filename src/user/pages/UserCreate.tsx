import { Button } from "@mui/material";
import { map } from "lodash-es";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { UserService } from "../../API";
import { TUser } from "../../types";
import { userCreateFields } from "../form-fields";
import "../styles/UserCreate.scss";
import { redirect } from "react-router-dom";

const UserCreate = () => {
	const form = createForm({
		fieldProps: userCreateFields,
		onSubmit: async (user: TUser) => {
			await UserService.register(user);
			redirect("/user/login");
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
					<FieldComponent key={field.id} field={field} />
				))}
				<Submit
					form={form}
					component={() => (
						<Button
							disabled={!form.isValid}
							variant="contained"
							onClick={() => form.onSubmit(form.getValues())}
							className="f-right"
							name="register"
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
