import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // or axios if you prefer

const app = express();
app.use(cors()); // allow requests from any origin (for dev)
app.use(express.json()); // parse JSON bodies

// Circuit Digest API config
const API_KEY = "DKQfco0JO9QY"; // replace with your Circuit Digest API key
const SMS_ID = 102; // replace with your SMS template ID

// POST endpoint to send SMS
app.post("/send-sms", async (req, res) => {
  const { mobiles, var1, var2 } = req.body;

  if (!mobiles || !var1 || !var2) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const response = await fetch(`https://www.circuitdigest.cloud/send_sms?ID=${SMS_ID}`, {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobiles, var1, var2 }),
    });

    const data = await response.json();
    console.log("Circuit Digest API response:", data); // print to terminal
    res.json({ success: true, data });
  } catch (err) {
    console.error("SMS error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`SMS server running on port ${PORT}`));
