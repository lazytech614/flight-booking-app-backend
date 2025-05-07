import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: String,
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
  pricePaid: Number,
  bookedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", BookingSchema);
