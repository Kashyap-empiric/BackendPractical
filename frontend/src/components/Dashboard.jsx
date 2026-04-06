export default function Dashboard() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
