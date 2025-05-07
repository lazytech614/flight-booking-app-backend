import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  origin: String,
  destination: String,
  departureTime: String,
  arrivalTime: String,
  basePrice: Number,
  dynamicCount: { type: Number, default: 0 },
  lastBookedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Flight", FlightSchema);
