import { createBrowserRouter } from "react-router";
import Home from "@/views/home/index";
import Layout from '@/layouts/index';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout></Layout>,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
        ],
    },
]);


export default router;