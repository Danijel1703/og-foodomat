import { createForm, FormGenerator } from "synergy-form-generator";
import { userCreateFields } from "../form-fields";
import { UserService } from "../../API";
import { TUser } from "../../types";

const UserCreate = () => {
	const form = createForm({
		fieldProps: userCreateFields,
		onSubmit: async (user: TUser) => {
			await UserService.register(user);
		},
	});
	return <FormGenerator form={form} />;
};

export default UserCreate;
