import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import LoginSideLogo from "@/components/LoginSideLogo";
import { loginUser, signupUser } from "../helpers/loginApi";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    console.log("Checking auth status...");
    const token = localStorage.getItem("accessToken");
    console.log("Token found:", !!token);
    if (token) {
      console.log("Navigating to home...");
      navigate("/home");
    }
  }, [navigate]);

  // Form data
  const [formData, setFormData] = useState<{
    name?: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      const data = await loginUser(formData.email, formData.password);
      console.log("Login:", data.data);
      navigate("/home");
    } else {
      const data = await signupUser(
        formData.name!,
        formData.email,
        formData.password
      );
      console.log("Signup:", data);
      setFormData({ name: "", email: "", password: "" });
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2 gap-2">
      <div className="flex justify-center items-center">
        <LoginSideLogo size={120} />
      </div>

      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="space-y-4 w-80">
          <h1 className="text-2xl font-bold mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h1>

          {!isLogin && (
            <div className="flex flex-row gap-2">
              <label className="w-40">Name</label>
              <input
                name="name"
                placeholder="Enter Your Name"
                type="text"
                value={formData.name || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          )}

          <div className="flex flex-row gap-2">
            <label className="w-40">Email</label>
            <input
              name="email"
              placeholder="Enter Your Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-row gap-2">
            <label className="w-40">Password</label>
            <input
              name="password"
              placeholder="Enter Your Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <div className="mt-4 text-center">
            {isLogin ? (
              <>
                <span className="text-gray-700">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#2e2e2e] font-medium hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#2e2e2e] font-medium hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
