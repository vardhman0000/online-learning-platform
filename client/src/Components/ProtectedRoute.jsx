import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 1. Check if the user is logged in
  if (!token || !user) {
    // If not, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // 2. Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are logged in but don't have the right role,
    // redirect them to the home page.
    // You could also create a dedicated "Unauthorized" page.
    return <Navigate to="/" replace />;
  }

  // 3. If they are logged in and have the right role, show the page
  return <Outlet />;
};

export default ProtectedRoute;
