import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios"; 

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/logout`
      );
      alert("Logged out successfully");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      Cookies.remove("token", { path: "/", domain: window.location.hostname });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error.message);
      alert("Error during logout, please try again.");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="p-2 bg-black text-white w-full">
      <div className="container flex justify-between h-16 mx-auto">
        <h2
          className="py-3 text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Reunion Task
        </h2>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">Welcome, {user}</span>
              <button
                className="self-center px-8 py-3 font-semibold rounded bg-red-600 text-white hover:bg-gray-600 hover:text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="items-center flex-shrink-0 hidden lg:flex gap-3">
              <button
                className="self-center px-8 py-3 font-semibold rounded bg-blue-600 text-white hover:bg-gray-600 hover:text-white"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
              <button
                className="self-center px-8 py-3 font-semibold rounded bg-red-600 text-white hover:bg-gray-600 hover:text-white"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        <button className="p-4 lg:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-coolGray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-16 right-0 bg-black text-white p-4 rounded-lg lg:hidden">
            <button
              className="block px-8 py-3 font-semibold rounded bg-blue-600 text-white mb-3"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              className="block px-8 py-3 font-semibold rounded bg-red-600 text-white"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
