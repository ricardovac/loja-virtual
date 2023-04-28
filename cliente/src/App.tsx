import * as React from "react";
import Layout from "./components/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Produtos from "./pages/produtos/Produtos";
import Dashboard from "./pages/dashboard/Dashboard";
import { QueryClient, QueryClientProvider } from "react-query";
import ProdutoImagens from "./pages/produtos/ProdutoImagens";
import Pessoas from "./pages/pessoas/Pessoas";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/produtos/",
        element: <Produtos />,
    },
    {
        path: "/produtoImagens/:id",
        element: <ProdutoImagens />,
    },
    {
        path: "/pessoas/",
        element: <Pessoas />,
    },
]);

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <RouterProvider router={router} />
            </Layout>
        </QueryClientProvider>
    );
}
