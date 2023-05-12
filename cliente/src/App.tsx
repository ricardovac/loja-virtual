import * as React from "react";
import Layout from "./components/layout/Layout";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Produtos from "./pages/produtos/Produtos";
import Dashboard from "./pages/dashboard/Dashboard";
import ProdutoImagens from "./pages/produtos/ProdutoImagens";
import Pessoas from "./pages/pessoas/Pessoas";
import Permissoes from "./pages/permissoes/Permissoes";
import Estados from "./pages/cidade_estado/Estados";
import Cidade from "./pages/cidade_estado/Cidades";
import Login from "./pages/auth/Login";
import ErrorPage from "./pages/auth/ErrorPage";
import { LoginService } from "./services/util/LoginService";
import Register from "./pages/auth/Register";

const PrivateRoute = ({ children, redirectTo }: any) => {
    const loginService = new LoginService();
    const isAuthenticated = loginService.autenticado();
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <Dashboard />
                    </PrivateRoute>
                ),
                index: true,
            },
            {
                path: "/produtos/",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <Produtos />,
                    </PrivateRoute>
                ),
            },
            {
                path: "/imagens/:id",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <ProdutoImagens />,
                    </PrivateRoute>
                ),
            },
            {
                path: "/pessoas/",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <Pessoas />,
                    </PrivateRoute>
                ),
            },
            {
                path: "/permissoes/",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <Permissoes />,
                    </PrivateRoute>
                ),
            },
            {
                path: "/estados",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <Estados />,
                    </PrivateRoute>
                ),
            },
            {
                path: "/cidades",
                element: (
                    <PrivateRoute redirectTo="/login">
                        <Cidade />,
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/registrar",
        element: <Register />,
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
