import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await registerUser({
        name,
        email,
        password,
      });

      setMessage(data.message || "Registration successful!");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div>
      <h1>Create AI CRM Account</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/">Login here</Link>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
