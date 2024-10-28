import { find, map, uniqBy } from "lodash-es";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
	TDropdownStore,
	TFieldComponentType,
	TSelectableItem,
	TSynergyRules,
} from "synergy-form-generator";
import { generateId } from "../utils";
import chroma from "chroma-js";

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
	items?: Array<TSelectableItem | any>;
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
	const [defaultItem, setDefaultItem] = useState<TSelectableItem>();
	const [refKey, setRefKey] = useState<string>();
	const [initialized, setInitialized] = useState(false);

	const fetchItems = async () => {
		const response = (await getItems()) as unknown as Array<TSelectableItem>;
		let it: Array<TSelectableItem> = [];
		setItems((i: Array<TSelectableItem>) => {
			it = uniqBy([...response, ...i], "id");
			return it;
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

	useEffect(() => {
		const defaultValue = find(items, (i) => i.id === props.value);
		if (defaultValue && !initialized) {
			setDefaultItem(find(items, (i) => i.id === props.value));
			setRefKey(generateId()); //We have to force re-render since defaultValue is not controlled prop
			setInitialized(true);
		}
	}, [items]);

	const color = chroma("#4caf50");

	return (
		<Select
			key={refKey}
			onMenuOpen={fetchItems}
			options={items}
			defaultValue={defaultItem}
			onChange={selectItem}
			closeMenuOnSelect={true}
			onMenuScrollToBottom={getItems}
			className={`${props.className} field-input react-select`}
			styles={{
				control: (base) => ({
					...base,
					"&:hover": { borderColor: "gray" },
					border: "1px solid lightgray",
					boxShadow: "none",
				}),
				option: (base, { data, isDisabled, isFocused, isSelected }) => ({
					...base,
					backgroundColor: isDisabled
						? undefined
						: isSelected
						? "#4caf50"
						: isFocused
						? color.alpha(0.1).css()
						: undefined,
					":active": {
						...base[":active"],
						backgroundColor: !isDisabled
							? isSelected
								? data.color
								: color.alpha(0.3).css()
							: undefined,
					},
				}),
			}}
			isDisabled={props.disabled}
			placeholder={props.placeholder}
		/>
	);
}

export default DropdownInput;
