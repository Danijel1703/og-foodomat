import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
	Button,
	Card,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Radio,
	RadioGroup,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { compact, each, filter, find, isEmpty, map, sum } from "lodash-es";
import { ChangeEvent, useEffect, useState } from "react";
import {
	MenuService,
	OrderService,
	UserService,
	VenueService,
} from "../../API";
import { orderStatuses } from "../../constants";
import { TMeal, TMenu, TMenuItem, TOrder, TVenue } from "../../types";
import { getAuth } from "firebase/auth";

type TOption = {
	id: string;
	value: string;
	label: string;
	price: number;
};

type TVariant = {
	isSelected: boolean;
} & TOption;

type TExtra = {
	isChecked: boolean;
	price: number;
} & TOption;

function MealSelect({
	order,
	update,
}: {
	order: TOrder;
	update: (order: TOrder, stateOnly?: boolean) => void;
}) {
	const [menu, setMenu] = useState<TMenu>();
	const [venue, setVenue] = useState<TVenue>();
	const [myOrder, setMyOrder] = useState<TMeal>();
	const [myOrderTotal, setMyOrderTotal] = useState(0);
	const userId = getAuth().currentUser?.uid!;
	const initialize = async () => {
		const venue = await VenueService.getById(order.venueId!);
		const menu = await MenuService.getById(venue.menuId!);
		setVenue(venue);
		setMenu(menu);
	};

	const calculateOrderTotal = () => {
		let total = 0;

		each(menu?.menuItems, (i) => {
			if (i.amount) {
				const extrasPrice = sum(
					map(
						filter(i.extras, (e: TExtra) => e.isChecked),
						(e: TExtra) => e.price
					)
				);
				const sizeVariants = sum(
					map(
						filter(i.sizeVariants, (e: TVariant) => e.isSelected),
						(e: TExtra) => e.price
					)
				);
				let price = i.amount * (i.price + extrasPrice + sizeVariants);
				total += price;
			}
		});

		setMyOrderTotal(total);
	};

	useEffect(() => {
		initialize();
		if (order.meals) {
			setMyOrder(
				find(
					order.meals,
					(i: TMeal) => i.user.id === getAuth().currentUser?.uid
				)
			);
		}
	}, [order]);

	const selectVariant = (
		_event: ChangeEvent<HTMLInputElement>,
		item: TVariant,
		variants: Array<TVariant>
	) => {
		each(variants, (variant) => {
			variant.isSelected = variant.id == item.id;
		});
		calculateOrderTotal();
	};

	const selectExtra = (event: ChangeEvent<HTMLInputElement>, item: TExtra) => {
		item.isChecked = event.target.checked;
		calculateOrderTotal();
	};

	useEffect(() => {
		OrderService.attachListener(
			"meals",
			order.id as string,
			(meals: Array<TMeal>) => {
				order.meals = meals;
			}
		);
	}, []);

	const submitOrderMeals = async () => {
		const user = await UserService.getById(getAuth().currentUser?.uid!);
		const meals = compact(
			map(menu?.menuItems, (item) => {
				if (!item.amount) return null;
				const extras = filter(item.extras, (i: TExtra) => i.isChecked);
				const extrasPrice = sum(map(extras, (e: TExtra) => e.price));
				const size: TVariant = find(
					item.sizeVariants,
					(v: TVariant) => v.isSelected
				) as TVariant;

				return {
					id: item.id,
					name: item.name,
					amount: item.amount,
					extras: map(extras, (e: TExtra) => e.label).join(",") || "",
					sizeVariant: size?.label || "",
					price: (item.price + extrasPrice + (size?.price || 0)) * item.amount,
				};
			})
		);
		if (order.meals) {
			order.meals.push({
				user: user,
				menuItems: meals,
				totalPrice: sum(map(meals, (m) => m.price)),
			});
		} else {
			order.meals = [
				{
					user: user,
					menuItems: meals,
					totalPrice: sum(map(meals, (m) => m.price)),
				},
			];
		}
		order.totalPrice = sum(map(order.meals, (m) => m.totalPrice));
		update(order);
	};

	const finishMealSelect = async () => {
		order.status = orderStatuses.readyToComplete;
		update(order);
	};

	if (!venue || !menu) return <></>;
	if (myOrder) {
		return (
			<div className="step-content">
				<h1>{venue.name}</h1>
				<Card className="menu">
					{map(myOrder.menuItems, (menuItem) => {
						const { name, amount, id, extras, sizeVariant } = menuItem;
						return (
							<>
								<div key={id} className="menu-item">
									<h2>{name}</h2>
									<div className="preview">
										<p>
											<b>Amount: </b>
											{amount}
										</p>
									</div>
									{!isEmpty(extras) && (
										<div className="preview">
											<p>
												<b>Extras: </b>
												{extras}
											</p>
										</div>
									)}
									{!isEmpty(sizeVariant) && (
										<div className="preview">
											<p>
												<b>Size: </b>
												{sizeVariant}
											</p>
										</div>
									)}
								</div>
								<Divider variant="fullWidth" />
							</>
						);
					})}
				</Card>
				<h2 className="order-total">My order total: {order.totalPrice} €</h2>
				<div className="submit-actions">
					{order.orderAdminId === userId && (
						<Button onClick={finishMealSelect}>Next</Button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="step-content">
			<h1>{venue.name}</h1>
			<Card className="menu">
				{map(menu.menuItems, (menuItem) => {
					const { name, description, price, sizeVariants, extras, id } =
						menuItem;
					return (
						<>
							<div key={id} className="menu-item">
								<h2>{name}</h2>
								<div className="info-section">
									<h3>Description/Ingredients</h3>
									<p>
										<i>{description}</i>
									</p>
								</div>
								<div className="info-section">
									<h3>Price</h3>
									<p>{price} €</p>
								</div>
								{!isEmpty(sizeVariants) && (
									<div className="info-section">
										<h3>Size variants</h3>
										<div>
											<RadioGroup name="radio-buttons-group">
												{map(sizeVariants, (variant: TVariant) => (
													<FormControlLabel
														key={variant.id}
														value={variant.id}
														onChange={(event) =>
															selectVariant(
																event as ChangeEvent<HTMLInputElement>,
																variant as TVariant,
																sizeVariants as Array<TVariant>
															)
														}
														control={<Radio />}
														label={
															<p>
																&nbsp; {variant.label} (+{variant.price} €)
															</p>
														}
													/>
												))}
											</RadioGroup>
										</div>
									</div>
								)}
								{!isEmpty(extras) && (
									<div className="info-section">
										<h3>Extras</h3>
										{map(extras, (extra: TExtra) => (
											<div key={extra.id}>
												<FormControlLabel
													control={<Checkbox />}
													label={`${extra.label} (+${extra.price} €)`}
													onChange={(e) =>
														selectExtra(
															e as ChangeEvent<HTMLInputElement>,
															extra
														)
													}
												/>
											</div>
										))}
									</div>
								)}
								<div className="info-section">
									<h3>Amount</h3>
									<AmountInput
										calculateOrderTotal={calculateOrderTotal}
										item={menuItem}
									/>
								</div>
							</div>
							<Divider variant="fullWidth" />
						</>
					);
				})}
			</Card>
			<h2 className="order-total">My order total: {myOrderTotal} €</h2>
			<div className="submit-actions">
				<Button
					variant="contained"
					onClick={submitOrderMeals}
					endIcon={<CheckIcon />}
					sx={{ marginRight: "1vw" }}
					disabled={myOrderTotal === 0} //Shortcut for checking if no items are added
				>
					Submit order
				</Button>
				{order.orderAdminId === userId && (
					<Button onClick={finishMealSelect} disabled={true}>
						Next
					</Button>
				)}
			</div>
		</div>
	);
}

function AmountInput({
	item,
	calculateOrderTotal,
}: {
	item: TMenuItem;
	calculateOrderTotal: () => void;
}) {
	const [amount, setAmount] = useState<number>(Number(item.amount) || 0);

	const handleDecrement = () => {
		if (item.amount) item.amount = item.amount - 1;
		setAmount(item.amount as number);
		calculateOrderTotal();
	};

	const handleIncrement = () => {
		item.amount = item.amount! + 1;
		if (!item.amount) item.amount = 1;
		setAmount(item.amount as number);
		calculateOrderTotal();
	};

	return (
		<div className="meal-amount">
			<div className="input">
				<InputAdornment position="start">
					<IconButton onClick={handleDecrement} disabled={amount! <= 0}>
						<RemoveCircleIcon color={amount! <= 0 ? "disabled" : "error"} />
					</IconButton>
				</InputAdornment>
				<span className="amount">{amount}</span>
				<InputAdornment position="end">
					<IconButton onClick={handleIncrement}>
						<AddCircleIcon color="success" />
					</IconButton>
				</InputAdornment>
			</div>
		</div>
	);
}

export default MealSelect;
