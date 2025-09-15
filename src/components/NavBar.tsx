import React, { useState } from "react";
import { Button } from "./ui/button";
import { logoutUser } from "@/helpers/loginApi";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for mobile toggle icons

interface NavBarProps {
  userName?: string;
}

const NavBar: React.FC<NavBarProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 p-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 py-3 flex justify-between ">
        {/* Logo / Brand */}

        <div>
          <h2
            className="text-2xl font-extrabold cursor-pointer hover:text-gray-300 transition"
            onClick={() => navigate("/")}
          >
            CMS
          </h2>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-end gap-4 justify-end">
          {userName && (
            <span className="text-md text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
              Welcome,{" "}
              <span className="font-semibold text-white">{userName}</span>
            </span>
          )}
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3">
          {userName && (
            <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full w-fit">
              Welcome,{" "}
              <span className="font-semibold text-white">{userName}</span>
            </span>
          )}
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
