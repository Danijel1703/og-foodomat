import { dbCollections } from "../constants";
import { TVenue } from "../types";
import BaseService from "./BaseService";

class VenueService extends BaseService<TVenue> {
	constructor() {
		super(dbCollections.venues);
	}
}

export default new VenueService();
