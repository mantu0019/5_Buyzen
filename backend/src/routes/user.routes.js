import { Router } from "express";
import { forgetPasswordController, getMeController, loginController, logOutController, refreshTokenController, registerController, resendOtpController, resetPasswordController, verifyEmail, verifyResetOtpController } from "../controllers/user.controller.js";
import { forgetPasswordValidator, loginValidator, registerValidator, resendOtpValidator, resetPasswordValidator, verifyEmailValidator, verifyResetOtpValidator } from "../validators/auth.validate.js";
import validate from "../middleware/validate.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register",registerValidator,validate, registerController);
authRouter.post("/verify-email",verifyEmailValidator,validate, verifyEmail);
authRouter.post("/login",loginValidator,validate, loginController);
authRouter.post("/refreshToken",refreshTokenController);
authRouter.get("/get-me",authMiddleware,getMeController);
authRouter.get("/log-out",logOutController);
authRouter.post("/resend-otp", resendOtpValidator,validate,resendOtpController);
authRouter.post("/forget-password",forgetPasswordValidator,validate,forgetPasswordController);
authRouter.post("/verify-reset-otp",verifyResetOtpValidator,validate,  verifyResetOtpController);
authRouter.post("/reset-password",resetPasswordValidator,validate, resetPasswordController)



export default authRouter;
