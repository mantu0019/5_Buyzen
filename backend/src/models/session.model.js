import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "UserId is require"],
      ref: "users",
    },
    refreshTokenHashed: {
      type: String,
      required: [true, "refreshTokenHashed is required"],
    },
    ip: {
      type: String,
      default: "unKnow",
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const sessionModel = mongoose.model("session", sessionSchema);
export default sessionModel;
