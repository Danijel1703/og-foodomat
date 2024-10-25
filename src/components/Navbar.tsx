import { NavLink } from "react-router-dom";
import NoAuth from "../hoc/NoAuth";
import WithAuth from "../hoc/WithAuth";
import { UserService } from "../API";

function Navbar() {
	const logout = async () => await UserService.logout();
	return (
		<nav>
			<NavLink to="/venue/list">Venues</NavLink>
			<NoAuth>
				<NavLink to="/user/login">Login</NavLink>
			</NoAuth>
			<WithAuth>
				<NavLink to="/" onClick={logout}>
					Logout
				</NavLink>
			</WithAuth>
		</nav>
	);
}

export default Navbar;
