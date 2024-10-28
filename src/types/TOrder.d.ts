import TBaseEntity from "./TBaseEntity";
import TMenuItem from "./TMenuItem";
import TUser from "./TUser";
import TVenue from "./TVenue";

type TOrder = {
	orderAdminId: string;
	orderAdmin: string;
	users: Array<TUser>;
	venueVotes: Array<TVenueVote>;
	status: string;
	venueId?: string;
	meals: Array<TMeal>;
	totalPrice: number;
	orderNumber: number;
} & TBaseEntity;

export default TOrder;
