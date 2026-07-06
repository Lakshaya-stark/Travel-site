const mongoose = require("mongoose");

// name, rating, price, duration, groupsize, difficulty, rating-> ratingavg, ratingQuantity, discount, summery

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a Name"],
    unique: true,
  },
  ratingAvg: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  duration: {
    type: Number,
    required: [true, "A tour must specify durations"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must specify group size"],
  },
  difficulty: {
    type: String,
    required: [true, "specify difficulty"],
  },
  discount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "Specify a summary"],
  },
  description: {
    type: String,
    required: [true, "A tour must have a desc"],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "must sppecify"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
