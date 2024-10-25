import { map, uniqBy } from "lodash-es";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
	TDropdownStore,
	TFieldComponentType,
	TSelectableItem,
	TSynergyRules,
} from "synergy-form-generator";

function DropdownInput(props: {
	onChange: Function;
	placeholder: string;
	label: string;
	value: any;
	className?: string;
	isValid: boolean;
	error?: string;
	rules: TSynergyRules;
	disabled: boolean;
	items?: Array<TSelectableItem>;
	dropdownStore?: TDropdownStore;
	type: TFieldComponentType;
	isRequired?: boolean;
	fieldClassName?: string;
	labelClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
	addOption: (item: TSelectableItem) => void;
	removeOption: (item: TSelectableItem) => void;
	setValue: (value: any) => void;
}) {
	const { dropdownStore } = props;
	const { getItems } = dropdownStore as TDropdownStore;
	const [items, setItems] = useState<Array<TSelectableItem>>([]);

	const fetchItems = async () => {
		const response = (await getItems()) as unknown as Array<TSelectableItem>;
		setItems((i: Array<TSelectableItem>) => {
			return uniqBy([...response, ...i], "id");
		});
	};

	const selectItem = (value: SingleValue<TSelectableItem>) => {
		setItems((oldItems) =>
			map(oldItems, (i) => ({ ...i, isSelected: i.id === value?.id }))
		);
		props.onChange(value);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<Select
			onMenuOpen={fetchItems}
			options={items}
			onChange={selectItem}
			closeMenuOnSelect={true}
			onMenuScrollToBottom={getItems}
			className={props.className}
		/>
	);
}

export default DropdownInput;
