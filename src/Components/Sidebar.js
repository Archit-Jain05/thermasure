import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Monitoring System</h1>
      <nav className="flex flex-col gap-4">
        <a href="#" className="hover:text-cyan-400">Dashboard</a>
        <a href="#" className="hover:text-cyan-400">Settings</a>
        <a href="#" className="hover:text-cyan-400">Reports</a>
      </nav>
    </div>
  );
};

export default Sidebar;
