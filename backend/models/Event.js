
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String, required: false },  
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
