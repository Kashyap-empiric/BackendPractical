import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const response = await API.post("/register", form);
      console.log(response.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      console.log(err.response.data.message);
      console.log("Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" onChange={handleChange} />

          <label>Email</label>
          <input name="email" onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} />

          <button>Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
