import {
	AuthErrorCodes,
	createUserWithEmailAndPassword,
	deleteUser,
	EmailAuthProvider,
	getAuth,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signOut,
	UserCredential,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { dbCollections, errorConstants } from "../constants";
import { TCredentials, TUser } from "../types";
import BaseService from "./BaseService";

class UserService extends BaseService<TUser> {
	constructor() {
		super(dbCollections.users);
	}

	register = async (user: TUser) => {
		const { email, password, image } = user;
		try {
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const id = userCredential.user.uid;
			user.id = id;
			if (userCredential) {
				if (image) {
					const metadata = {
						contentType: "image/jpg",
					};
					const storage = getStorage();
					const storageRef = ref(storage, `images/${image.name}`);
					const snapshot = await uploadBytes(storageRef, image, metadata);
					const downloadUrl = await getDownloadURL(snapshot.ref);
					user.imageUrl = downloadUrl;
				}
				await this.create(user);
				return userCredential;
			} else {
				throw errorConstants.unknownError;
			}
		} catch (error: any) {
			if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
				throw errorConstants.emailAlreadyExists;
			}
			throw errorConstants.unknownError;
		}
	};

	logout = async () => {
		try {
			await signOut(getAuth());
		} catch (error) {
			throw error;
		}
	};

	login = async ({ email, password }: TCredentials) => {
		try {
			const auth = getAuth();
			const userCredential: UserCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			return userCredential;
		} catch (error) {
			throw errorConstants.unknownError;
		}
	};

	getUsers = async () => {
		try {
			return await this.get();
		} catch (error) {
			throw error;
		}
	};

	deleteUser = async () => {
		try {
			const userToDelete = getAuth().currentUser;
			if (!userToDelete) return;
			const userCreds = await this.getById(userToDelete.uid);
			const credential = EmailAuthProvider.credential(
				userCreds.email,
				userCreds.password
			);
			reauthenticateWithCredential(userToDelete, credential);
			if (userToDelete) {
				await this.delete(userToDelete.uid);
				await deleteUser(userToDelete);
			}
		} catch (error: any) {
			throw error;
		}
	};

	updateUser = async (entity: TUser) => {
		try {
			await this.update(entity);
		} catch (error) {
			throw error;
		}
	};
}

export default new UserService();
