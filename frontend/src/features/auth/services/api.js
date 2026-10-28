import { apiInstance } from "../../../app/api";

export const register = async ({ fullName, email, password }) => {
  const res = await apiInstance.post("/api/auth/register", {
    fullName,
    email,
    password,
  });
  return res.data;
};

export const verifyEmail = async ({ email, otp }) => {
  const res = await apiInstance.post("/api/auth/verify-email", {
    email,
    otp,
  });

  return res.data;
};
