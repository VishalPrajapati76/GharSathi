const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

const addPropertyController = async (req, res) => {
  try {
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "Owner not found" });
    }

    const newPropertyData = new propertySchema({
      ...req.body,
      propertyImage: images, // array
      ownerId: user._id,
      ownerName: user.name,
      isAvailable: "Available",
    });

    await newPropertyData.save();

    return res.status(200).send({
      success: true,
      message: "New Property has been stored",
    });
  } catch (error) {
    console.error("Error in addPropertyController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const { userId } = req.body;
    const properties = await propertySchema.find({ ownerId: userId });

    return res.status(200).send({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Error in getAllOwnerPropertiesController:", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

const deletePropertyController = async (req, res) => {
  const propertyId = req.params.propertyid;
  try {
    await propertySchema.findByIdAndDelete(propertyId);

    return res.status(200).send({
      success: true,
      message: "The property is deleted",
    });
  } catch (error) {
    console.error("Error in deletePropertyController:", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

const updatePropertyController = async (req, res) => {
  const { propertyid } = req.params;

  try {
    let updateData = { ...req.body, ownerId: req.body.userId };

    if (req.file) {
      updateData.propertyImage = [
        {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
        },
      ];
    }

    await propertySchema.findByIdAndUpdate({ _id: propertyid }, updateData, { new: true });

    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update property.",
    });
  }
};

const getAllBookingsController = async (req, res) => {
  try {
    const { userId } = req.body;
    const bookings = await bookingSchema.find({ ownerID: userId });

    return res.status(200).send({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error in getAllBookingsController:", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

const handleAllBookingstatusController = async (req, res) => {
  const { bookingId, propertyId, status } = req.body;

  try {
    await bookingSchema.findByIdAndUpdate(
      { _id: bookingId },
      { bookingStatus: status },
      { new: true }
    );

    const normalized = String(status || "").toLowerCase();
    const isBooked = normalized === "booked";

    await propertySchema.findByIdAndUpdate(
      { _id: propertyId },
      { isAvailable: isBooked ? "Unavailable" : "Available" },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: `Changed the status of property to ${status}`,
    });
  } catch (error) {
    console.error("Error in handleAllBookingstatusController:", error);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
};

module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
};