import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function About() {
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
  const dashboard = () => {
    navigate("/dashboard");
  }
  const sessions = async () => {
    navigate("/sessions");
  };
  return (
    <div className="about">
      <div className="navbar">
        <h2>About</h2>
        <div>
          <button onClick={sessions}>Sessions</button>
          <button onClick={dashboard}>Dashboard</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="content">
        <div className="card">
          <p>This is the About page</p>
        </div>
      </div>
    </div>
  );
}
