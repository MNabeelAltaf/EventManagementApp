import React, { useState, useLayoutEffect } from "react";
import { Avatar, List, Space, Modal, Button, message } from "antd";
import "../styling/AllEvents.css";
import { getAuthHeaders } from "../components/TokenValidity";
import { useNavigate } from "react-router-dom";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const AllEvents = ({ events }) => {
  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;
  const headers = getAuthHeaders();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userData, setUserData] = useState();

  const openDetails = (item) => {
    setSelectedItem(item);
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const setJoinEvent = async (item) => {
    let userId = userData.userId;
    try {
      const data = await fetch(`${BASE_URL}/api/join-event`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: item._id,
          user_id: userId,
        }),
      });

      if (data.status == 401) {
        message.error("Already joined Event");
      } else if (!data.ok) {
        message.error("Fail to Join Event");
      } else if (data.ok) {
        message.success("Events Joined Sucessfully");
      }
    } catch (error) {}
    setOpen(false);
  };

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  useLayoutEffect(() => {
    const user = getUserData();
    setUserData(user);
  }, []);



  return (
    <div className="list-container">
      <Modal
        title={<p>{selectedItem ? selectedItem.title : "Loading Modal"}</p>}
        loading={loading}
        footer={[
          userData && !userData.isAdmin ? (
            <>
              <Button key="cancel" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                key="ok"
                type="primary"
                loading={loading}
                onClick={() => setJoinEvent(selectedItem)}
              >
                Join
              </Button>
            </>
          ) : null,
        ]}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <div className="modal-event-details">
          <p>
            <strong>Venue:</strong>{" "}
            {selectedItem
              ? `${selectedItem.location}, ${selectedItem.city}`
              : "Loading..."}
          </p>

          <p>
            <strong>Start Time:</strong>
            {selectedItem
              ? new Date(selectedItem.startTime).toLocaleString()
              : "Loading..."}
          </p>
          <p>
            <strong>End Time:</strong>
            {selectedItem
              ? new Date(selectedItem.endTime).toLocaleString()
              : "Loading..."}
          </p>

          <p>
            <strong>Description:</strong>
            {selectedItem ? selectedItem.description : "Loading..."}
          </p>

          <div className="modal-image">
            {selectedItem && selectedItem.image && (
              <img
                src={`${BASE_URL}${selectedItem.image}`}
                alt={selectedItem.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
      </Modal>

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 15,
          style: { textAlign: "center" },
        }}
        dataSource={events}
        renderItem={(item) => (
          <List.Item
            className="list-item-card"
            key={item.title}
            onClick={() => openDetails(item)}
            extra={
              <img
                className="list-item-image"
                alt="logo"
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
              <p> {`End time; ${new Date(item.endTime).toLocaleString()}`}</p>
            </div>
            <div className="event-description">
              <p>{item.description}</p>
            </div>

            <div className="event-status-tag">
              <div>
                <Button type="primary" success>
                  View Details
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AllEvents;
