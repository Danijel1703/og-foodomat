import { dbCollections } from "../constants";
import { TMenu } from "../types";
import BaseService from "./BaseService";
import VenueService from "./VenueService";

class MenuService extends BaseService<TMenu> {
	constructor() {
		super(dbCollections.menus);
	}

	createMenu = async (menu: TMenu) => {
		try {
			console.log(menu);
			const { id } = await this.create(menu);
			const venueId = menu.venueId;
			const venue = await VenueService.getById(venueId);
			venue.menuId = id;
			await VenueService.update(venue);
		} catch (error) {
			throw error;
		}
	};
}

export default new MenuService();
