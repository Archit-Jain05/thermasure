import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Real-time Dashboard</h2>
      <div>
        <span className="mr-4">User: Admin</span>
        <button className="bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-600">Logout</button>
      </div>
    </header>
  );
};

export default Header;
