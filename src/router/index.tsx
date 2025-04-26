import { createBrowserRouter } from "react-router";
import Home from "@/views/home/index";
import Layout from '@/layouts/index';
import Game from "@/views/game";
import Future from "@/views/future";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/game",
                element: <Game />,
            },
            {
                path: "*", // ⭐️ 兜底匹配
                element: <Future />,
            },
        ],
    },
]);

export default router;
