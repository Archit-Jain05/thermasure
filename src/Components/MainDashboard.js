import React, { useEffect, useState } from "react";

// Thingspeak config
const THINGSPEAK_CHANNEL = "3152664";
const THINGSPEAK_API_KEY = "1UR07XKT3S82IT70";

// Circuit Digest SMS API config
const CIRCUIT_DIGEST_API_KEY = "DKQfco0JO9QY"; // Replace with your Circuit Digest API key
const SMS_ID = 102; // Your SMS template ID
const RECIPIENT_NUMBER = "917710990629"; // Replace with recipient number

const fetchThingspeakData = async () => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`
    );
    const data = await response.json();
    const latestFeed = data.feeds[0];
    return {
      temperature: latestFeed.field1,
      humidity: latestFeed.field2,
    };
  } catch (err) {
    console.error("Thingspeak fetch error:", err);
    return { temperature: "-", humidity: "-" };
  }
};

const sendSmsAlert = async (var1, var2) => {
  try {
    const response = await fetch("http://localhost:5000/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobiles: "917710990629", // recipient number
        var1: var1,
        var2: var2,
      }),
    });

    const data = await response.json();
    console.log("SMS backend response:", data); // prints to browser console
  } catch (err) {
    console.error("SMS send error:", err);
  }
};



// Widget component
const Widget = ({ title, subtitle, value, onClick, isHighlighted }) => (
  <div
    className={`cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition duration-200
      ${isHighlighted ? "bg-gray-100" : "bg-white"} w-64 overflow-hidden`}
    onClick={onClick}
  >
    {subtitle && (
      <div className="bg-gray-800 text-white text-sm font-medium px-4 py-1">
        {subtitle}
      </div>
    )}
    <div className={`${isHighlighted ? "bg-gray-200" : "bg-gray-50"} p-6 flex flex-col items-center`}>
      <h3 className="text-gray-700 font-semibold text-lg">{title}</h3>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  </div>
);

const MainDashboard = ({ onWidgetClick }) => {
  const [data, setData] = useState({ temperature: "-", humidity: "-" });
  const [alertSent, setAlertSent] = useState({ temp: false, humidity: false });

  useEffect(() => {
    const getData = async () => {
      const tsData = await fetchThingspeakData();
      setData(tsData);

      const temp = parseFloat(tsData.temperature);
      const hum = parseFloat(tsData.humidity);

      // Temperature alert
      if (!alertSent.temp && temp > 28) {
        sendSmsAlert("Truck 1", `Temperature crossed 29°C! Current: ${temp}°C`);
        setAlertSent((prev) => ({ ...prev, temp: true }));
      } else if (temp <= 28) {
        setAlertSent((prev) => ({ ...prev, temp: false }));
      }

      // Humidity alert
      if (!alertSent.humidity && hum > 60) {
        sendSmsAlert("Truck 1", `Humidity crossed 65%! Current: ${hum}%`);
        setAlertSent((prev) => ({ ...prev, humidity: true }));
      } else if (hum <= 60) {
        setAlertSent((prev) => ({ ...prev, humidity: false }));
      }
    };

    getData();
    const interval = setInterval(getData, 1000);
    return () => clearInterval(interval);
  }, [alertSent]);

  return (
    <div className="flex-1 p-6 overflow-auto h-screen bg-gray-100">
      {/* Alerts Section */}
      <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mb-6">
        <h2 className="font-semibold text-lg">Alerts</h2>
        <p>No new alerts</p>
      </div>

      {/* Widgets Grid */}
      <div
        className="grid gap-6 justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        <Widget
          title="Temperature"
          subtitle="Truck 1"
          value={`${data.temperature} °C`}
          onClick={() => onWidgetClick("Temperature")}
          isHighlighted={true}
        />
        <Widget
          title="Humidity"
          subtitle="Truck 1"
          value={`${data.humidity} %`}
          onClick={() => onWidgetClick("Humidity")}
          isHighlighted={true}
        />
        {/* Placeholder widgets */}
        <Widget title="Widget 3" value="N/A" onClick={() => {}} />
        <Widget title="Widget 4" value="N/A" onClick={() => {}} />
        <Widget title="Widget 5" value="N/A" onClick={() => {}} />
        <Widget title="Widget 6" value="N/A" onClick={() => {}} />
        <Widget title="Widget 7" value="N/A" onClick={() => {}} />
        <Widget title="Widget 8" value="N/A" onClick={() => {}} />
      </div>
    </div>
  );
};

export default MainDashboard;
