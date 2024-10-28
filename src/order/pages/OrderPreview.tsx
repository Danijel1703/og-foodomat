import { isEmpty, map } from "lodash-es";
import { TMeal, TOrder } from "../../types";
import { getAuth } from "../../utils";
import React, { useEffect } from "react";
import { OrderService } from "../../API";
import { Card, Divider } from "@mui/material";

function OrderPreview({
	order,
	update,
}: {
	order: TOrder;
	update: (order: TOrder, stateOnly?: boolean) => void;
}) {
	const userId = getAuth().currentUser?.uid;

	useEffect(() => {
		OrderService.attachListener(
			"meals",
			order.id as string,
			(meals: Array<TMeal>) => {
				order.meals = meals;
				update(order, true);
			}
		);
	}, []);

	return (
		<div className="step-content">
			<h1>Order summary</h1>
			<Card className="order-summary">
				{map(order.meals, (meal: TMeal) => {
					return (
						<>
							<div key={meal.user.id} className="menu-item">
								<h2>
									{meal.user.id === userId
										? "Your Order"
										: `${meal.user.firstName} ${meal.user.lastName}`}
								</h2>
								{map(
									meal.menuItems,
									({ extras, name, amount, sizeVariant, id }) => {
										return (
											<React.Fragment key={id}>
												<div className="preview">
													<p>
														<b>Menu Item: </b>
														{name}
													</p>
												</div>
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
											</React.Fragment>
										);
									}
								)}
								<div className="user-order-total">
									<b>User order total:</b> &nbsp;{meal.totalPrice} €
								</div>
							</div>
							<Divider variant="fullWidth" />
						</>
					);
				})}
			</Card>
			<h2 className="order-total">Order total: {order.totalPrice} €</h2>
		</div>
	);
}

export default OrderPreview;
