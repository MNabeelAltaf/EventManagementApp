import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";

import "../styling/Signup.css";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_NODE_BASE_URL;

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    if (values.password.length <= 12 && values.confirmPassword <= 12) {
      message.error("Password length can't be less than 13");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        isAdmin: false,
      };

      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Signup successful!");
        navigate("/login");
      } else {
        message.error(data.message || "Signup failed!");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Form layout="vertical" onFinish={onSubmit} className="signup-form">
        <h2 className="heading">Signup</h2>
        <br />

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign Up
          </Button>
        </Form.Item>

        <br />
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </Form>
    </div>
  );
};

export default Signup;
