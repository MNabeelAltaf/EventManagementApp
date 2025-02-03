import React, { useState, useEffect } from "react";

import { List, Tabs, message, Tag, Button } from "antd";

import "../styling/EventRequests.css";
import { getAuthHeaders } from "../components/TokenValidity";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const EventRequests = ({ collapsed }) => {
  const [allEvents, setAllEvents] = useState([]);

  const [pendingEvent, setPendingEvent] = useState([]);
  const [approvedEvent, setApprovedEvent] = useState([]);
  const [rejectedEvent, setRejectedEvent] = useState([]);

  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const headers = getAuthHeaders();

  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/events`, {
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
      setAllEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Error fetching events");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
    }
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const pendingEvents = allEvents.filter(
      (event) => event.status == "pending"
    );
    const approvedEvents = allEvents.filter(
      (event) => event.status == "approved"
    );
    const rejectedEvents = allEvents.filter(
      (event) => event.status == "rejected"
    );
    setPendingEvent(pendingEvents);
    setApprovedEvent(approvedEvents);
    setRejectedEvent(rejectedEvents);
  }, [allEvents]);

  const onChange = (key) => {
    // console.log(key);
  };

  const rejectRequest = async (item, req_status) => {
    const status = req_status;
    const eventId = item._id;

    try {
      const response = await fetch(`${BASE_URL}/api/events/${eventId}/status`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      });

      const data = await response.json();

      if (response.ok) {
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, status: "rejected" } : event
          )
        );
        message.success("Status updated successfully!");
      } else {
        message.error(data.message || "Failed to update status");
      }
    } catch (error) {
      message.error("Error updating status");
    }
  };

  const approveRequest = async (item, req_status) => {
    const status = req_status;
    const eventId = item._id;

    try {
      const response = await fetch(`${BASE_URL}/api/events/${eventId}/status`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      });

      const data = await response.json();

      if (response.ok) {
        setAllEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, status: "approved" } : event
          )
        );
        message.success("Status updated successfully!");
      } else {
        message.error(data.message || "Failed to update status");
      }
    } catch (error) {
      message.error("Error updating status");
    }
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
                  <div>{""}</div>
                  <div className="request-btns">
                    <span>
                      <Button
                        onClick={() => approveRequest(item, "approved")}
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        style={{
                          backgroundColor: "#3f8600",
                          borderColor: "#3f8600",
                        }}
                      >
                        Approve
                      </Button>{" "}
                    </span>
                    <span>
                      <Button
                        onClick={() => rejectRequest(item, "rejected")}
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        Reject
                      </Button>
                    </span>
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
          <h1>Event Requests</h1>
        </div>
      </div>
      <div className="container-2">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} centered />
      </div>
    </>
  );
};

export default EventRequests;
