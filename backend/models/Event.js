
const mongoose = require("./Config"); 

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String, required: false },
  // organiser email
  email: { type: String, required: true },
  attendees: [{ type: Number, required: true }],
  // when user modal ready 
  // attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  status: { type: String, required: true, default: "pending" },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
