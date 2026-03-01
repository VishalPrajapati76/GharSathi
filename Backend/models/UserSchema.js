const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      set: function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Renter", "Owner", "Admin"],
    },

    granted: {
      type: String,
      default: "granted", // Owner ke liye later change hota hai
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.model("User", userModel);

module.exports = userSchema;