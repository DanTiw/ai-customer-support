import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyAXuIKG51Iwmm3JcJvr54Un0TA_mBS3rgE",
	authDomain: "chat-assitant.firebaseapp.com",
	projectId: "chat-assitant",
	storageBucket: "chat-assitant.appspot.com",
	messagingSenderId: "101758648692",
	appId: "1:101758648692:web:bbf225efb3f0d0464d6c21",
	measurementId: "G-P0YEY296MY",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export const initFirebase = () => {
	if (typeof window !== "undefined" && !getApps().length) {
		const app = initializeApp(firebaseConfig);
		return getFirestore(app);
	}
};

export const getFirebaseApp = () => {
	if (typeof window !== "undefined") {
		return getApps()[0];
	}
	return null;
};
export { db, auth };
