import { FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

export default function MobileMenu({ open, onClose, navLinks }) {
    const location = useLocation();

    if (!open) return null;

    return (
        <div className="fixed top-4 right-4 bg-white z-50 flex flex-col p-6 shadow-md rounded-xl w-64 max-w-[90vw]">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">Menu</span>
                <button onClick={onClose}>
                    <FiX size={24} className="text-gray-700" />
                </button>
            </div>
            <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={onClose}
                        className={`text-base font-medium ${location.pathname === link.path
                            ? "text-blue-600"
                            : "text-gray-700 hover:text-gray-900"
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
