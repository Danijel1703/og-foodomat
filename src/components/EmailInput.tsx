import { TInputProps } from "../types";
import TextInput from "./TextInput";

function EmailInput(props: TInputProps) {
	return <TextInput {...props} type="email" />;
}

export default EmailInput;
