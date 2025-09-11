// helpers/loginAPI.ts
import api from "./api";

// Define the response types
interface LoginResponse {
  token: string;
  expiresAt: string;
  data: {
    emailId: string;
    password: string;
    regNo: string;
    roleId: string;
  };
}

interface SignupResponse {
  message: string;
  user: {
    name: string;
    emailId: string; // changed
    password: string;
  };
}

// Login function
export const loginUser = async (
  emailId: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", { emailId, password });

  const { token, expiresAt, data } = res.data;

  localStorage.setItem("accessToken", token);
  localStorage.setItem("expiresAt", expiresAt);
  localStorage.setItem("regNo", data.regNo);
  localStorage.setItem("roleId", data.roleId);

  console.log("Login success:", res.data);

  return res.data;
};

//  Signup function
export const signupUser = async (
  name: string,
  emailId: string,
  password: string
): Promise<SignupResponse> => {
  const res = await api.post<SignupResponse>("/users", { name, emailId, password });
  return res.data;
};

// 🔑 Logout function
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("expiresAt");
  localStorage.removeItem("regNo");
  localStorage.removeItem("roleId");

  console.log("User logged out, tokens cleared");
};
