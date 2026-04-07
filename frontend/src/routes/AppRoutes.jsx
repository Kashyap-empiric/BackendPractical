import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import Register from "../components/Register";
import About from "../components/About";
import Sessions from "../components/Sessions";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/sessions" element={<Sessions />} />
      </Route>
    </Routes>
  )
}