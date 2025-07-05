import { useContext, useState } from "react";
import { loginUser } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    if (res.token) {
      login(res.token);
      navigate("/dashboard");
    } else {
      alert(res.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
