const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const path = require("path");
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;
const {
  ProfileImageFolder,
  EventImageFolder,
  uploadProfileImage,
  uploadEventImage,
} = require("./uploadFileConfig");

const Event = require("./models/Event");

app.post(
  "/api/edit-profile",
  uploadProfileImage.single("userImage"),
  async (req, res) => {
    try {
      // Get the profile form data
      const { name, email, city, currentPassword, newPassword } = req.body;

      const profileImage = req.file
        ? `/${ProfileImageFolder}/${req.file.filename}`
        : null;

      console.log("Received profile data:", {
        name,
        email,
        city,
        currentPassword,
        newPassword,
        profileImage,
      });

      // You can now save the data to your database or perform further processing
      // Example: Saving the profile data (pseudo-code)
      // await saveUserProfileToDatabase({ name, email, city, profileImage });

      res
        .status(200)
        .json({ message: "Profile updated successfully", profileImage });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).json({ message: "Error in editing profile", error });
    }
  }
);

app.post(
  "/api/create-event",
  uploadEventImage.single("image"),
  async (req, res) => {
    try {
      const { title, description, startTime, endTime, location, city, email } =
        req.body;

      if (
        !title ||
        !description ||
        !startTime ||
        !endTime ||
        !location ||
        !city ||
        !email
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imagePath = req.file
        ? `/${EventImageFolder}/${req.file.filename}`
        : null;

      const newEvent = new Event({
        title,
        description,
        startTime,
        endTime,
        location,
        city,
        image: imagePath,
        email,
        attendees: [],
        status: "pending",
      });

      await newEvent.save();

      res
        .status(201)
        .json({ message: "Event created successfully", imagePath });
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error });
    }
  }
);

// join event
app.post("/api/join-event", async (req, res) => {
  const { event_id, user_id } = req.body;

  try {
    const event = await Event.findById(event_id);
    // also save user id to Users model i.e. join_events = [eventid-1, eventid-2]
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.attendees.includes(user_id)) {
      event.attendees.push(user_id);
      await event.save();
      return res.status(200).json({ message: "Successfully joined the event" });
    } else {
      return res
        .status(401)
        .json({ message: "You have already joined the event" });
    }
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all approved events for main page
app.get("/api/all-events", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// get events specific to email (users)
app.post("/api/user-events", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const events = await Event.find({ email: email });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Server Error");
  }
});

// delete event send by user
app.post("/api/delete-event/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (deletedEvent) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// edit event by user
app.post(
  "/api/edit-event/:id",
  uploadEventImage.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, startTime, endTime, location, city, image } =
      req.body;

    try {
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      const imagePath = req.file
        ? `/${EventImageFolder}/${req.file.filename}`
        : existingEvent.image;

      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          title,
          description,
          startTime,
          endTime,
          location,
          city,
          image: imagePath,
        },
        { new: true }
      );

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Fetch event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
});

// serve image from eventImages folder
app.use(
  `/${EventImageFolder}`,
  express.static(path.join(__dirname, EventImageFolder))
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
