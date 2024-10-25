import TBaseEntity from "./TBaseEntity";

type TUser = {
	firstName: string;
	lastName: string;
	password: string;
	username: string;
	email: string;
	lastLogin?: Date;
	imageUrl: string;
	image?: File;
	status: string;
} & TBaseEntity;

export default TUser;