import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email should be unique"],
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
      minlength: [6, "Password must be at least 8 characters"],
      maxlength: [72, "Password cannot exceed 72 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      immutable: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
