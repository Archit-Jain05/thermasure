import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import MainDashboard from "./Components/MainDashboard";
import BigDashboard from "./Components/BigDashboard";
// import Profile from "./Components/Profile";
// import Settings from "./Components/Settings";

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [showBigDashboard, setShowBigDashboard] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);

  const handleWidgetClick = (widget) => {
    setSelectedWidget(widget);
    setShowBigDashboard(true);
  };

  const handleBack = () => setShowBigDashboard(false);

  return (
    <div className="flex h-screen">
      <Sidebar onMenuClick={(page) => {
        setActivePage(page);
        setShowBigDashboard(false);
      }} />

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Header />

        {activePage === "Home" && (
          showBigDashboard ? (
            <BigDashboard widget={selectedWidget} onBack={handleBack} />
          ) : (
            <MainDashboard onWidgetClick={handleWidgetClick} />
          )
        )}
        {/* {activePage === "Profile" && <Profile />} */}
        {/* {activePage === "Settings" && <Settings />} */}
      </div>
    </div>
  );
}

export default App;
