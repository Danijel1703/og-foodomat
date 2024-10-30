import { NavLink, useNavigate } from "react-router-dom";
import { UserService } from "../API";
import WithAuth from "../hoc/WithAuth";
import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import NoAuth from "../hoc/NoAuth";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

function Navbar() {
	const navigate = useNavigate();
	const [user, setUser] = useState<User>();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), (user: any) =>
			setUser(user)
		);

		return () => {
			unsubscribe();
		};
	}, []);

	const logout = async () => {
		await UserService.logout();
		navigate("/venue/list");
	};

	const checkIfActive = (parent: string) =>
		location.pathname.startsWith(`/${parent}`);

	return (
		<nav className="navbar">
			<div className="nav-links">
				<NavLink
					to="/venue/list"
					className={({ isActive }) =>
						isActive || checkIfActive("venue") ? "active nav-item" : "nav-item"
					}
				>
					Venues
				</NavLink>
				<WithAuth>
					<NavLink
						to="/order/list"
						className={({ isActive }) =>
							isActive || checkIfActive("order")
								? "active nav-item"
								: "nav-item"
						}
					>
						Orders
					</NavLink>
				</WithAuth>
			</div>

			<div className="user-actions">
				<NoAuth>
					<NavLink to="/user/login">
						<Button variant="contained" endIcon={<LoginIcon />}>
							Login
						</Button>
					</NavLink>
					<NavLink to="/user/register" className="nav-item">
						<Button variant="contained" endIcon={<PersonIcon />}>
							Register
						</Button>
					</NavLink>
				</NoAuth>
				<WithAuth>
					<div className="logged-user">{`${user?.displayName}`}</div>
					<NavLink to="/" className={"nav-item"} onClick={logout}>
						<Button variant="contained" name="logout" endIcon={<LoginIcon />}>
							Logout
						</Button>
					</NavLink>
				</WithAuth>
			</div>
		</nav>
	);
}

export default Navbar;
