import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/login";
import Layout from "@/layout";
import Dashboard from "@/pages/dashboard";
import ProxyList from "@/pages/proxy-list";
import ProxyBill from "@/pages/proxy-bill";
import ProxySubBill from "@/pages/proxy-sub-bill"
import MemberList from "@/pages/member";
import MiningLogs from "@/pages/mining-logs";
import FundDetails from "@/pages/fund-details";
import AssetManagement from "@/pages/asset-management";
import WithdrawalLogs from "@/pages/withdrawal-logs";
import AccessLog from "@/pages/access-log";
import AccessRecord from '@/pages/access-record'
import AnnouncementManagement from "@/pages/announcement-management";
import UserCenter from "@/pages/user-center";
import CollLogs from '@/pages/coll-logs';
import InterceptColl from "@/pages/intercept-coll"
import SysDomain from "@/pages/sys-domain"
import ProxyDomain from "@/pages/proxy-domain"
import HeightPool from "@/pages/height-pool"
import Divident from "@/pages/dividend"
import Account from "@/pages/account"
import HomeConfig from "@/pages/home-config";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard", // 首页
        element: <Dashboard />,
      },
      {
        path: "/proxy/proxy-list", // 代理列表
        element: <ProxyList />,
      },
      {
        path: "/proxy/domain-sys", // 系统域名
        element: <SysDomain />,
      },
      {
        path: "/proxy/domain-proxy", // 代理域名
        element: <ProxyDomain />,
      },
      {
        path: "/bill/proxy-bill", // 总账单
        element: <ProxyBill />,
      },
      {
        path: "/bill/proxy-sub-bill", // 代理账单
        element: <ProxySubBill />,
      },
      {
        path: "member-list", // 会员列表
        element: <MemberList />,
      },
      {
        path: "fund-details", // 资金明细
        element: <FundDetails />,
      },
      {
        path: "asset-management", // 资产管理
        element: <AssetManagement />,
      },
      
      {
        path: "/pool/member-list", //矿池会员
        element: <MemberList />,
      },
      {
        path: "/pool/height-poll", //矿池会员
        element: <HeightPool />,
      },
      {
        path: "/pool/divident", //派息记录
        element: <Divident />,
      },
      {
        path: "/pool/withdrawal-logs", // 提现记录
        element: <WithdrawalLogs />,
      },
      {
        path: "/pool/mining-logs", // 挖矿申请
        element: <MiningLogs />,
      },
      {
        path: "/pool/coll-logs", // 归集记录
        element: <CollLogs />,
      },
      {
        path: "/pool/intercept-coll", //防跑拦截
        element: <InterceptColl />,
      },
      {
        path: "/pool/announcement-management", // 通告管理
        element: <AnnouncementManagement />,
      },
      {
        path: "/report/access-record", // 查询访问记录
        element: <AccessRecord />,
      },
      {
        path:"user-center", //个人信息
        element:<UserCenter/>
      },
      {
        path:"/member/account",//用户列表
        element:<Account />
      },
      {
        path: "/member/access-log", // 授权记录
        element: <AccessLog />,
      },
      {
        path: "/market/home-config", // 授权记录
        element: <HomeConfig />,
      },
    ],
  },
]);

export default router;
