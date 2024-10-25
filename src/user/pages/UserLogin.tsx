import { useNavigate } from "react-router-dom";
import { createForm, FormGenerator } from "synergy-form-generator";
import { UserService } from "../../API";
import { TCredentials } from "../../types";
import { userLoginFields } from "../form-fields";

function UserLogin() {
	const navigate = useNavigate();
	const form = createForm({
		fieldProps: userLoginFields,
		onSubmit: async (credentials: TCredentials) => {
			await UserService.login(credentials);
			navigate("/");
		},
	});
	return <FormGenerator form={form} />;
}

export default UserLogin;
