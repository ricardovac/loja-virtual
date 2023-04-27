import * as React from 'react';
import Layout from "./components/layout/Layout";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Produtos from "./pages/produtos/Produtos";
import Dashboard from "./pages/dashboard/Dashboard";
import {QueryClient, QueryClientProvider} from "react-query";
import ProdutoImagens from "./pages/produtos/ProdutoImagens";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Produtos/>,
    },
    {
        path: "/dashboard/",
        element: <Dashboard/>,
    },
    {
        path: "/produtoImagens/:id",
        element: <ProdutoImagens/>,
    },
]);

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <RouterProvider router={router}/>
            </Layout>
        </QueryClientProvider>
    );
}
