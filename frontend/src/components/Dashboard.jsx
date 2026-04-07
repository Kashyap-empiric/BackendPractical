import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await API.get("/dashboard");
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadDashboard();
  }, []);

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
  const about = () => {
    navigate("/about");
  }

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Dashboard</h2>
        <div>
          <button onClick={about}>About</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="card">
          <p>You are logged in successfully.</p>
          <p>{data?.message}</p>
        </div>
      </div>
    </div>
  );
}
