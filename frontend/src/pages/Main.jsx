import React, { useState } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import "../styling/main.css";
import AllEvents from "../components/AllEvents";

const Main = ({ collapsed }) => {
  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);

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

    try {
      const response = await fetch(`${BASE_URL}/api/create-event`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Event created successfully!");
        setIsModalOpen(false);
      } else {
        message.error("Failed to create event.");
      }
    } catch (error) {
      message.error("Error submitting form.");
    }
  };

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
          {/* modal for creating events */}
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
        <h1 className="heading1">All Events</h1>
        <AllEvents />
      </Layout>
    </>
  );
};

export default Main;
