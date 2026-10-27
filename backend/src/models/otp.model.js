import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required"],
    },
    otpHashed: {
      type: String,
      required: [true, "userId is required"],
    },
    expiredAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
      
    },
    purpose: {
        type: String,
        enum: ["password-reset", "email-verification"],
        required: [true, "purpose is required"],
      },
  },
  { timestamps: true },
);

const otpModel = mongoose.model("otp", otpSchema);


export default otpModel