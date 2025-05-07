import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";

import flightRoutes from "./routes/flights.js";
import bookingRoutes from "./routes/bookings.js";
import { getAmadeusToken } from "./utils/amadeusAuth.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/flights", flightRoutes);
app.use("/book", bookingRoutes);
app.use("/bookings", bookingRoutes);

// Example endpoint that needs an Amadeus token
app.get("/api/airports", async (req, res) => {
  try {
    const keyword = req.query.keyword || "IN"; // default to 'M' if none provided
    const countryCode = req.query.countryCode || "IN";
    const token = await getAmadeusToken(); // fetch or reuse cached token

    const response = await axios.get(
      `${process.env.AMADEUS_BASE_URL}/reference-data/locations`, // :contentReference[oaicite:2]{index=2}
      {
        params: {
          subType: "AIRPORT", // required to restrict results to airports :contentReference[oaicite:3]{index=3}
          keyword,
          countryCode,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Send back the Amadeus payload directly (data + meta + links)
    res.json(response.data);
  } catch (err) {
    console.error(
      "Error fetching airports:",
      err.response?.data || err.message
    );
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch airport locations",
      details: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
