import { Button, Card } from "@mui/material";
import { map, max, orderBy } from "lodash-es";
import { useLoaderData, useNavigate } from "react-router-dom";
import { OrderService, UserService } from "../../API";
import { orderStatuses } from "../../constants";
import { AddIcon, VisibilityIcon } from "../../icons";
import { TOrder } from "../../types";
import { getAuth } from "../../utils";
import "../styles/OrderList.scss";
import moment from "moment";

function OrderList() {
	const navigate = useNavigate();
	const orders = orderBy(
		useLoaderData() as Array<TOrder>,
		"orderNumber",
		"desc"
	);
	const createOrder = async () => {
		const user = await UserService.getById(getAuth().currentUser?.uid!);
		const response = await OrderService.get();
		const latestOrders = response.items.reverse();
		const orderNumber =
			max(map(latestOrders, (order) => order.orderNumber)) || 0;
		const order: TOrder = {
			venueVotes: [],
			users: [],
			meals: [],
			orderAdminId: user?.id as string,
			orderAdmin: `${user?.firstName} ${user?.lastName}`,
			status: orderStatuses.venueSelect,
			totalPrice: 0,
			orderNumber: orderNumber! + 1,
		};
		const { id } = await OrderService.create(order);
		navigate(`/order/edit/${id}`);
	};

	const viewOrder = (id: string) => navigate(`/order/edit/${id}`);

	return (
		<div className="order-list">
			<Button
				onClick={createOrder}
				variant="contained"
				endIcon={<AddIcon />}
				className="create-order"
				sx={{ alignSelf: "flex-end" }}
			>
				Create Order
			</Button>
			<div className="cards">
				{map(orders, (order) => {
					return (
						<Card key={order.id} className="card">
							<b>Order - #{order.orderNumber}</b>
							<b>Order Admin - {order.orderAdmin}</b>
							<b>Date Created - {moment(order.dateCreated).format("LLL")}</b>
							<Button
								variant="outlined"
								className="view-order"
								onClick={() => viewOrder(order.id!)}
								endIcon={<VisibilityIcon />}
							>
								VIEW ORDER
							</Button>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

export default OrderList;
