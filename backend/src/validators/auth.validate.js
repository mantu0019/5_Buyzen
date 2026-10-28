 
import { body } from "express-validator";

export const registerValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Full name must be between 3 and 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 8 characters long")
        .isLength({ max: 72 })
        .withMessage("Password cannot exceed 72 characters")
];

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
];

export const verifyEmailValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .isString()
        .withMessage("OTP must be a string")
        .matches(/^\d{6}$/)
        .withMessage("OTP must be exactly 6 digits")
];
  
export const resendOtpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Please enter a valid email address"),
];
export const forgetPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Please enter a valid email address"),
];
 
 
export const verifyResetOtpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage("Please enter a valid email address"),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required")
        .matches(/^\d{6}$/)
        .withMessage("OTP must be exactly 6 digits"),
];
 
export const resetPasswordValidator = [
    body("resetToken")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        ),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];
 




 
