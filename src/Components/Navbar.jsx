import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // ✅ icon library
import logo from "../Data/Teckybot_logo.PNG";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
    { name: "View Applications", path: "/applications" },
    { name: "Add Positions", path: "/add-positions" },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-[1350px] mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Brand Name */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-14 w-auto items-center" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `hover:text-yellow-300 transition-colors ${
                  isActive ? "text-yellow-300 font-semibold" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block py-2 border-b border-blue-500 hover:text-yellow-300 transition-colors ${
                  isActive ? "text-yellow-300 font-semibold" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
