import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ai-crm-z8k9.onrender.com/api/auth/forgot-password",
        { email }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1000);
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to send password reset OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            AI
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Forgot password?
          </h1>

          <p className="text-slate-500 mt-3">
            Enter your registered email address and we'll send you an OTP.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8">

          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Reset your password
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition shadow-sm"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* Back */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;