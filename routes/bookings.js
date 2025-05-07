import express from "express";
import Booking from "../models/Booking.js";
import Flight from "../models/Flight.js";

const router = express.Router();

// Create booking
router.post("/", async (req, res) => {
  const { flightId, userId } = req.body;
  const flight = await Flight.findById(flightId);
  const minutes = (Date.now() - flight.lastBookedAt) / 60000;
  if (minutes > 10) flight.dynamicCount = 0;
  if (minutes <= 5) flight.dynamicCount++;
  const pricePaid =
    flight.basePrice * (1 + 0.1 * Math.min(flight.dynamicCount, 3));
  flight.lastBookedAt = Date.now();
  await flight.save();

  const booking = await Booking.create({ flightId, userId, pricePaid });
  res.json({ id: booking._id, pricePaid });
});

// Get bookings for a user
router.get("/:userId", async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.userId }).populate(
    "flightId"
  );
  res.json(bookings);
});

export default router;
