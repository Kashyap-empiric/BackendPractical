import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await API.post("/logout");
      navigate("/login");
      console.log(response.data.message);
    } catch (err) {
      console.error(err);
      console.log("Logout failed. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="dashboard-content">
        <div className="card">
          <p>You are logged in successfully.</p>
        </div>
      </div>
    </div>
  );
}
