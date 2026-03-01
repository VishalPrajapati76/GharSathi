import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import Toast from "../common/Toast";

//axios.defaults.withCredentials = true;

const Register = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    type: "Renter", // default
  });

  const showToast = (type, message) => setToast({ show: true, type, message });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.type) {
      showToast("error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await instance.post("/api/user/register", form);

      if (res.data?.success) {
        showToast("success", res.data.message || "Registered successfully");
        setTimeout(() => navigate("/login"), 900);
      } else {
        showToast("error", res.data?.message || "Registration failed");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Registration failed");
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
          {/* Left panel (Real-estate vibe) */}
          <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-b from-indigo-600/20 to-transparent">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-200 text-sm">
                🏡 Real-estate Rentals
              </div>
              <h1 className="mt-6 text-4xl font-extrabold text-white leading-tight">
                List. Search. Book.
                <span className="block text-indigo-300">All in one place.</span>
              </h1>
              <p className="mt-4 text-gray-300">
                Create your account to explore properties with filters, cards and booking flow.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-200">
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Smart Filters</p>
                  <p className="mt-1 text-gray-400">City / Type / Rent / Sale</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Verified Owners</p>
                  <p className="mt-1 text-gray-400">Admin approval flow</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Quick Booking</p>
                  <p className="mt-1 text-gray-400">Request in 1 minute</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/30 p-4">
                  <p className="font-semibold">Secure Login</p>
                  <p className="mt-1 text-gray-400">JWT + Cookies</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Tip: Owner accounts may need admin approval before posting.
            </p>
          </div>

          {/* Right form */}
          <div className="p-8 md:p-10">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300 text-2xl border border-indigo-500/20">
                👤
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">Create Account</h2>
              <p className="mt-1 text-gray-400 text-sm">
                Join and start exploring properties
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-sm text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Vishal Prajapati"
                  className="mt-2 w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="mt-2 w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Account Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Renter">Renter</option>
                  <option value="Owner">Owner</option>
                  {/* Admin usually manual hota hai — but backend allow karta ho to rehne do */}
                  <option value="Admin">Admin</option>
                </select>
                <p className="mt-2 text-xs text-gray-400">
                  Owner account ko admin approve kar sakta hai.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-sm text-gray-400 text-center mt-4">
                Already have an account?{" "}
                <Link className="text-indigo-400 hover:underline" to="/login">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;