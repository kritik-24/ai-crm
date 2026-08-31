import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log("Login response:", data);

      localStorage.setItem("token", data.token);

      setMessage("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-2xl text-2xl font-bold shadow-lg">
            AI
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Welcome back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to manage your customers and sales.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Sign in to AI CRM
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Message */}
            {message && (
              <div className="px-4 py-3 rounded-xl bg-blue-50 text-blue-700 text-sm">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create account
            </Link>
          </p>

        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          AI CRM · Customer & Sales Management
        </p>

      </div>
    </div>
  );
}

export default Login;