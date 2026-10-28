import envConfig from "../config/env.js";
import sessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req?.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Token Not Found", 401);
  }

  const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN);

  const session = await sessionModel.findOne({
    _id: decoded.sessionId,
    user: decoded.id,
    revoked: false,
  });

  if (!session) {
    throw new AppError("session expired please login again ", 401);
  }

  const user = await userModel.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 401);
  }
  req.user = user;
  next();
});
export default authMiddleware;
