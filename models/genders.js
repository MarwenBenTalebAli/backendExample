const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const genderSchema = new mongoose.Schema(
  {
    gName: {
      type: String,
      required: true,
    },
    gDescription: {
      type: String,
      required: true,
    },
    gImage: {
      type: String,
    },
    gStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const genderModel = mongoose.model("genders", genderSchema);
module.exports = genderModel;
