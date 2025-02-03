const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const path = require("path");
app.use(cors());
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { verifyToken } = require("./middleware/VerifyToken");

dotenv.config();

const PORT = process.env.PORT || 5000;
const {
  ProfileImageFolder,
  EventImageFolder,
  uploadProfileImage,
  uploadEventImage,
} = require("./uploadFileConfig");

const Event = require("./models/Event");
const User = require("./models/Users");

// signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
      joinEvents: [],
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" }); // Ensure a JSON response here
  } catch (error) {
    console.error("Signup Error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." }); // JSON error response
  }
});

// login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userData = {
      userId: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );

    res
      .status(200)
      .json({ message: "Login successful", user: userData, token: token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// edit profile
app.post(
  "/api/edit-profile",
  verifyToken,
  uploadProfileImage.single("userImage"),
  async (req, res) => {
    try {
      const { name, email, newPassword } = req.body;
      const profileImage = req.file
        ? `/${ProfileImageFolder}/${req.file.filename}`
        : null;

      const updateFields = { name, email, image: profileImage };

      if (newPassword) {
        const salt = await bcrypt.genSalt(10);  
        const hashedPassword = await bcrypt.hash(newPassword, salt);  
        updateFields.password = hashedPassword;  
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        updateFields,
        { new: true }
      );

      res.status(200).json({
        message: "Profile updated successfully",
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        isAdmin:updatedUser.isAdmin?true:false,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error in editing profile", error });
    }
  }
);

// create-event
app.post(
  "/api/create-event",
  verifyToken,
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
app.post("/api/join-event", verifyToken, async (req, res) => {
  const { event_id, user_id } = req.body;

  try {
    const event = await Event.findById(event_id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }

    const userObjectId = new mongoose.Types.ObjectId(user_id);

    if (!event.attendees.includes(userObjectId)) {
      event.attendees.push(userObjectId);
      await event.save();
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.joinEvents.push(event_id);
      await user.save();

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

// join event by specific user
app.get("/api/join-events/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await Event.find({ attendees: userId });
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for this user" });
    }
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching joined events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// get events (approved, pending, rejected)
app.get("/api/events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find(); 
    res.status(200).json(events); 
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// get all registered users
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
});


// Route to update event status
app.post("/api/events/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event status updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// get all approved events for main page
app.get("/api/all-events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// get events specific to email (users)
app.post("/api/user-events", verifyToken, async (req, res) => {
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
app.post("/api/delete-event/:id", verifyToken, async (req, res) => {
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
  verifyToken,
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
app.get("/api/events/:id", verifyToken, async (req, res) => {
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

// serve image from profileImages folder
app.use(
  `/${ProfileImageFolder}`,
  express.static(path.join(__dirname, ProfileImageFolder))
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
