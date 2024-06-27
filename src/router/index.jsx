import { createBrowserRouter } from "react-router-dom";

import Login from "@/pages/login";
import Layout from "@/layout";
import Dashboard from "@/pages/dashboard";

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
        path: "dashboard", // 控制台
        element: <Dashboard />,
      },
      {
        path: "", // 修改推荐关系
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
