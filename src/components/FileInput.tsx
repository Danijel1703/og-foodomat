import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { TInputProps } from "../types";
import { CloudUploadIcon } from "../icons";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

function FileInput(props: TInputProps) {
	console.log(props.value);
	return (
		<Button
			component="label"
			role={undefined}
			variant="contained"
			tabIndex={-1}
			startIcon={<CloudUploadIcon />}
		>
			{props.value?.name || "Upload files"}
			<VisuallyHiddenInput type="file" onChange={props.onChange} multiple />
		</Button>
	);
}

export default FileInput;
