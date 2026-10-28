import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import envConfig from "../config/env.js";
import crypto from "crypto";

const generateToken = async (user, res, req) => {
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    envConfig.REFRESH_TOKEN,
    { expiresIn: "7d" },
  );

  const refreshTokenHashed = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHashed: refreshTokenHashed,
    ip: req.ip || req.socket?.remoteAddress || "unKnow",
    userAgent: req.headers["user-agent"] || "unKnow",
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    envConfig.ACCESS_TOKEN,
    { expiresIn: "10m" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
});

  return accessToken;
};

export default generateToken;
