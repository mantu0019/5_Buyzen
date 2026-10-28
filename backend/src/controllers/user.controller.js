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
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";

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

  const userData = user.toObject();
  delete userData.password;

  res.status(201).json({
    success: true,
    message: "email verify successfully",
    accessToken: accessToken,
    userData: userData,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("all field are required", 401);
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("User not found", 409);
  }

  if (!user.isVerified) {
    throw new AppError("email is not verified", 401);
  }

  const passwordCheck = await bcrypt.compare(password, user.password);

  if (!passwordCheck) {
    throw new AppError("Email or password are invalid", 401);
  }

  const accessToken = await generateToken(user, res, req);

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    success: true,
    message: "loggedIn",
    userData: userData,
    accessToken: accessToken,
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("User not found login again", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, envConfig.REFRESH_TOKEN);
  } catch (error) {
    throw new AppError("session expired login again ", 401);
  }

  const refreshTokenHashed = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHashed: refreshTokenHashed,
    revoked: false,
  });

  if (!session) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envConfig.NODE_ENV == "production",
      sameSite: "strict",
      path: "/",
    });

    throw new AppError("session invalid login again ", 401);
  }

  const accessToken = jwt.sign(
    {
      id: decoded.id,
      sessionId: session._id,
    },
    envConfig.ACCESS_TOKEN,
    { expiresIn: "10m" },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    envConfig.REFRESH_TOKEN,
    { expiresIn: "7d" },
  );

  const newRefreshTokenHashed = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  session.refreshTokenHashed = newRefreshTokenHashed;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "recreated accessToken and refreshToken ",
    accessToken: accessToken,
  });
});

export const getMeController = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  const userData = await userModel.findById(userId).select("-password");

  if (!userData) {
    throw new AppError("User not found", 401);
  }

  res.status(200).json({
    success: true,
    message: "data Fetched successfully",
    userData: userData,
  });
});

export const logOutController = asyncHandler(async (req, res) => {
  const cookieOption = {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Token Not found", 401);
  }

  const refreshTokenHashed = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOneAndUpdate(
    { refreshTokenHashed: refreshTokenHashed, revoked: false },
    {
      revoked: true,
      revokedAt: new Date(),
    },
    { new: true },
  );

  res.clearCookie("refreshToken", cookieOption);

  if (!session) {
    throw new AppError("Already logOuted", 201);
  }
  res.status(200).json({
    success: true,
    message: "LogOut successfully ",
  });
});

export const resendOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Input field are required", 401);
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("user Not found", 401);
  }

  if (user.isVerified) {
    throw new AppError("email already verified", 401);
  }

  await otpModel.deleteMany({ user: user._id });

  const otp = generateOtp();
  const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");
  const html = getOtpHTML(otp);

  await otpModel.create({
    user: user._id,
    otpHashed: otpHashed,
    expiredAt: new Date(
      Date.now() + Number(envConfig.OTP_EXPIRE_MINUTES) * 60 * 1000,
    ),
    purpose: "email-verification",
  });

  await sendEmail(user.email, "Verify Your email", `Your OTP is ${otp}`, html);

  res.status(200).json({
    success: true,
    message: "OTP send successfully",
  });
});

export const forgetPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("email is required", 401);
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("User not verified", 401);
  }

  await otpModel.deleteMany({ user: user._id, purpose: "password-reset" });

  const otp = generateOtp();
  const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");
  const html = getOtpHTML(otp);

  const expireAt = new Date(
    Date.now() + Number(envConfig.OTP_EXPIRE_MINUTES) * 60 * 1000,
  );

  await otpModel.create({
    user: user._id,
    otpHashed: otpHashed,
    expiredAt: expireAt,
    purpose: "password-reset",
  });

  await sendEmail(
    user.email,
    "Reset Your Password",
    `Your password reset  OTP ${otp}`,
    html,
  );

  res.status(200).json({
    success: true,
    message: "If registered, an OTP has been sent .",
  });
});

export const verifyResetOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError("all Input field are required", 400);
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("invalid or OTP expired", 401);
  }

  const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOneAndDelete({
    user: user._id,
    otpHashed,
    purpose: "password-reset",
    expiredAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    throw new AppError("Invalid OTP", 401);
  }

  if (otpDoc.expiredAt < new Date()) {
    await otpModel.deleteOne({ _id: otpDoc._id });

    throw new AppError("OTP expired", 401);
  }

  await otpModel.deleteOne({
    _id: otpDoc._id,
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      purpose: "password-reset",
    },
    envConfig.ACCESS_TOKEN,
    {
      expiresIn: "10m",
    },
  );

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    accessToken,
  });
});


export const resetPasswordController =  asyncHandler(async(req,res)=>{

  const {resetToken,newPassword,confirmPassword}  = req.body;

    if(!resetToken || !newPassword || !confirmPassword){
   throw new AppError("all field are required",400);
    };

   if(newPassword !=confirmPassword){
     throw new AppError("Password do not match",401)
   };
  
   const decoded = jwt.verify(resetToken,envConfig.ACCESS_TOKEN);
      console.log("decoded",decoded)
   
  if(decoded.purpose !== "password-reset"){
   throw new AppError("invalid reset token",401);

  };


  const user  = await userModel.findById(decoded.id);

  if(!user){
    throw new AppError("user not found",401)
  };

  const passwordHashed = await bcrypt.hash(newPassword,10);
  user.password = passwordHashed;
  await user.save();


  await sessionModel.updateMany(
    {
      user:user._id,
      revoked:false
    },
    {
      revoked:true,
      revokedAt: new Date()

    }

  )



    res.status(200).json({
      success:false,
      message:"Password reset successful. Please log in again"
    })











})
