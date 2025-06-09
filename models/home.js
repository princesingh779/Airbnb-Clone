const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  currdate: { type: String, required: true },
  photos: [{ type: String, required: true }],
  description: String,
});

// homeSchema.pre("findOneAndDelete", async function (next) {
//   const homeId = this.getQuery()._id;
//   await favourite.deleteMany({ houseId: homeId });
//   next();
// });

module.exports = mongoose.model("Home", homeSchema);
