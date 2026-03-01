const userSchema = require("../models/UserSchema");
const propertySchema = require("../models/PropertySchema");
const bookingSchema = require("../models/BookingSchema");

///////// getting all users ///////////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({});

    return res.status(200).send({
      success: true,
      message: "All users",
      data: allUsers, // can be []
    });
  } catch (error) {
    console.error("Error in getAllUsersController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

///////// handling status for owner /////////
const handleStatusController = async (req, res) => {
  const { userid, status } = req.body;

  try {
    const user = await userSchema.findByIdAndUpdate(
      userid,
      { granted: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: `User has been ${status}`,
    });
  } catch (error) {
    console.error("Error in handleStatusController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

///////// getting all properties in app //////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});

    return res.status(200).send({
      success: true,
      message: "All properties",
      data: allProperties, // can be []
    });
  } catch (error) {
    console.error("Error in getAllPropertiesController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

//////// get all bookings ////////////
const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find();

    return res.status(200).send({
      success: true,
      data: allBookings, // can be []
    });
  } catch (error) {
    console.error("Error in getAllBookingsController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
};