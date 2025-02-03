import React, { useState, useLayoutEffect } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import { Routes, Route, Link } from "react-router-dom";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Dashboard from '../pages/Dashboard';
import EventRequests from '../pages/EventRequests';
import "antd/dist/reset.css";
import logo from '../assets/logo.png'

const { Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sessionData, setSessionData] = useState(null);  

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  useLayoutEffect(() => {
    const user = getUserData();
    setSessionData(user);
  }, []);

  if (sessionData === null) {
    return <div>Loading...</div>;  
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100%", margin: 0, padding: 0 }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{ position: "fixed", height: "100vh" }}
      >
        <div style={{ height: 64, color: "white", textAlign: "center", lineHeight: "64px" }}>
          <img width={50} height={50} src={logo} alt="Event Management App" />
        </div>
        <Menu theme="dark" mode="inline">
          {sessionData.isAdmin === false ? (
            <>
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/index/main">Home</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<UserOutlined />}>
                <Link to="/index/profile">Profile</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/index/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<BookOutlined/>}>
                <Link to="/index/requests">Event Requests</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                <Link to="/index/profile">Profile</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 200, padding: 0, width: "100%" }}>
        <Content style={{ margin: 0, padding: 0 }}>
          {sessionData.isAdmin === false ? (
            <Routes>
              <Route path="main" element={<Main collapsed={collapsed} />} />
              <Route path="profile" element={<Profile collapsed={collapsed} />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="dashboard" element={<Dashboard collapsed={collapsed} />} />
              <Route path="requests" element={<EventRequests collapsed={collapsed} />} />
              <Route path="profile" element={<Profile collapsed={collapsed} />} />
            </Routes>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
