// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, required: true, enum: ["admin", "user"] },
//     credits: { type: Number, default: 0 },
//     profile: {
//       profileImage: { type: String, default: "" },
//       linkedin: { type: String, default: "" },
//       instagram: { type: String, default: "" },
//       twitter: { type: String, default: "" },
//       gmail: { type: String, default: "" },
//     },
//     completedFields: {
//       profileImage: { type: Boolean, default: false },
//       linkedin: { type: Boolean, default: false },
//       instagram: { type: Boolean, default: false },
//       twitter: { type: Boolean, default: false },
//       gmail: { type: Boolean, default: false },
//     },
//     lastLogin: {
//       type: Date,
//       default: null,
//     }
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user"], default: "user" },
  credits: { type: Number, default: 0 },
  profile: {
    profileImage: { type: String, default: "" },
    linkedin:      { type: String, default: "" },
    instagram:     { type: String, default: "" },
    twitter:       { type: String, default: "" },
    gmail:         { type: String, default: "" }
  },
  completedFields: {
    profileImage: { type: Boolean, default: false },
    linkedin:     { type: Boolean, default: false },
    instagram:    { type: Boolean, default: false },
    twitter:      { type: Boolean, default: false },
    gmail:        { type: Boolean, default: false }
  },
  lastLogin: { type: Date, default: null },

  // —————————————————————————————————————————————————————————————————————
  // **SAVE & REPORT** functionality:
  savedPosts: [
    {
      id:       String,
      platform: String,
      title:    String,
      content:  String,
      url:      String,
      date:     { type: Date, default: Date.now }
    }
  ],
  reportedPosts: [
    {
      id:       String,
      platform: String,
      title:    String,
      content:  String,
      url:      String,
      date:     { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
