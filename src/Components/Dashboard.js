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

  const fetchData = async () => {
    try {
      const channelId = "3152664";
      const readApiKey = "1UR07XKT3S82IT70";
      const results = 20;

      const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=${results}`;
      const response = await axios.get(url);
      const feeds = response.data.feeds;

      const labels = feeds.map((feed) =>
        new Date(feed.created_at).toLocaleTimeString()
      );

      const tempData = feeds.map((feed) => parseFloat(feed.field1));
      const humData = feeds.map((feed) => parseFloat(feed.field2));

      setTemperatureData({
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: tempData,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            tension: 0.1,
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
            borderColor: "rgba(54,162,235,1)",
            tension: 0.1,
          },
        ],
      });

      setLatestTemp(tempData[tempData.length - 1]);
      setLatestHum(humData[humData.length - 1]);
    } catch (error) {
      console.error("Error fetching data from ThingSpeak:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 flex-1">
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Stat Cards */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Latest Temperature</h3>
          <p className="text-2xl">{latestTemp ? `${latestTemp} °C` : "Loading..."}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Latest Humidity</h3>
          <p className="text-2xl">{latestHum ? `${latestHum} %` : "Loading..."}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Graphs */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Temperature</h3>
          {temperatureData.labels ? <Line data={temperatureData} /> : <p>Loading...</p>}
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Humidity</h3>
          {humidityData.labels ? <Line data={humidityData} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
