import * as React from "react";
import Layout from "./components/layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Produtos from "./pages/produtos/Produtos";
import Dashboard from "./pages/dashboard/Dashboard";
import ProdutoImagens from "./pages/produtos/ProdutoImagens";
import Pessoas from "./pages/pessoas/Pessoas";
import Permissoes from "./pages/permissoes/Permissoes";
import Estados from "./pages/cidade_estado/Estados";
import Cidade from "./pages/cidade_estado/Cidades";

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
    {
        path: "/permissoes/",
        element: <Permissoes />,
    },
    {
        path: "/estados",
        element: <Estados />,
    },
    {
        path: "/cidades",
        element: <Cidade />,
    },
]);

export default function App() {
    return (
        <Layout>
            <RouterProvider router={router} />
        </Layout>
    );
}
