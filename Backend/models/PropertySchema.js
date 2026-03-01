const mongoose = require("mongoose");

const propertyModel = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    propertyType: {
      type: String,
      required: [true, "Please provide a Property Type"],
      trim: true,
    },

    propertyAdType: {
      type: String,
      required: [true, "Please provide a Property Ad Type"],
      trim: true,
    },

    propertyAddress: {
      type: String,
      required: [true, "Please Provide an Address"],
      trim: true,
    },

    ownerContact: {
      type: String,
      required: [true, "Please provide owner contact"],
    },

    propertyAmt: {
      type: Number,
      default: 0,
    },

    propertyImage: [
      {
        filename: String,
        path: String,
      },
    ],

    additionalInfo: {
      type: String,
      trim: true,
    },

    ownerName: {
      type: String,
    },

    isAvailable: {
      type: String,
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const propertySchema = mongoose.model("Property", propertyModel);

module.exports = propertySchema;