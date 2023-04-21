import * as React from 'react';
import Layout from "./components/layout/Layout";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Produtos from "./pages/produtos/Produtos";
import Dashboard from "./pages/dashboard/Dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard/>,
    },
    {
        path: "/produtos",
        element: <Produtos/>,
    },
]);


export default function App() {
    return (
        <Layout>
            <RouterProvider router={router}/>
        </Layout>
    );
}
