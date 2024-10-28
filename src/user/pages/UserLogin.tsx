import { useNavigate } from "react-router-dom";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { UserService } from "../../API";
import { TCredentials } from "../../types";
import { userLoginFields } from "../form-fields";
import "../styles/UserLogin.scss";
import { Button } from "@mui/material";

function UserLogin(props: { redirectRoute?: string; title?: string }) {
	const navigate = useNavigate();
	const form = createForm({
		fieldProps: userLoginFields,
		onSubmit: async (credentials: TCredentials) => {
			await UserService.login(credentials);
			navigate(props.redirectRoute || "/venue/list");
		},
	});
	const {
		fields: { email, password },
	} = form;

	return (
		<div className="user-login">
			<FormComponent form={form}>
				<h1>{props.title || "User login:"} </h1>
				<FieldComponent field={email} />
				<FieldComponent field={password} />
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
							Login
						</Button>
					)}
				/>
			</FormComponent>
		</div>
	);
}

export default UserLogin;
