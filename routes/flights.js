import express from "express";
import Flight from "../models/Flight.js";
const router = express.Router();

// Seed or fetch 10 flights
router.get("/", async (req, res) => {
  const { from, to } = req.query;
  let flights = await Flight.find({ origin: from, destination: to }).limit(10);
  if (flights.length < 10) {
    // seed logic omitted for brevity
  }
  // compute dynamicPrice
  flights = flights.map((f) => {
    const minutes = (Date.now() - f.lastBookedAt) / 60000;
    if (minutes > 10) f.dynamicCount = 0;
    const multiplier = 1 + 0.1 * Math.min(f.dynamicCount, 3);
    return { ...f.toObject(), dynamicPrice: f.basePrice * multiplier };
  });
  res.json(flights);
});

export default router;
