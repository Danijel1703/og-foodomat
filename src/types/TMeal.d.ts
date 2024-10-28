import TUser from "./TUser";

type TMeal = {
	user: TUser;
	menuItems: Array<{
		id: string;
		name: string;
		amount: number;
		extras: string;
		sizeVariant: string;
	}>;
	totalPrice: number;
};

export default TMeal;
