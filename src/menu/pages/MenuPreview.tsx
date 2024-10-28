import { Card } from "@mui/material";
import { find, groupBy, map } from "lodash-es";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { menuItemCategories } from "../../constants";
import { TMenu, TMenuItem } from "../../types";
import "../styles/MenuPreview.scss";

function MenuPreview() {
	const data: TMenu = useLoaderData() as TMenu;
	const [menu, setMenu] = useState<{ [key: string]: Array<TMenuItem> }>({});

	useEffect(() => {
		const items = map(data.menuItems, (item) => ({
			...item,
			categoryName: find(menuItemCategories, (c) => c.id === item.categoryId)
				?.label,
		}));
		setMenu(groupBy(items, "categoryName"));
	}, []);

	return (
		<div className="menu-preview">
			{map(Object.keys(menu), (category) => {
				return (
					<div className="cards">
						<h1>{category}</h1>
						{map(menu[category], ({ name, price }) => {
							return (
								<Card className="card">
									<h2>{name}</h2>
									<div className="info-section">
										<h3>Description/Ingredients</h3>
										<p>{name}</p>
									</div>
									<div className="info-section">
										<h3>Price</h3>
										<p>{price} €</p>
									</div>
								</Card>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}

export default MenuPreview;
