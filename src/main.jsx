import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import 'antd/dist/antd.css';
import "@/styles/index.css";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';

import 'antd/dist/antd.css'; // 引入 Ant Design 样式
import moment from 'moment';
// import 'moment/locale/zh-cn'; // 引入中文语言包
import 'moment/dist/locale/zh-cn'; // 引入中文语言包
moment.locale('zh-cn'); // 设置 moment.js 的全局语言为中文
console.log('Moment.js language set to:', moment.locale()); // 确认语言设置

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    // theme={{
    //   algorithm: theme.darkAlgorithm
    // }}
    locale={zhCN}
  >
    <Suspense fallback="..loading">
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>
);
