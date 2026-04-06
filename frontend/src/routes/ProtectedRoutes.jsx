import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../services/api";

function ProtectedRoutes() {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await API.get("/dashboard");
                setIsAuth(true);
            } catch (err) {
                setIsAuth(false);
                console.error(err);
            }
        };
        checkAuth();
    }, []);

    if (isAuth === false) {
        return <Navigate to="/login" replace />;
    }
    if (isAuth === true) {
        return <Outlet />;
    }
}

export default ProtectedRoutes;