import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";

function NoAuth({ children }: { children: ReactNode }) {
	const auth = getAuth();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		const redirectCallback = (user: any) => setIsAuthenticated(!!user);
		const unsubscribe = onAuthStateChanged(auth, redirectCallback);
		return () => {
			unsubscribe();
		};
	}, []);

	if (isAuthenticated) {
		return <></>;
	}
	return <>{children}</>;
}

export default NoAuth;
