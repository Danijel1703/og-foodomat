import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import firebaseConfig from "./config";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();
const storage = getStorage();
if (location.host.includes("localhost")) {
	connectDatabaseEmulator(db, "127.0.0.1", 5001);
	connectAuthEmulator(auth, "http://127.0.0.1:5000");
	connectStorageEmulator(storage, "127.0.0.1", 5002);
}

export default db;
