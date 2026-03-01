import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AllPropertiesCards from "../user/AllPropertiesCards";

const Home = () => {
  // loggedIn simple check (tum context bhi use kar sakte ho)
  const loggedIn = useMemo(() => {
    const user = localStorage.getItem("user");
    return !!user;
  }, []);

  // global search + filters state (Home se pass karenge)
  const [query, setQuery] = useState("");
  const [adType, setAdType] = useState(""); // rent/sale
  const [type, setType] = useState(""); // residential/commercial/land
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg shadow-md py-4 px-6 md:px-10 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-400 tracking-wide">
          GharSathi
        </h2>

        <div className="space-x-6 text-base md:text-lg">
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

      {/* Hero */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="rounded-3xl border border-gray-800 bg-gray-950/60 backdrop-blur shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 bg-gradient-to-r from-indigo-600/20 via-transparent to-transparent">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-200 text-sm">
                🏡 Real-estate Listings
              </div>

              <h1 className="mt-6 text-3xl md:text-5xl font-extrabold leading-tight">
                Find homes for rent & sale
                <span className="block text-indigo-300">in your city.</span>
              </h1>

              <p className="mt-3 text-gray-300 max-w-2xl">
                Search by city/locality/address, apply filters, and explore properties like a real-estate app.
              </p>

              {/* Search + Filters bar */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search */}
                <div className="md:col-span-5">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search city / locality / address (e.g. Lucknow, Mau, Delhi...)"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Ad Type */}
                <div className="md:col-span-2">
                  <select
                    value={adType}
                    onChange={(e) => setAdType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Rent + Sale</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>

                {/* Type */}
                <div className="md:col-span-2">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land/plot">Land/Plot</option>
                  </select>
                </div>

                {/* Price */}
                <div className="md:col-span-3 grid grid-cols-2 gap-3">
                  <input
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  id="onlyAvail"
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="onlyAvail" className="text-gray-300 text-sm">
                  Show only Available properties
                </label>

                <div className="ml-auto text-sm text-gray-400">
                  {loggedIn ? "✅ Logged in: You can see full details." : "ℹ️ Login to view owner contact & booking."}
                </div>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="mt-10">
            <AllPropertiesCards
              loggedIn={loggedIn}
              filters={{
                query,
                adType,
                type,
                minPrice,
                maxPrice,
                onlyAvailable,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;