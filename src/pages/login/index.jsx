import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import bg from "@/assets/bg.jpg";
import { userLogin, userLoginLog } from "@/api/other";
import { useNavigate } from "react-router-dom";
import "./login.scss"

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const {
        code,
        token: { token, data },
      } = await userLogin(values);
      if (code === 200) {
        if (token) {
          // const { token, data } = token;
          message.success("登录成功", 1, () => {
            localStorage.setItem("token", token);
            localStorage.setItem("agency", data.user);
            localStorage.setItem("authority", data.authority);
            localStorage.setItem("collectionAddress",data.collectionAddress)
            // localStorage.setItem("authAddress",data.authAddress)
            // localStorage.setItem("blockerAddress",data.blockerAddress)
            // localStorage.setItem("chatId",data.chatId)
            userLoginLog({admin: data.user})
            navigate("/dashboard", { replace: true });
          });
        } else {
          localStorage.removeItem("token");
          message.error("登录失败");
        }
      }
    } catch (error) {
      message.error("登录失败");
      console.log(`【pages/login/index.jsx-onFinish】error`);
    }
  };
  return (
    <section
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        height: "100%",
      }}
      className="flex justify-center items-center"
    >
      <div className="login-box min-w-96 bg-[#2c3e50] p-16 px-20 rounded-[30px]">
        <div className="login-title">AI-U 后台管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical" 
          autoComplete="off"
        >
          <Form.Item
            label=""
            name="admin"
            rules={[{ required: true, message: "请输入用户名",},]}
          >
            <Input 
              prefix={
                <div style={{width: "70px",textAlign:"right"}}>
                  <span className="mr-2" style={{fontSize: "16px",color:"#1c1c1c"}}>用户名:</span>
                </div>
              } 
              suffix={
                <UserOutlined />
              }
              placeholder="请输入用户名"

            />
          </Form.Item>
          <Form.Item
            label=""
            name="password"
            rules={[{ required: true, message: "请输入密码",}]}
          >
            <Input 
              prefix={
                <div style={{width: "70px",textAlign:"right"}}>
                  <span className="mr-2" style={{fontSize: "16px",color:"#1c1c1c"}}>密 码:</span>
                </div>
              } 
              suffix={
                <LockOutlined />
              }
              type="password" 
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="mt-5 login-btn" shape="circle">登录</Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default Login;
