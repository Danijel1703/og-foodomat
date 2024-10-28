import { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { OrderService } from "../../API";
import { orderStatuses } from "../../constants";
import { TOrder } from "../../types";
import { MealSelect, VenueSelect } from "../components";
import OrderPreview from "./OrderPreview";
import { Step, StepLabel, Stepper } from "@mui/material";
import { generateId, getAuth } from "../../utils";
import "../styles/OrderEdit.scss";
import { find, indexOf } from "lodash-es";
import { UserLogin } from "../../user/pages";

const steps = [
	{
		label: "Venue select",
		status: orderStatuses.venueSelect,
		activeStep: false,
	},
	{ label: "Meal Select", status: orderStatuses.mealSelect, activeStep: false },
	{
		label: "Order Summary",
		status: orderStatuses.readyToComplete,
		activeStep: false,
	},
];

function OrderEdit() {
	const initialOrder = useLoaderData() as TOrder;
	const [order, setOrder] = useState(initialOrder);
	const [activeStep, setActiveStep] = useState<number>(0);
	const update = async (updatedOrder: TOrder, stateOnly?: boolean) => {
		let response: TOrder = updatedOrder;
		if (!stateOnly) {
			response = await OrderService.update(updatedOrder);
		}
		setOrder({ ...response });
	};

	useEffect(() => {
		OrderService.attachListener("", order.id!, (order: TOrder) =>
			update(order, true)
		);
		setActiveStep(
			indexOf(
				steps,
				find(steps, (step) => step.status === order.status)
			)
		);
	}, [order.status]);

	if (!getAuth().currentUser?.uid) {
		return (
			<div>
				<RenderLogin />
			</div>
		);
	}

	return (
		<div className="stepper-wrapper">
			<div className="stepper">
				<Stepper activeStep={activeStep}>
					{steps.map(({ label, status }, index) => {
						return (
							<Step
								key={generateId()}
								completed={
									index < activeStep ||
									(index === steps.length - 1 && status === order.status)
								}
							>
								<StepLabel>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				<RenderStep order={order} update={update} />
			</div>
		</div>
	);
}

function RenderLogin() {
	const location = useLocation();
	return (
		<UserLogin
			redirectRoute={location.pathname}
			title="Log in to make order:"
		/>
	);
}

function RenderStep({
	order,
	update,
}: {
	order: TOrder;
	update: (order: TOrder, stateOnly?: boolean) => void;
}) {
	switch (order.status) {
		case orderStatuses.venueSelect: {
			return <VenueSelect order={order} update={update} />;
		}
		case orderStatuses.mealSelect: {
			return <MealSelect order={order} update={update} />;
		}
		case orderStatuses.readyToComplete: {
			return <OrderPreview order={order} update={update} />;
		}
	}
}

export default OrderEdit;
