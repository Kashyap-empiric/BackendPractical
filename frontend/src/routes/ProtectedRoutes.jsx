import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../services/api";

export default function ProtectedRoutes() {

  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const verifySession = async () => {
      try {
        await API.get("/authcheck");
        setAuthState("authenticated");
      } catch (err) {
        console.error("Session verification failed:", err);
        setAuthState("unauthenticated");
      }
    };
    verifySession();
  }, []);

  if (authState === "loading") {
    return <div>Loading...</div>;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
