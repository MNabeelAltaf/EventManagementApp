import React, { useState, useEffect } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Layout } from "antd";
import "../styling/Dashboard.css";
import { getAuthHeaders } from "../components/TokenValidity";
import AllEvents from "../components/AllEvents";

const Dashboard = ({ collapsed }) => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const [allEventsCount, setAllEventsCount] = useState(0);
  const [pendingEventCount, setPendingEventCount] = useState(0);
  const [approvedEventCount, setApprovedEventCount] = useState(0);
  const [rejectedEventCount, setRejectedEventCount] = useState(0);

  const [allUsers, setallUsers] = useState([]);
  const [allUsersCount, setallUsersCount] = useState(0);

  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const headers = getAuthHeaders();

  // approved events
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

  // all events
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


  // fetch all registered users
  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/users`, {
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
          message.error("Failed to fetch users");
        }
      }
      const usersData = await response.json();
      setallUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Error fetching users");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
    }
    fetchUserEvents();
    fetchAllEvents();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const pendingEvents = allEvents.filter(
      (event) => event.status === "pending"
    );
    const approvedEvents = allEvents.filter(
      (event) => event.status === "approved"
    );
    const rejectedEvents = allEvents.filter(
      (event) => event.status === "rejected"
    );

    setAllEventsCount(allEvents.length)
    setPendingEventCount(pendingEvents.length);
    setApprovedEventCount(approvedEvents.length);
    setRejectedEventCount(rejectedEvents.length);
    setallUsersCount(allUsers.length)

  }, [allEvents]);

  return (
    <>
      <div className={`main-container ${collapsed ? "collapsed" : ""}`}>
        <div className="main-content">
          <h1>Dashboard</h1>
        </div>
      </div>
      <div className="dashboard-container">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Card bordered={false}>
              <Statistic
                title="Registered Users"
                value={allUsersCount}
                valueStyle={{
                  color: "#3f8600",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Card bordered={false}>
              <Statistic
                title="All Events"
                value={allEventsCount}
              />
            </Card>
          </Col>
        </Row>

        <br />

        <Row gutter={8}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card bordered={false}>
              <Statistic
                title="Active Events"
                value={approvedEventCount}
                valueStyle={{
                  color: "#3f8600",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card bordered={false}>
              <Statistic
                title="Pending Events"
                value={pendingEventCount}
                valueStyle={{
                  color: "#FFD700",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card bordered={false}>
              <Statistic
                title="Rejected Events"
                value={rejectedEventCount}
                valueStyle={{
                  color: "#cf1322",
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <br />
      {/* all events */}
      <Layout className="EventList">
        <h1 className="heading1">All Events</h1>
        <AllEvents events={events} />
      </Layout>
    </>
  );
};

export default Dashboard;
