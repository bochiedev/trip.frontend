import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaMap, FaFileAlt, FaUser, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.svg";
import placeholder from "../assets/placeholder.png";

const Menu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinkStyles = ({ isActive }) =>
        `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 ${isActive ? "bg-white text-[#051830] font-semibold" : "text-white"
        }`;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className={`md:hidden fixed top-4 left-4 z-50 ${isOpen ? "text-white" : "text-gray-800"
                    }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen bg-[#051830] text-white w-64 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:w-64 md:flex-shrink-0 md:transform-none flex flex-col justify-between overflow-hidden`}
            >
                <div className="p-4">
                    <img src={logo} alt="Logo" className="h-12 mb-6 mx-auto md:mx-0" />
                    <nav className="space-y-4">
                        <NavLink
                            to="/dashboard"
                            className={navLinkStyles}
                            onClick={() => setIsOpen(false)}
                        >
                            <FaMap />
                            <span className="text-sm">Current Trip</span>
                        </NavLink>
                        <NavLink
                            to="/trip-maps"
                            className={navLinkStyles}
                            onClick={() => setIsOpen(false)}
                        >
                            <FaMap />
                            <span className="text-sm">All Trips</span>
                        </NavLink>
                        <NavLink
                            to="/daily-logs"
                            className={navLinkStyles}
                            onClick={() => setIsOpen(false)}
                        >
                            <FaFileAlt />
                            <span className="text-sm">Daily Logs</span>
                        </NavLink>
                    </nav>
                </div>
                <div className="p-4">
                    <div className="flex items-center space-x-2">
                        <NavLink to="/profile" onClick={() => setIsOpen(false)}>
                            <img
                                src={user?.profile_picture || placeholder}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                                onError={(e) => (e.target.src = placeholder)}
                            />
                        </NavLink>
                        <div>
                            <NavLink
                                to="/profile"
                                className="block hover:underline text-white text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                {user?.first_name} {user?.last_name}
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="text-sm hover:underline text-white"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Menu;