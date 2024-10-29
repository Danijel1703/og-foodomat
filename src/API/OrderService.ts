import { onValue, ref } from "firebase/database";
import { dbCollections } from "../constants";
import { TOrder } from "../types";
import BaseService from "./BaseService";
import { isEmpty } from "lodash-es";
import db from "./db";

class OrderService extends BaseService<TOrder> {
	constructor() {
		super(dbCollections.orders);
	}

	attachListener = (property: string, id: string, callback: Function) => {
		const path = isEmpty(property)
			? `${dbCollections.orders}/${id}`
			: `${dbCollections.orders}/${id}/${property}`;

		let orderRef = ref(db, `${path}`);
		onValue(orderRef, (snapshot) => {
			const updatedVotes = snapshot.val();
			callback(updatedVotes);
		});
	};
}

export default new OrderService();
