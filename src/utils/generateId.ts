import { v4 as uuid } from "uuid";

function generateId() {
	return uuid();
}

export default generateId;
