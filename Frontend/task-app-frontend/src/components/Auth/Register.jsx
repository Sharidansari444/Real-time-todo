import { useState,  } from "react";
import { registerUser, } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  // const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    if (res._id) {
      // // auto-login immediately
      // const loginRes = await loginUser({
      //   username: form.email,
      //   password: form.password,
      // });
      // if (loginRes.token) {
      //   login(loginRes.token);
      //   navigate("/dashboard");
      // } else {
      //   alert("Registration succeeded but login failed");
      // }
      navigate("/")
    } else {
      alert(res.error || "Error registering");
    }
  };

  return (
    <div className="auth-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Register</button>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
}
