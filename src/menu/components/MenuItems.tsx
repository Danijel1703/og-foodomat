import { filter, isEmpty, map } from "lodash-es";
import MenuItemEditForm from "./MenuItemEditForm";
import MenuItemCreateForm from "./MenuItemCreateForm";
import { useEffect, useState } from "react";
import { TMenuItem } from "../../types";
import { generateId } from "../../utils";
import { TForm } from "synergy-form-generator";

function MenuItems({ form }: { form: TForm }) {
	const defaultItems = form.fields.menuItems.value
		? map(form.fields.menuItems.value, (i) => ({ ...i, domId: generateId() }))
		: [];
	const [items, setMenuItems] = useState<Array<TMenuItem>>(defaultItems);
	const addItem = (item: TMenuItem) => {
		item.domId = generateId();
		if (!item.sizeVariants) {
			item.sizeVariants = [];
		}
		if (!item.extras) {
			item.extras = [];
		}
		setMenuItems([...items, item]);
	};
	const editItem = (item: TMenuItem) => {
		setMenuItems((oldItems) =>
			map(oldItems, (i) => {
				if (item.id === i.id) {
					return item;
				} else {
					return i;
				}
			})
		);
	};
	const removeItem = (item: TMenuItem) => {
		setMenuItems(filter(items, (i) => i.domId !== item.domId));
	};

	useEffect(() => {
		const {
			fields: { menuItems },
		} = form;
		menuItems.setValue(items);
	}, [items]);

	return (
		<>
			<h1 className="menu-items-title">Menu item</h1>
			<MenuItemCreateForm addItem={addItem} />
			{!isEmpty(items) && (
				<>
					<h1 className="added-items-title">Added menu items</h1>
					{map(items, (item) => (
						<MenuItemEditForm
							key={generateId()}
							item={item}
							editItem={editItem}
							removeItem={removeItem}
						/>
					))}
				</>
			)}
		</>
	);
}

export default MenuItems;
