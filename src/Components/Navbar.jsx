import React from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
    { name: "View Applications", path: "/applications" },
    { name: "Add Positions", path: "/add-positions" },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold tracking-wide">
           Admin Panel
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
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
      </div>
    </nav>
  );
}

export default Navbar;
