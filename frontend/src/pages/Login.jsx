import React, { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import "../styling/Login.css";
import { getAuthHeaders } from "../components/TokenValidity";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const headers = getAuthHeaders();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/index/main");
    }
  }, []);

  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          header: headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.isAdmin) {
          navigate("/index/dashboard");
        } else {
          navigate("/index/main");
        }
      } else {
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Form
        name="basic"
        layout="vertical"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h2 className="heading">Login</h2>
        <br />
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
        <br />
        <span>
          Don't have an account? <Link to="/">Signup</Link>
        </span>
      </Form>
    </div>
  );
};

export default Login;
