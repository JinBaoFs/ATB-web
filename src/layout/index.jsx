import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Modal, Form, Input, message, Tabs } from "antd";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useEffect } from "react";
import { 
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import "./layout.scss";
import ailogo from '@/assets/ai-u.png'

const { Header, Content, Sider } = Layout;
const App = () => {
  const navigate = useNavigate();
  const items2 = [
    {
      key: "/dashboard",
      label: "控制台",
      icon: <HomeOutlined />,
    },
  ];
  let agency = localStorage.getItem("agency") || ""
  const token = localStorage.getItem("token");
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    if (!token) {
      navigate("/login", {replace: true,});
      return;
    }else if(location.pathname == '/'){
      navigate("/dashboard",{replace: true,});
      return;
    }
  }, [token]);

  
  const handleSelect = ({ item, key, keyPath, domEvent }) => {
    if(!keyPath)return
    let path = keyPath.reverse().join("")
    navigate(path)
    filterMenuTabs(key,path,items2)
  };
  const location = useLocation();
  useEffect(()=>{
  },[location])

  const defaultSelectedKeys = useMemo(() => {
    const sumMenu = []
    if(sumMenu.includes(location.pathname.split('/')[1])){
      return `/${location.pathname.split('/')[2]}`
    }else{
      return [location.pathname];
    }
  }, [location]);
 
  //退出登陆
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <section className="container-box">
      <aside>
        <div className="logo text-white" style={{width: collapsed ? '80px' : '200px' }}>
          ATB
        </div>
        <div className="menu-box">
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={defaultSelectedKeys}
            defaultOpenKeys={['/pool']}
            style={{
              borderRight: 0,
            }}
            className="h-full"
            items={items2}
            onClick={handleSelect}
          />
        </div>
      </aside>
      <section className="main-r">
        <header>
          <div style={{display: 'flex',alignItems: 'center',color: '#fff'}}>
          </div>
          <div className="r-box">
            <Dropdown
                menu={{
                  items: [
                    {
                      key: "5",
                      label: (
                        <Button type="link" size="small" icon={<LoginOutlined />} onClick={handleLogOut} style={{color: "#1c1c1c"}}>
                          退出登录
                        </Button>
                      )
                    },
                  ],
                }}
              >
                <div style={{display: 'flex',alignItems: 'center',color: '#fff',cursor: "pointer",fontSize: "15px"}}>
                  {/* <Avatar size="small" icon={<UserOutlined />} /> */}
                  <UserOutlined />
                  <span className="ml-2 mr-2">欢迎您，{ agency }</span>
                  <CaretDownOutlined />
                </div>
            </Dropdown>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </section>
    </section>
  );
};
export default App;
