import React from "react";
import { Button } from "./ui/button";

interface NavBarProps {
  // Text for the navbar
  userName?: string; // Optional username
}
import { logoutUser } from "@/helpers/loginApi";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC<NavBarProps> = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();

    navigate("/auth", { replace: true }); // force redirect
  };

  return (
    <nav className="flex items-end justify-end w-full p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-3">
        {userName && <span>Welcome, {userName}</span>}
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
