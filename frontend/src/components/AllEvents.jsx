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

const AllEvents = () => {
  const BASAE_URL = import.meta.env.VITE_NODE_BASE_URL;

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
    // console.log(item);

    try {
      const data = await fetch(`${BASAE_URL}/api/join-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!data.ok) {
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
        <p>{selectedItem ? selectedItem.content : "Some contents..."}</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            className="list-item-card"
            key={item.title}
            onClick={() => openDetails(item)}
            extra={
              <img
                className="list-item-image"
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    </div>
  );
};

export default AllEvents;
