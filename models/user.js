const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: [true, "First Name is required"] },
  lastName: { type: String },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  type: {
    type: String,
    enum: ["host", "user"],
    default: "user",
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
