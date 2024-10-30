import {
	AuthErrorCodes,
	createUserWithEmailAndPassword,
	deleteUser,
	EmailAuthProvider,
	getAuth,
	reauthenticateWithCredential,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	UserCredential,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { dbCollections, errorConstants } from "../constants";
import { TCredentials, TUser } from "../types";
import BaseService from "./BaseService";
import { isEmpty } from "lodash-es";
import db from "./db";
import { onValue, ref as dbRef } from "firebase/database";

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

			await updateProfile(userCredential.user, {
				displayName: `${user.firstName} ${user.lastName}`,
			});

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
				} else {
					delete user.image;
				}
				await this.create(user);
				return userCredential;
			} else {
				throw errorConstants.createError;
			}
		} catch (error: any) {
			throw errorConstants.createError;
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
			throw errorConstants.loginError;
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

	attachListener = (property: string, id: string, callback: Function) => {
		const path = isEmpty(property)
			? `${dbCollections.users}/${id}`
			: `${dbCollections.users}/${id}/${property}`;

		let orderRef = dbRef(db, `${path}`);
		onValue(orderRef, (snapshot) => {
			const updatedVotes = snapshot.val();
			callback(updatedVotes);
		});
	};
}

export default new UserService();
