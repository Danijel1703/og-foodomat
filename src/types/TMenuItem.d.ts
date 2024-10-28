type TMenuItem = {
	id: string;
	name: string;
	categoryId: string;
	description: string;
	price: number;
	sizeVariants: Array<{
		id: string;
		value: string;
		label: string;
		price: number;
	}>;
	extras: Array<{
		id: string;
		value: string;
		label: string;
		price: number;
	}>;
	domId?: string;
	amount?: number;
};

export default TMenuItem;
