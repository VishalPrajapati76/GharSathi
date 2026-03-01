import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Toast from "../common/Toast";

const AllPropertiesCards = ({ loggedIn, filters }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [sortBy, setSortBy] = useState("newest"); // newest / priceLow / priceHigh

  // Modal + booking
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });

  const showToast = (type, message) => setToast({ show: true, type, message });

  const getAllProperties = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/user/getAllProperties", {
        withCredentials: true,
      });
      setAllProperties(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      const res = await axios.post(
        `http://localhost:8001/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        { withCredentials: true }
      );

      if (res.data.success) {
        showToast("success", res.data.message || "Booking request sent");
        setShowModal(false);
        setUserDetails({ fullName: "", phone: "" });
      } else {
        showToast("error", res.data.message || "Booking failed");
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Booking failed");
    }
  };

  const filtered = useMemo(() => {
    const q = (filters?.query || "").trim().toLowerCase();
    const ad = (filters?.adType || "").trim().toLowerCase();
    const ty = (filters?.type || "").trim().toLowerCase();

    const minP = filters?.minPrice === "" ? null : Number(filters?.minPrice);
    const maxP = filters?.maxPrice === "" ? null : Number(filters?.maxPrice);

    const onlyAvail = !!filters?.onlyAvailable;

    let list = [...allProperties];

    // Query (city/locality/address search)
    if (q) {
      list = list.filter((p) =>
        (p.propertyAddress || "").toLowerCase().includes(q)
      );
    }

    // Ad type
    if (ad) {
      list = list.filter(
        (p) => (p.propertyAdType || "").toLowerCase() === ad
      );
    }

    // Type
    if (ty) {
      list = list.filter((p) => (p.propertyType || "").toLowerCase() === ty);
    }

    // Only available
    if (onlyAvail) {
      list = list.filter((p) => (p.isAvailable || "") === "Available");
    }

    // Price range
    list = list.filter((p) => {
      const amt = Number(p.propertyAmt || 0);
      if (minP !== null && amt < minP) return false;
      if (maxP !== null && amt > maxP) return false;
      return true;
    });

    // Sorting
    if (sortBy === "priceLow") {
      list.sort((a, b) => Number(a.propertyAmt || 0) - Number(b.propertyAmt || 0));
    } else if (sortBy === "priceHigh") {
      list.sort((a, b) => Number(b.propertyAmt || 0) - Number(a.propertyAmt || 0));
    } else {
      // newest: mongo _id approx by time; simple fallback no crash
      list.sort((a, b) => (b._id || "").localeCompare(a._id || ""));
    }

    return list;
  }, [allProperties, filters, sortBy]);

  // Map preview data
  const mapTitle = useMemo(() => {
    const q = (filters?.query || "").trim();
    if (q) return `Map preview: "${q}" area`;
    return "Map preview";
  }, [filters?.query]);

  return (
    <div className="text-white">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="text-xl font-bold">
          Listings <span className="text-gray-400 text-sm">({filtered.length})</span>
        </div>

        <div className="md:ml-auto flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>

          <button
            onClick={getAllProperties}
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Main layout: cards + map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cards */}
        <div className="lg:col-span-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((property) => {
                const imgPath = property.propertyImage?.[0]?.path;
                const imgUrl = imgPath ? `http://localhost:8001${imgPath}` : "";

                return (
                  <div
                    key={property._id}
                    className="group rounded-2xl overflow-hidden border border-gray-800 bg-gray-950/50 backdrop-blur shadow-xl hover:shadow-indigo-600/25 transition"
                  >
                    {/* Image */}
                    <div className="relative">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt="Property"
                          className="w-full h-44 object-cover group-hover:scale-[1.02] transition"
                        />
                      ) : (
                        <div className="w-full h-44 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-black/60 border border-gray-700">
                          {property.propertyAdType?.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-black/60 border border-gray-700">
                          {property.propertyType}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            property.isAvailable === "Available"
                              ? "bg-green-500/15 border-green-500/30 text-green-200"
                              : "bg-red-500/15 border-red-500/30 text-red-200"
                          }`}
                        >
                          {property.isAvailable || "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base leading-snug">
                          {property.propertyAddress}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        ₹ <span className="text-white font-semibold">{property.propertyAmt}</span>
                        <span className="ml-2 text-gray-500">/ {property.propertyAdType}</span>
                      </p>

                      {/* Details (only if logged in) */}
                      {loggedIn ? (
                        <div className="mt-3 text-sm text-gray-300 space-y-1">
                          <p>
                            <b className="text-gray-200">Owner contact:</b> {property.ownerContact}
                          </p>
                          <p>
                            <b className="text-gray-200">Owner:</b> {property.ownerName || "Owner"}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs text-yellow-300/90">
                          Login to see owner contact & booking
                        </p>
                      )}

                      {/* CTA */}
                      <div className="mt-4">
                        {property.isAvailable === "Available" ? (
                          loggedIn ? (
                            <button
                              onClick={() => openModal(property)}
                              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-medium"
                            >
                              View & Book
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full py-2 rounded-xl bg-gray-700/40 border border-gray-700 text-gray-300 cursor-not-allowed"
                            >
                              Login required
                            </button>
                          )
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 rounded-xl bg-gray-700/40 border border-gray-700 text-gray-300 cursor-not-allowed"
                          >
                            Not Available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-8 text-gray-300">
              No properties found for your filters.
            </div>
          )}
        </div>

        {/* Map look panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gray-800 bg-gray-950/50 backdrop-blur shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Explore area</p>
                <h3 className="text-lg font-bold">{mapTitle}</h3>
              </div>

              <div className="text-xs px-2 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-200">
                Map look
              </div>
            </div>

            <div className="p-4">
              {/* Placeholder map preview */}
              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black h-56 flex items-center justify-center text-gray-400">
                Map Preview (placeholder)
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Later: Google Maps / Mapbox integrate kar denge. Abhi UI “map feel” ke liye preview.
              </p>

              {/* Quick stats */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-gray-800 bg-black/30 p-3">
                  <p className="text-gray-400 text-xs">Total results</p>
                  <p className="text-lg font-bold">{filtered.length}</p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-black/30 p-3">
                  <p className="text-gray-400 text-xs">Available</p>
                  <p className="text-lg font-bold">
                    {filtered.filter((p) => p.isAvailable === "Available").length}
                  </p>
                </div>
              </div>

              {/* Top 5 locations */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-200">Top matches</p>
                <div className="mt-2 space-y-2">
                  {filtered.slice(0, 5).map((p) => (
                    <button
                      key={p._id}
                      onClick={() => loggedIn && p.isAvailable === "Available" ? openModal(p) : null}
                      className="w-full text-left rounded-xl border border-gray-800 bg-black/30 p-3 hover:bg-black/50 transition"
                    >
                      <p className="text-sm font-medium">{p.propertyAddress}</p>
                      <p className="text-xs text-gray-400">
                        ₹{p.propertyAmt} • {p.propertyType} • {p.propertyAdType}
                      </p>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-xs text-gray-500">No matches yet.</p>
                  )}
                </div>
              </div>

              {!loggedIn && (
                <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-yellow-200 text-sm">
                  Login to view owner contact and book property.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm px-4">
          <div className="bg-gray-950 p-6 rounded-2xl w-full max-w-2xl relative border border-gray-800 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4 text-white">Property Details</h3>

            <img
              src={`http://localhost:8001${selectedProperty.propertyImage?.[0]?.path || ""}`}
              alt="Property"
              className="w-full h-52 object-cover rounded-xl mb-4 border border-gray-800"
            />

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="space-y-1">
                <p><b className="text-gray-200">Location:</b> {selectedProperty.propertyAddress}</p>
                <p><b className="text-gray-200">Type:</b> {selectedProperty.propertyType}</p>
                <p><b className="text-gray-200">Ad:</b> {selectedProperty.propertyAdType}</p>
              </div>
              <div className="space-y-1">
                <p><b className="text-gray-200">Owner Contact:</b> {selectedProperty.ownerContact}</p>
                <p><b className="text-gray-200">Availability:</b> {selectedProperty.isAvailable}</p>
                <p><b className="text-gray-200">Price:</b> ₹{selectedProperty.propertyAmt}</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-300">
              <b className="text-gray-200">Additional Info:</b>{" "}
              {selectedProperty.additionalInfo || "—"}
            </p>

            {/* Booking Form */}
            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking("pending", selectedProperty._id, selectedProperty.ownerId);
              }}
            >
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name"
                  required
                  className="bg-gray-900 border border-gray-800 p-3 w-full rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={userDetails.fullName}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, fullName: e.target.value })
                  }
                />
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  className="bg-gray-900 border border-gray-800 p-3 w-full rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold"
              >
                Send Booking Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;