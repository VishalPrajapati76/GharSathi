import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import Toast from "../common/Toast";

//axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const showToast = (type, message) => setToast({ show: true, type, message });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      showToast("error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await instance.post(
        "/api/login",
        { email: data.email, password: data.password }
      );

      if (res.data?.success) {
        showToast("success", res.data.message || "Login success");
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const user = res.data.user;

        setTimeout(() => {
          if (user.type === "Admin") {
            navigate("/adminhome");
          } else if (user.type === "Renter") {
            navigate("/renterhome");
          } else if (user.type === "Owner") {
            if (user.granted === "ungranted") {
              showToast("error", "Owner account not approved by admin yet");
              navigate("/login");
            } else {
              navigate("/ownerhome");
            }
          } else {
            navigate("/login");
          }
        }, 900);
      } else {
        showToast("error", res.data?.message || "Login failed");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg shadow-md py-4 px-8 flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-indigo-400 tracking-wide">
          GharSathi
        </h2>
        <div className="space-x-8 text-lg">
          <Link to="/" className="text-gray-200 hover:text-indigo-400 transition">
            Home
          </Link>
          <Link to="/login" className="text-gray-200 hover:text-indigo-400 transition">
            Login
          </Link>
          <Link
            to="/register"
            className="text-black bg-indigo-400 px-4 py-2 rounded-lg shadow hover:bg-indigo-500 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4 pt-24 pb-10">
        <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/60 backdrop-blur shadow-2xl">
          {/* Left panel */}
          <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-b from-indigo-600/20 to-transparent">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-200 text-sm">
                🔑 Secure Sign-in
              </div>

              <h1 className="mt-6 text-4xl font-extrabold text-white leading-tight">
                Welcome back
                <span className="block text-indigo-300">to GharSathi.</span>
              </h1>

              <p className="mt-4 text-gray-300">
                Login to explore listings, manage properties, and track bookings.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-200">
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Saved Sessions</p>
                  <p className="mt-1 text-gray-400">Cookie-based auth</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Quick Access</p>
                  <p className="mt-1 text-gray-400">Admin / Owner / Renter</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Property Insights</p>
                  <p className="mt-1 text-gray-400">Bookings & status</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Modern UI</p>
                  <p className="mt-1 text-gray-400">Cards + filters</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Tip: Owner needs admin approval to post properties.
            </p>
          </div>

          {/* Right form */}
          <div className="p-8 md:p-10">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300 text-2xl border border-indigo-500/20">
                🔒
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">Sign In</h2>
              <p className="mt-1 text-gray-400 text-sm">
                Use your account credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="e.g. vishal@gmail.com"
                  className="mt-2 w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="mt-2 w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgotpassword" className="text-red-400 hover:underline">
                  Forgot Password?
                </Link>
                <Link to="/register" className="text-indigo-400 hover:underline">
                  Create account
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;