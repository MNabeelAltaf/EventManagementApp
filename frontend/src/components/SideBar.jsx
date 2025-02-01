import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import "antd/dist/reset.css";

const { Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh", width: "100%", margin: 0, padding: 0 }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          style={{ position: "fixed", height: "100vh" }}
        >
          <div style={{ height: 64, color: "white", textAlign: "center", lineHeight: "64px" }}>
            Logo
          </div>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 0 : 200, padding: 0, width: "100%" }}>
          <Content style={{ margin: 0, padding: 0 }}>
            <Routes>
              <Route path="/" element={<Main collapsed={collapsed} />} />
              <Route path="/profile" element={<Profile collapsed={collapsed} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default SideBar;
