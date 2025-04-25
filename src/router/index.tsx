import { createBrowserRouter } from "react-router";
import Home from "@/views/home/index";
import Layout from '@/layouts/index';
import Game from "@/views/game";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout></Layout>,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/game",
                element: <Game />,
            }
        ],
    },
]);


export default router;