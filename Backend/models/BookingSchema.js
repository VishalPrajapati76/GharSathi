const mongoose = require("mongoose");

const bookingModel = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: [true, "Please provide a User Name"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Please provide a Phone Number"],
      trim: true,
    },

    bookingStatus: {
      type: String,
      required: [true, "Please provide a booking status"],
      enum: ["pending", "booked", "rejected", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const bookingSchema = mongoose.model("Booking", bookingModel);

module.exports = bookingSchema;