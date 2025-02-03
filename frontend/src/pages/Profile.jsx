import React, { useState, useEffect } from "react";
import EditProfile from "../components/EditProfile";
import "../styling/Profile.css";
import moment from "moment";
import {
  List,
  Tabs,
  message,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Upload,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAuthHeaders } from "../components/TokenValidity";

const Profile = ({ collapsed }) => {
  const [events, setEvents] = useState([]);
  const [pendingEvent, setPendingEvent] = useState([]);
  const [approvedEvent, setApprovedEvent] = useState([]);
  const [rejectedEvent, setRejectedEvent] = useState([]);
  const [joinEvent, setJoinedEvent] = useState([]);
  const [sessionData, setSessionData] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: moment(),
    endTime: moment(),
    location: "",
    city: "",
  });
  const [image, setImage] = useState(null);

  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;
  const headers = getAuthHeaders();

  const fetchUserEvents = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user-events`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        message.error("Failed to fetch events");
      }
      const eventData = await response.json();
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error fetching events");
    }
  };

  // delete Modal
  const showModal = (item) => {
    setSelectedEvent(item);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteUserEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/delete-event/${selectedEvent._id}`,
          {
            method: "POST",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setPendingEvent((prevEvents) =>
            prevEvents.filter((event) => event._id !== selectedEvent._id)
          );
          message.success(`Event deleted successfully`);
          setIsModalOpen(false);
        } else {
          console.error("Failed to delete the event");
          message.error(`Failed to delete the event`);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        message.error(`Error deleting event`);
      }
    }
  };

  // edit Modal
  const showEditModal = (item) => {
    setSelectedEvent(item);
    setFormData({
      title: item.title,
      description: item.description,
      startTime: item.startTime ? moment(item.startTime) : null,
      endTime: item.endTime ? moment(item.endTime) : null,
      location: item.location,
      city: item.city,
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      startTime: date,
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      endTime: date,
    }));
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const editUserEvent = async () => {
    if (selectedEvent) {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "startTime",
        formData.startTime ? formData.startTime.toISOString() : ""
      );
      formDataToSend.append(
        "endTime",
        formData.endTime ? formData.endTime.toISOString() : ""
      );
      formDataToSend.append("location", formData.location);
      formDataToSend.append("city", formData.city);

      if (image) {
        formDataToSend.append("image", image);
      }

      try {
        const response = await fetch(
          `${BASE_URL}/api/edit-event/${selectedEvent._id}`,
          {
            method: "POST",
            headers: headers,
            body: formDataToSend,
          }
        );

        if (response.ok) {
          const updatedEvent = await response.json();
          setPendingEvent((prevEvents) =>
            prevEvents.map((event) =>
              event._id === updatedEvent._id ? updatedEvent : event
            )
          );
          message.success("Event updated successfully");
          setIsEditModalOpen(false);
        } else {
          message.error("Failed to update event");
        }
      } catch (error) {
        console.error("Error updating event:", error);
        message.error("Error updating event");
      }
    }
  };

  const getJoinEvents = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/join-events/${userId}`, {
        headers: headers,
        method: "GET",
      });
      const events = await response.json();

      if (response.ok) {
        return events;
      } else {
        console.error("Error fetching events:", events.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  // -------------
  // side-rendering

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserData();
        setSessionData(user);
        const userEmail = user.email;

        await fetchUserEvents(userEmail);

        const events = await getJoinEvents(user.userId);
        setJoinedEvent(events);
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const pendingEvents = events.filter((event) => event.status == "pending");
    const approvedEvents = events.filter(
      (event) => event.status == "approved"
    );
    const rejectedEvents = events.filter(
      (event) => event.status == "rejected"
    );
    setPendingEvent(pendingEvents);
    setApprovedEvent(approvedEvents);
    setRejectedEvent(rejectedEvents);
  }, [events]);

  const onChange = (key) => {
    // console.log(key);
  };

  const items = [
    {
      key: "1",
      label: <span className="tab-label">Pending Request</span>,
      children: (
        <div className="list-container">
          <List
            itemLayout="vertical"
            size="large"
            className="list"
            pagination={{
              onChange: (page) => {
                // console.log(page);
              },
              pageSize: 15,
              style: { textAlign: "center" },
            }}
            dataSource={pendingEvent}
            renderItem={(item) => (
              <List.Item
                className="list-item-card"
                key={item.title}
                extra={
                  <img
                    className="list-item-image"
                    alt="event thumbnail"
                    src={`${BASE_URL}${item.image}`}
                  />
                }
              >
                <List.Item.Meta
                  title={<a href={item.href}>{item.title}</a>}
                  description={`Venue: ${item.location}, ${item.city}`}
                  image={`${BASE_URL}${item.image}`}
                />
                <div className="list-data-cont-1">
                  <p>
                    {`Start time: ${new Date(item.startTime).toLocaleString()}`}
                  </p>
                  <p>
                    {" "}
                    {`End time; ${new Date(item.endTime).toLocaleString()}`}
                  </p>
                </div>
                <div className="event-description">{item.description}</div>
                <div className="event-status-tag">
                  <div>
                    {item.status == "pending" ? (
                      <Tag color="#ffcc00">pending</Tag>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div>{""}</div>
                  <div>
                    <Button
                      onClick={() => showEditModal(item)}
                      type="primary"
                      icon={<EditOutlined />}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      onClick={() => showModal(item)}
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: <span className="tab-label">Approved Request</span>,
      children: (
        <div className="list-container">
          <List
            itemLayout="vertical"
            size="large"
            className="list"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 15,
              style: { textAlign: "center" },
            }}
            dataSource={approvedEvent}
            renderItem={(item) => (
              <List.Item
                className="list-item-card"
                key={item.title}
                extra={
                  <img
                    className="list-item-image"
                    alt="event thumbnail"
                    src={`${BASE_URL}${item.image}`}
                  />
                }
              >
                <List.Item.Meta
                  title={<a href={item.href}>{item.title}</a>}
                  description={`Venue: ${item.location}, ${item.city}`}
                  image={`${BASE_URL}${item.image}`}
                />
                <div className="list-data-cont-1">
                  <p>
                    {`Start time: ${new Date(item.startTime).toLocaleString()}`}
                  </p>
                  <p>
                    {" "}
                    {`End time; ${new Date(item.endTime).toLocaleString()}`}
                  </p>
                </div>
                <div className="event-description">
                  <p>{item.description}</p>
                </div>
                <div className="event-status-tag">
                  <div>
                    {item.status == "approved" ? (
                      <Tag color="#87d068">approved</Tag>
                    ) : (
                      <></>
                    )}
                  </div>
                  &nbsp; &nbsp;
                  <div>{""}</div>
                  <div>{""}</div>
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: <span className="tab-label">Rejected Request</span>,
      children: (
        <div className="list-container">
          <List
            itemLayout="vertical"
            size="large"
            className="list"
            pagination={{
              onChange: (page) => {
                // console.log(page);
              },
              pageSize: 15,
              style: { textAlign: "center" },
            }}
            dataSource={rejectedEvent}
            renderItem={(item) => (
              <List.Item
                className="list-item-card"
                key={item.title}
                extra={
                  <img
                    className="list-item-image"
                    alt="event thumbnail"
                    src={`${BASE_URL}${item.image}`}
                  />
                }
              >
                <List.Item.Meta
                  title={<a href={item.href}>{item.title}</a>}
                  description={`Venue: ${item.location}, ${item.city}`}
                  image={`${BASE_URL}${item.image}`}
                />
                <div className="list-data-cont-1">
                  <p>
                    {`Start time: ${new Date(item.startTime).toLocaleString()}`}
                  </p>
                  <p>
                    {" "}
                    {`End time; ${new Date(item.endTime).toLocaleString()}`}
                  </p>
                </div>
                <div className="event-description">{item.description}</div>
                <div className="event-status-tag">
                  <div>
                    {item.status == "rejected" ? (
                      <Tag color="#ff0000">rejected</Tag>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "4",
      label: <span className="tab-label">Joined Events</span>,
      children: (
        <div className="list-container">
          <List
            itemLayout="vertical"
            size="large"
            className="list"
            pagination={{
              onChange: (page) => {
                // console.log(page);
              },
              pageSize: 15,
              style: { textAlign: "center" },
            }}
            dataSource={joinEvent}
            renderItem={(item) => (
              <List.Item
                className="list-item-card"
                key={item.title}
                extra={
                  <img
                    className="list-item-image"
                    alt="event thumbnail"
                    src={`${BASE_URL}${item.image}`}
                  />
                }
              >
                <List.Item.Meta
                  title={<a href={item.href}>{item.title}</a>}
                  description={`Venue: ${item.location}, ${item.city}`}
                  image={`${BASE_URL}${item.image}`}
                />
                <div className="list-data-cont-1">
                  <p>
                    {`Start time: ${new Date(item.startTime).toLocaleString()}`}
                  </p>
                  <p>
                    {" "}
                    {`End time; ${new Date(item.endTime).toLocaleString()}`}
                  </p>
                </div>
                <div className="event-description">{item.description}</div>
                <div className="event-status-tag">
                  <div>
                    {item.status == "rejected" ? (
                      <Tag color="#ff0000">rejected</Tag>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={`main-container ${collapsed ? "collapsed" : ""}`}>
        <div className="main-content">
          <h1>Profile</h1>
        </div>
      </div>
      <EditProfile />
      <div className="tab-container">
        {/* delete modal */}
        <Modal
          title="Delete Event"
          open={isModalOpen}
          onOk={deleteUserEvent}
          onCancel={handleCancel}
        >
          <p>Are you sure you want to delete the event?</p>
        </Modal>

        {/* edit modal */}
        <Modal
          title="Edit Event"
          open={isEditModalOpen}
          onCancel={handleEditCancel}
          onOk={editUserEvent}
          okText="Edit"
        >
          <div>
            <div>
              <label>Title:</label>
              <Input
                name="title"
                value={formData.title}
                onChange={(e) => handleChange(e, "title")}
              />
            </div>

            <div>
              <label>Description:</label>
              <Input
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e, "description")}
              />
            </div>
            <br />

            <div>
              <Form.Item label="Start Time">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={formData.startTime}
                  onChange={handleStartDateChange}
                  style={{ marginBottom: 20, width: "100%" }}
                  placeholder="Start Time"
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item label="End Time">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={formData.endTime}
                  onChange={handleEndDateChange}
                  style={{ marginBottom: 20, width: "100%" }}
                  placeholder="End Time"
                />
              </Form.Item>
            </div>

            <div>
              <label>Location:</label>
              <Input
                name="location"
                value={formData.location}
                onChange={(e) => handleChange(e, "location")}
              />
            </div>

            <div>
              <label>City:</label>
              <Input
                name="city"
                value={formData.city}
                onChange={(e) => handleChange(e, "city")}
              />
            </div>
            <br />

            <Form.Item label="Event Image">
              <Upload
                action="/upload.do"
                accept=".jpg,.png,.jpeg"
                listType="picture-card"
                beforeUpload={() => false}
                onChange={({ fileList }) =>
                  setImage(fileList[0]?.originFileObj)
                }
                maxCount={1}
              >
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
              {image && <p>Uploaded Image: {image.name}</p>}
            </Form.Item>
          </div>
        </Modal>

        {sessionData && !sessionData.isAdmin ? (
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            centered
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Profile;
