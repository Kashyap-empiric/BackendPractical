import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../services/api";

export default function ProtectedRoutes() {

  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
  let mounted = true;

  const verifySession = async () => {
    try {
      await API.get("/authcheck");
      if (mounted) setAuthState("authenticated");
    } catch {
      if (mounted) setAuthState("unauthenticated");
    }
  };

  verifySession();

  return () => { mounted = false };
}, []);


  if (authState === "loading") {
    return <div>Loading...</div>;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
