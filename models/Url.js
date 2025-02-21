const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortUrl: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  topic: { type: String },
  clicks: { type: Number, default: 0 },
  uniqueUsers: { type: [String], default: [] }, // Use an array instead of Set
  clicksByDate: { type: Map, of: Number, default: {} },
  osType: { type: Map, of: Number, default: {} },
  deviceType: { type: Map, of: Number, default: {} }
}, { timestamps: true });

module.exports = mongoose.model("Url", urlSchema);
