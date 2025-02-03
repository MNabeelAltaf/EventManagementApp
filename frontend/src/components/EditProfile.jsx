import React, { useState, useEffect } from "react";
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
  LogoutOutlined,
} from "@ant-design/icons";
import "../styling/EditProfile.css";
import { getAuthHeaders } from "../components/TokenValidity";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;
  const headers = getAuthHeaders();
  const navigate = useNavigate();

  const [userData, setUserData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    image: "",
  });

  const [image, setImage] = useState(null);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

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

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const EditData = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      message.error("New password and confirm password do not match!");
      return;
    }

    const editData = new FormData();
    editData.append("name", formData.name);
    editData.append("email", formData.email);

    if (formData.newPassword) {
      editData.append("newPassword", formData.newPassword);
    }

    editData.append("confirmPassword", formData.confirmPassword);

    if (image) {
      editData.append("userImage", image);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/edit-profile`, {
        method: "POST",
        headers: headers,
        body: editData,
      });

      if (response.ok) {
        const responseData = await response.json();
        message.success("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(responseData));
        setUserData(responseData);
        setFormData({
          userId: responseData.id,
          name: responseData.name || "",
          email: responseData.email || "",
          image: responseData.image || "",
          isAdmin: responseData.isAdmin ? true : false,
        });
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to update profile!");
      }
    } catch (error) {
      message.error("Error while updating profile!");
    }
  };

  useEffect(() => {
    const user = getUserData();
    setUserData(user);
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData({
        userId: userData.userId || "",
        name: userData.name || "",
        email: userData.email || "",
        image: userData.image,
        isAdmin: userData.isAdmin ? true : false,
      });
    }
  }, [userData]);

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
            <img
              src={
                userData?.image
                  ? `${BASE_URL}${formData.image}`
                  : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1738609656~exp=1738613256~hmac=2a03e2396832ab5d7c3e8de85afcff45c4b030d88e4d9af491cdc5074aaa7a1c&w=740"
              }
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          </Col>

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
              &nbsp; &nbsp;
              <Col>
                <Button
                  type="primary"
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  danger
                >
                  Logout
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
          <div>
            <label>Name:</label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label>Email:</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
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
