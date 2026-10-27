import otpModel from "../models/otp.model.js";
import userModel from "../models/user.model.js";
import generateToken from "../utils/accessTokenAndRefershToken.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { generateOtp, getOtpHTML } from "../utils/otp.js";
import envConfig from "../config/env.js";
import { sendEmail } from "../services/email.service.js";
import crypto from "crypto";
 
export const registerController = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    throw new AppError("all field are required", 401);
  }

  const emailExist = await userModel.findOne({ email });

  if (emailExist && emailExist.isVerified) {
    throw new AppError("email already exists", 401);
  }

  const passwordHashed = await bcrypt.hash(password, 10);

  let user;
  if (emailExist && !emailExist.isVerified) {
    user = emailExist;
    user.fullName = fullName;
    user.email = email;
    user.password = passwordHashed;
    await user.save();
    await otpModel.deleteMany({
      user: user._id,
    });
  } else {
    user = await userModel.create({
      fullName,
      email,
      password: passwordHashed,
    });
  }

  const otp = generateOtp();
  const html = getOtpHTML(otp);

  const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.create({
    user: user._id,
    otpHashed: otpHashed,
    expiredAt: new Date(
      Date.now() + Number(envConfig.OTP_EXPIRE_MINUTES) * 60 * 1000,
    ),
    purpose: "email-verification",
  });

  await sendEmail(user.email, "verify Your Email", `Your OTP is ${otp}`, html);

  const userData = user.toObject();
  delete userData.password;

  res.status(201).json({
    success: true,
    message: "OTP sent successfully verify your email",
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError("All field are required", 401);
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User Not found", 401);
  }

  if (user.isVerified) {
    throw new AppError("your email already verified");
  }

  const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOne({
    user: user._id,
    otpHashed: otpHashed,
  });

  if (!otpDoc) {
    throw new AppError("invalid OTP", 401);
  }

  if (otpDoc.expiredAt < new Date()) {
    await otpModel.deleteOne({
      _id: otpDoc._id,
    });
    return res.status(400).json({
      success: false,
      message: " OTP expired",
    });
  }

  user.isVerified = true;
  await user.save();

  await otpModel.deleteMany({
    user: user._id,
  });

  const accessToken = await generateToken(user, res, req);

  res.status(201).json({
    success: true,
    message: "email verify successfully",
    accessToken,
  });
});
