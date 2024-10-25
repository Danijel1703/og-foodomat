import { UserCredential } from "firebase/auth";
import TAuth from "./TCredentials";
import TUser from "./TUser";

interface TUserService {
	register: (auth: TUser) => Promise<UserCredential>;
	login: (auth: TAuth) => Promise<UserCredential>;
	getUsers: () => Promise<TListResponse<TUser>>;
	logout: () => Promise<void>;
	deleteUser: () => Promise<void>;
	updateUser: (user: TUser) => Promise<void>;
}

export default TUserService;
