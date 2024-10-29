import { TInputProps } from "../types";
import TextInput from "./TextInput";

function PhoneInput(props: TInputProps) {
	let value;
	if (props.value === undefined) {
		value = "";
	} else {
		value = isNaN(props.value) ? 0 : props.value;
	}
	return <TextInput {...props} type="tel" value={value} />;
}

export default PhoneInput;
