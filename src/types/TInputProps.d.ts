type TInputProps = {
	onChange: ChangeEventHandler<HTMLInputElement>;
	placeholder: string;
	label: string;
	value: any;
	className?: string;
	isValid?: boolean;
	error?: string;
	disabled?: boolean;
	isRequired?: boolean;
	type?: string;
};

export default TInputProps;
