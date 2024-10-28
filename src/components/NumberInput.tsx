import { TInputProps } from "../types";
import TextInput from "./TextInput";

function NumberInput(props: TInputProps) {
	return <TextInput {...props} type="number" />;
}

export default NumberInput;
