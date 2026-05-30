import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";
import ProtectedRoute from "../components/shared/ProtectedRoute.jsx";
import AdminRoute from "../components/shared/AdminRoute.jsx";

import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import CategoriesPage from "../pages/CategoriesPage.jsx";
import ExpensesPage from "../pages/ExpensesPage.jsx";
import ExchangeRatesPage from "../pages/ExchangeRatesPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import AdminUsersPage from "../pages/AdminUsersPage.jsx";
import AdminExpensesPage from "../pages/AdminExpensesPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="exchange-rates" element={<ExchangeRatesPage />} />

            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/expenses" element={<AdminExpensesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;