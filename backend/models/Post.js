const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Post Admin
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: false }, // ✅ Make it optional initially
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who joined
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

