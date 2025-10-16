import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../Data/Teckybot_logo.PNG";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
    { name: "Applications", path: "/applications" },
    { name: "Career Positions", path: "/add-positions" },
  ];

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-2xl shadow-blue-500/20 border-b border-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo + Brand Name */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <img
              src={logo}
              alt="TeckyBot Logo"
              className="m-5 mt-4 h-14 lg:h-16 w-auto transition-all duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-6 py-3 font-medium transition-all duration-300 group overflow-hidden rounded-xl mx-1 ${
                    isActive
                      ? "text-white bg-white/20 shadow-lg backdrop-blur-sm"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <span className="relative z-10 flex items-center">
                  {item.name}
                </span>
                
                {/* Hover Animation */}
                <div
                  className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-gradient-to-r from-white/20 to-white/10"
                ></div>
                
                {/* Active Indicator */}
                {({ isActive }) => isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 rounded-full bg-yellow-400"
                  ></div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl transition-all duration-300 text-white hover:bg-white/20"
          >
            {isOpen ? (
              <X size={28} className="transform rotate-180 transition-transform duration-300" />
            ) : (
              <Menu size={28} className="transform hover:rotate-90 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isOpen
              ? "max-h-96 opacity-100 pb-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2 pt-4 border-t border-blue-200/30">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg transform scale-105"
                      : "text-white/90 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <ChevronDown
                    size={16}
                    className="transform transition-transform duration-300 text-white/60"
                  />
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;