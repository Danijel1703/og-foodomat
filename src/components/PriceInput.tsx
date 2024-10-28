import {
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from "@mui/material";
import { TInputProps } from "../types";

function PriceInput(props: TInputProps) {
	return (
		<FormControl fullWidth className={`${props.className} field-input`}>
			<InputLabel
				required={props.isRequired}
				htmlFor="outlined-adornment-amount"
			>
				{props.label}
			</InputLabel>
			<OutlinedInput
				required={props.isRequired}
				id="outlined-adornment-amount"
				onChange={props.onChange}
				type="number"
				value={props.value || 0}
				disabled={props.disabled}
				startAdornment={<InputAdornment position="start">€</InputAdornment>}
				label={props.label}
			/>
		</FormControl>
	);
}

export default PriceInput;
