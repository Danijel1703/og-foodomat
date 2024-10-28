import { TInputProps } from "../types";
import TextInput from "./TextInput";

function PasswordInput(props: TInputProps) {
	return <TextInput {...props} type="password" />;
}

export default PasswordInput;
