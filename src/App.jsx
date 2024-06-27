import { useState } from 'react';
import Layout from './layout';
import 'antd/dist/antd.css'; // 引入 Ant Design 样式
import moment from 'moment';
import 'moment/locale/zh-cn'; // 引入中文语言包

moment.locale('zh-cn'); // 设置 moment.js 的全局语言为中文


import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout />
    </ConfigProvider>
  );
}

export default App;
