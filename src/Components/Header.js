import React from "react";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <img src={logo} alt="Logo" height={50} width={50} />
      <h2 className="text-xl font-semibold">Real-time Dashboard</h2>
      <div>
        
        <button className="bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-600">Admin</button>
      </div>
    </header>
  );
};

export default Header;
