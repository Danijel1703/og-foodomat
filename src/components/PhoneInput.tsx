import { MuiTelInput } from "mui-tel-input";
import { TInputProps } from "../types";
import { useState } from "react";

function PhoneInput(props: TInputProps) {
	const [value, setValue] = useState("");

	return (
		<MuiTelInput
			value={value}
			placeholder="Phone"
			className={`field-input ${props.className}`}
			onChange={(value) => {
				setValue(value);
				props.onChange({
					target: {
						value,
					},
				});
			}}
		/>
	);
}

export default PhoneInput;
