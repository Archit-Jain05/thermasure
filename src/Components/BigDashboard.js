import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [temperatureData, setTemperatureData] = useState({});
  const [humidityData, setHumidityData] = useState({});
  const [latestTemp, setLatestTemp] = useState(null);
  const [latestHum, setLatestHum] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [status, setStatus] = useState("Offline");

  const channelId = "3152664";
  const readApiKey = "1UR07XKT3S82IT70";
  const fetchInterval = 5000; // 5 seconds
  const offlineThreshold = 30000; // 30 seconds

  const fetchData = async () => {
    try {
      // Fetch last 20 feeds
      const feedResponse = await axios.get(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=20`
      );
      const feeds = feedResponse.data.feeds;

      if (!feeds || feeds.length === 0) return;

      // Labels and data
      const labels = feeds.map(feed =>
        new Date(feed.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      const tempData = feeds.map(feed => parseFloat(feed.field1));
      const humData = feeds.map(feed => parseFloat(feed.field2));

      setLatestTemp(tempData[tempData.length - 1]);
      setLatestHum(humData[humData.length - 1]);
      setLastUpdated(new Date().toLocaleString());

      // Determine Online/Offline from last feed timestamp
      const lastFeedTimestamp = Date.parse(feeds[feeds.length - 1].created_at);
      const now = new Date().getTime();
      const isOnline = now - lastFeedTimestamp <= offlineThreshold;
      setStatus(isOnline ? "Online" : "Offline");

      // Helper to style last point based on status
      const tempBorderColors = tempData.map((_, idx) =>
        idx === tempData.length - 1 && !isOnline ? "red" : "rgba(255,99,132,1)"
      );
      const humBorderColors = humData.map((_, idx) =>
        idx === humData.length - 1 && !isOnline ? "red" : "rgba(54,162,235,1)"
      );

      setTemperatureData({
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: tempData,
            fill: false,
            borderColor: tempBorderColors,
            tension: 0.3,
            pointBackgroundColor: tempBorderColors,
          },
        ],
      });

      setHumidityData({
        labels,
        datasets: [
          {
            label: "Humidity (%)",
            data: humData,
            fill: false,
            borderColor: humBorderColors,
            tension: 0.3,
            pointBackgroundColor: humBorderColors,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus("Offline");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, fetchInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 flex-1">
      {/* Status Indicator */}
      <div className="flex items-center mb-4">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            status === "Online" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <span className={`font-semibold ${status === "Online" ? "text-green-600" : "text-red-600"}`}>
          {status}
        </span>
        {status === "Online" && (
          <span className="ml-3 text-sm font-semibold text-green-500 animate-pulse">
              &nbsp;- Realtime
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Latest Temperature</h3>
          <p className="text-2xl">{latestTemp !== null ? `${latestTemp} °C` : "Loading..."}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Latest Humidity</h3>
          <p className="text-2xl">{latestHum !== null ? `${latestHum} %` : "Loading..."}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Temperature</h3>
          {temperatureData.labels ? <Line data={temperatureData} /> : <p>Loading...</p>}
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Humidity</h3>
          {humidityData.labels ? <Line data={humidityData} /> : <p>Loading...</p>}
        </div>
      </div>

      <div className="mt-4 text-gray-500 text-sm">
        Last updated: {lastUpdated || "Loading..."}
      </div>
    </div>
  );
};

export default Dashboard;
