import { useState } from "react";
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";

const Sidebar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: <FaHome />, label: "Home", path: "Home" },
    { icon: <FaUserAlt />, label: "Profile", path: "Profile" },
    { icon: <FaCog />, label: "Settings", path: "Settings" },
  ];

  const bottomItems = [
    { icon: <FaSignOutAlt />, label: "Logout", onClick: () => alert("Logout clicked") },
  ];

  return (
    <div
      className={`bg-gray-900 text-white h-screen flex flex-col`}
      style={{ width: isOpen ? "10rem" : "5rem", transition: "width 0.3s ease" }}
    >
      {/* Top Toggle */}
      <div className="flex justify-center p-4 border-b border-gray-800">
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Menu Section with padded box */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6">
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onMenuClick(item.path)}
              className="flex items-center gap-x-4 p-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 w-full"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="text-lg font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Logout Section with padding box */}
      <div className="px-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-4">
          {bottomItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-x-4 p-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 w-full"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              
              {isOpen && <span className="text-lg font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
