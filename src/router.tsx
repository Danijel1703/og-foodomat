import { createBrowserRouter, redirect } from "react-router-dom";
import { MenuService, OrderService, VenueService } from "./API";
import { MenuCreate, MenuEdit, MenuPreview } from "./menu/pages";
import { OrderEdit, OrderList } from "./order/pages";
import Root from "./Root";
import { UserCreate, UserLogin } from "./user/pages";
import { VenueCreate, VenueEdit, VenueList } from "./venue/pages";
import { getAuth } from "firebase/auth";

const authPromise = async () => {
	const auth = getAuth();
	await auth.authStateReady();
	return auth;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		loader: async () => {
			await authPromise();
			return null;
		},
		children: [
			{
				path: "user",
				children: [
					{
						path: "register",
						loader: async () => {
							const auth = await authPromise();
							if (auth.currentUser) {
								return redirect("/venue/list");
							}
							return null;
						},
						element: <UserCreate />,
					},
					{
						path: "login",
						loader: async () => {
							const auth = await authPromise();
							if (auth.currentUser) {
								return redirect("/venue/list");
							}
							return null;
						},
						element: <UserLogin />,
					},
				],
			},
			{
				path: "venue",
				children: [
					{
						path: "create",
						element: <VenueCreate />,
					},
					{
						path: "list",
						element: <VenueList />,
					},
					{
						loader: async ({ params }) => {
							const venue = await VenueService.getById(params.id as string);
							return venue;
						},
						path: ":id",
						element: <VenueEdit />,
					},
				],
			},
			{
				path: "menu",
				children: [
					{
						path: "create/:menuId",
						loader: async ({ params }) => {
							const venue = await VenueService.getById(params.menuId as string);
							return venue;
						},
						element: <MenuCreate />,
					},
					{
						path: "preview/:id",
						loader: async ({ params }) => {
							const menu = await MenuService.getById(params.id as string);
							return menu;
						},
						element: <MenuPreview />,
					},
					{
						path: "edit/:id",
						loader: async ({ params }) => {
							const menu = await MenuService.getById(params.id as string);
							return menu;
						},
						element: <MenuEdit />,
					},
				],
			},
			{
				path: "order",
				children: [
					{
						path: "list",
						loader: async () => {
							const response = await OrderService.get();
							return response.items;
						},
						element: <OrderList />,
					},
					{
						path: "edit/:id",
						loader: async ({ params }) => {
							const order = await OrderService.getById(params.id as string);
							return order;
						},
						element: <OrderEdit />,
					},
				],
			},
		],
	},
]);

export default router;
