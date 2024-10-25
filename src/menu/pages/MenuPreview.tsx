import { useLoaderData } from "react-router-dom";

function MenuPreview() {
	const menu = useLoaderData();
	console.log(menu);
	return <div></div>;
}

export default MenuPreview;
