import { Router } from "express";
import { registerController, verifyEmail } from "../controllers/user.controller.js";

const authRouter = Router();

authRouter.post("/register",registerController);
authRouter.post("/verify-email",verifyEmail)





export default authRouter;
