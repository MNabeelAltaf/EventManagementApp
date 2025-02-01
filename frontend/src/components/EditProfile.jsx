import React, { useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  Input,
  Row,
  Col,
  Layout,
  Upload,
  message,
  Form,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../styling/EditProfile.css"; // Import CSS file

const EditProfile = () => {
  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    city: "New York",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(null); // To store the uploaded image file

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const EditData = async () => {
    if (!formData.currentPassword.trim()) {
      message.error("Please fill in the current password field!");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      message.error("New password and confirm password do not match!");
      return;
    }

    const editData = new FormData();
    editData.append("name", formData.name);
    editData.append("email", formData.email);
    editData.append("city", formData.city);
    editData.append("currentPassword", formData.currentPassword);
    editData.append("newPassword", formData.newPassword);
    editData.append("confirmPassword", formData.confirmPassword);

    if (image) {
      editData.append("userImage", image); 
    }

    try {
      const response = await fetch(`${BASE_URL}/api/edit-profile`, {
        method: "POST",
        body: editData,
      });

      if (response.ok) {
        message.success("Profile updated successfully!");
        setIsModalOpen(false);
      } else {
        message.error("Failed to update profile!");
      }
    } catch (error) {
      message.error("Error while updating profile!");
    }
  };

  return (
    <div className="profile-container">
      <Layout className="profile-card">
        <Row gutter={16}>
          {/* First Column: Avatar */}
          <Col
            xs={24}
            sm={8}
            md={8}
            lg={8}
            xl={8}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            <Avatar size={100} src={formData.avatar} icon={<UserOutlined />} />
          </Col>

          {/* Second Column: Profile Info */}
          <Col
            xs={24}
            sm={16}
            md={16}
            lg={16}
            xl={16}
            style={{ textAlign: "left" }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <strong>Name:</strong> {formData.name}
              </Col>
              <br />
              <Col xs={24} sm={8}>
                <strong>Email:</strong> {formData.email}
              </Col>
              <br />
              <Col xs={24} sm={8}>
                <strong>City:</strong> {formData.city}
              </Col>
            </Row>
            <Row justify="center" style={{ marginTop: "3.1rem" }}>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={showModal}
                >
                  Edit Profile
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={EditData}
        okText="Edit"
      >
        <div>
          {/* Name */}
          <div>
            <label>Name:</label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          {/* Email */}
          <div>
            <label>Email:</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div>
            <label>City:</label>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </div>
<br />
          {/* Event Image */}
          <Form.Item label="User Image">
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
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
            {image && <p>Uploaded Image: {image.name}</p>}
          </Form.Item>

          {/* Current Password */}
          <div>
            <label>
              <span style={{ color: "red" }}>* </span>Current Password:
            </label>
            <Input.Password
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          {/* New Password */}
          <div>
            <label>New Password:</label>
            <Input.Password
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label>Confirm New Password:</label>
            <Input.Password
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditProfile;
