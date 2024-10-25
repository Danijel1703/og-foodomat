import { createBrowserRouter, redirect } from "react-router-dom";
import Root from "./Root";
import { UserCreate, UserLogin } from "./user/pages";
import { VenueCreate, VenueEdit, VenueList } from "./venue/pages";
import { getAuth } from "./utils";
import { MenuCreate, MenuPreview } from "./menu/pages";
import { MenuService, VenueService } from "./API";

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
						element: <UserCreate />,
					},
					{
						path: "login",
						loader: async () => {
							const auth = await authPromise();
							if (auth.currentUser) {
								return redirect("/");
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
						path: "create",
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
				],
			},
		],
	},
]);

export default router;
