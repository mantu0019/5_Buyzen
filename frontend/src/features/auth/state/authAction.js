import { register, verifyEmail } from "../services/api";
import createAppAsyncThunk from "./createAsyncThunk";
 
export const registerUser = createAppAsyncThunk("auth/register",register);
export const verifyEmailUser = createAppAsyncThunk("auth/verify-email-user",verifyEmail)
