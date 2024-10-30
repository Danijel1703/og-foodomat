import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	createForm,
	FieldComponent,
	FormComponent,
	Submit,
} from "synergy-form-generator";
import { UserService } from "../../API";
import { TCredentials } from "../../types";
import { errorToast } from "../../utils";
import { userLoginFields } from "../form-fields";
import "../styles/UserLogin.scss";

function UserLogin(props: { redirectRoute?: string; title?: string }) {
	const navigate = useNavigate();
	const form = createForm({
		fieldProps: userLoginFields,
		onSubmit: async (credentials: TCredentials) => {
			try {
				await UserService.login(credentials);
				navigate(props.redirectRoute || "/venue/list");
			} catch (error) {
				errorToast(error as string);
			}
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
							name="login-submit"
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
