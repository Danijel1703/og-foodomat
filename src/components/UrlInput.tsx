import { TInputProps } from "../types";
import TextInput from "./TextInput";

function UrlInput(props: TInputProps) {
	return <TextInput {...props} type="url" />;
}

export default UrlInput;
