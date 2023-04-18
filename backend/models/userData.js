const mongoose = require("mongoose");

const userDataSchema = mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  userId: {
    type: String,
    required: true,
  },
  aboutMe: {
    type: String,
    default: "",
  },
  onTheWeb: {
    linkedin: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
  },
  interests: {
    type: [String],
    default: [],
  },
  personalInformation: {
    highestEducation: {
      type: String,
      default: "",
    },
    currentlyDoing: {
      type: String,
      default: "",
    },
  },
});

module.exports = mongoose.model("UserData", userDataSchema)
