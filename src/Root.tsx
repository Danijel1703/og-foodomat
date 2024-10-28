import { ThemeProvider } from "@mui/material";
import { show } from "react-global-loading";
import { Outlet } from "react-router-dom";
import { setComponents } from "synergy-form-generator";
import {
	EmailInput,
	FileInput,
	Header,
	Navbar,
	NumberInput,
	PasswordInput,
	PriceInput,
	TextInput,
	UrlInput,
} from "./components";
import theme from "./theme";

function Root() {
	setComponents({
		text: TextInput,
		email: EmailInput,
		url: UrlInput,
		number: NumberInput,
		price: PriceInput,
		password: PasswordInput,
		file: FileInput,
	});
	show();
	return (
		<ThemeProvider theme={theme}>
			<Header />
			<Navbar />
			<Outlet />
		</ThemeProvider>
	);
}

export default Root;
