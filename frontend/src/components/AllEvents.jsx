import React, { useState } from "react"; // Don't forget to import `useState`
import { Avatar, List, Space, Modal, Button, message } from "antd";
import "../styling/AllEvents.css"; // Import the CSS file

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: "https://ant.design",
  title: `ant design part ${i}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description:
    "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  content:
    "We supply a series of design principles, practical patterns and high-quality design resources.",
}));

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const AllEvents = ({ events }) => {
  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDetails = (item) => {
    setSelectedItem(item);
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const setJoinEvent = async (item) => {
    let userId = "123353"; // hardcoded for now
    try {
      const data = await fetch(`${BASE_URL}/api/join-event`, {
        method: "POST",
        headers: {
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

  return (
    <div className="list-container">
      <Modal
        title={<p>{selectedItem ? selectedItem.title : "Loading Modal"}</p>}
        loading={loading}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={loading}
            onClick={() => setJoinEvent(selectedItem)}
          >
            Join
          </Button>,
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
        // dataSource={data}
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
