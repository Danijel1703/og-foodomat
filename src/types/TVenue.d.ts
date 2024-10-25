import TBaseEntity from "./TBaseEntity";

type TVenue = {
	menuId?: string;
	name: string;
	description: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
	phoneNumber: number;
	email: string;
	websiteUrl: string;
} & TBaseEntity;

export default TVenue;
