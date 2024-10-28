import { TextField } from "@mui/material";
import { isEmpty, isNil } from "lodash-es";
import { TInputProps } from "../types";

function TextInput(props: TInputProps) {
	const {
		type,
		error,
		placeholder,
		label,
		value,
		onChange,
		isRequired,
		disabled,
	} = props;

	return (
		<TextField
			error={!isEmpty(error)}
			helperText={error}
			onChangeCapture={onChange}
			placeholder={placeholder}
			value={isNil(value) ? "" : value}
			disabled={disabled}
			required={isRequired}
			className={`field-input ${props.className}`}
			label={label}
			type={type}
		/>
	);
}

export default TextInput;
