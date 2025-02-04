import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Button,
  Upload,
  message,
  Form,
  Layout,
} from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import "../styling/Main.css";
import AllEvents from "../components/AllEvents";
import { getAuthHeaders } from "../components/TokenValidity";

const Main = ({ collapsed }) => {
  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;
  const navigate = useNavigate();
  const headers = getAuthHeaders();

  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [sessionData, setSessionData] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const submitEvent = async () => {
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !city ||
      !image
    ) {
      message.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startTime", startTime.format("YYYY-MM-DD HH:mm:ss"));
    formData.append("endTime", endTime.format("YYYY-MM-DD HH:mm:ss"));
    formData.append("location", location);
    formData.append("city", city);
    formData.append("image", image);
    formData.append("email", sessionData.email);

    try {
      const response = await fetch(`${BASE_URL}/api/create-event`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        message.success("Event created successfully!");
        setIsModalOpen(false);
        navigate("/index/profile");
      } else {
        message.error("Failed to create event.");
      }
    } catch (error) {
      message.error("Error submitting form.");
    }
  };

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("authToken");  
      const response = await fetch(`${BASE_URL}/api/all-events`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Invalid token") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        } else {
          console.error(errorData.message);
          message.error("Failed to fetch events");
        }
      }
  
      const eventData = await response.json();
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error fetching events");
    }
  };
  

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
    }

    const user = getUserData();
    setSessionData(user);

    fetchUserEvents();
  }, []);

  return (
    <>
      <div className={`main-container ${collapsed ? "collapsed" : ""}`}>
        <div className="main-content">
          <h1>Home</h1>
          <div className="action-buttons">
            <Button type="primary" onClick={showModal}>
              Create Event
            </Button>
          </div>
          {/* creating events modal */}
          <Modal
            title="Create Event"
            open={isModalOpen}
            onOk={submitEvent}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={submitEvent}>
                Submit
              </Button>,
            ]}
          >
            <Form layout="vertical">
              <Form.Item label="Event Title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event Title"
                  style={{ marginBottom: 20 }}
                />
              </Form.Item>

              <Form.Item label="Event Description">
                <Input.TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event Description"
                  rows={4}
                  style={{ marginBottom: 20 }}
                />
              </Form.Item>

              <Form.Item label="Start Time">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={startTime}
                  onChange={(value) => setStartTime(value)}
                  style={{ marginBottom: 20, width: "100%" }}
                  placeholder="Start Time"
                />
              </Form.Item>

              <Form.Item label="End Time">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={endTime}
                  onChange={(value) => setEndTime(value)}
                  style={{ marginBottom: 20, width: "100%" }}
                  placeholder="End Time"
                />
              </Form.Item>

              <Form.Item label="Event Location">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Event Location"
                  style={{ marginBottom: 20 }}
                />
              </Form.Item>

              <Form.Item label="Event City">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Event City"
                  style={{ marginBottom: 20 }}
                />
              </Form.Item>

              <Form.Item label="Event Image">
                <Upload
                  action="/upload.do"
                  accept=".jpg,.png,.jpeg"
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={({ fileList }) => {
                    setImage(fileList[0]?.originFileObj);
                  }}
                  maxCount={1}
                >
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>

      {/* all events */}
      <Layout className="EventList">
        <h1 className="heading1">All Active Events</h1>
        <AllEvents events={events} />
      </Layout>
    </>
  );
};

export default Main;
