import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { setComponents } from "synergy-form-generator";
import {
	EmailInput,
	FileInput,
	Header,
	Navbar,
	NumberInput,
	PasswordInput,
	PhoneInput,
	PriceInput,
	TextInput,
	UrlInput,
} from "./components";
import theme from "./theme";

setComponents({
	text: TextInput,
	email: EmailInput,
	url: UrlInput,
	number: NumberInput,
	price: PriceInput,
	password: PasswordInput,
	file: FileInput,
	tel: PhoneInput,
});

function Root() {
	return (
		<ThemeProvider theme={theme}>
			<Header />
			<Navbar />
			<Outlet />
		</ThemeProvider>
	);
}

export default Root;
