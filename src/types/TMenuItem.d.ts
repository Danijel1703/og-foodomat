type TMenuItem = {
	id: string;
	name: string;
	categoryId: string;
	description: string;
	sizeVariants: Array<{ id: string; value: string; label: string }>;
	extras: Array<{ id: string; value: string; label: string; price: number }>;
};

export default TMenuItem;
