import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../API/config";

function getFirebaseAuth() {
	initializeApp(firebaseConfig);
	const auth = getAuth();
	return auth;
}

export default getFirebaseAuth;
