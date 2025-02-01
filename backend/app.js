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
// Mongoose Model (Uncomment if needed)
// const Event = require("./models/Event");

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
      const { title, description, startTime, endTime, location, city } =
        req.body;

      if (
        !title ||
        !description ||
        !startTime ||
        !endTime ||
        !location ||
        !city
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imagePath = req.file
        ? `/${EventImageFolder}/${req.file.filename}`
        : null;

      console.log({
        title,
        description,
        startTime,
        endTime,
        location,
        city,
        imagePath,
      });

      // Uncomment this part when using MongoDB
      /*
        const newEvent = new Event({
            title,
            description,
            startTime,
            endTime,
            location,
            city,
            image: imagePath,
        });

        await newEvent.save();
        */

      res
        .status(201)
        .json({ message: "Event created successfully", imagePath });
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error });
    }
  }
);

app.post("/api/join-event", async (req, res) => {
  try {
    console.log(req.body);
    res.status(201).json({ message: "Joined Sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Fail to Join" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    res.status(200).json({ message: "Running" });

    // Uncomment when using MongoDB
    /*
        const events = await Event.find();
        res.status(200).json(events);
        */
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
