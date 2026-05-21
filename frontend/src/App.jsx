import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminAddUser from './pages/AdminAddUser';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';

import Stores from './pages/Stores';
import OwnerDashboard from './pages/OwnerDashboard';

function Unauthorized() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem' }}>403</h1>
      <p style={{ color: 'var(--text-muted)' }}>You are not authorized to view this page.</p>
      <a href="/login" className="btn btn-primary">Go to Login</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Shared - all logged-in users */}
          <Route path="/change-password" element={
            <ProtectedRoute roles={['admin', 'user', 'store_owner']}>
              <ChangePassword />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/new" element={
            <ProtectedRoute roles={['admin']}>
              <AdminAddUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUserDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute roles={['admin']}>
              <AdminStores />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores/new" element={
            <ProtectedRoute roles={['admin']}>
              <AdminAddStore />
            </ProtectedRoute>
          } />

          {/* Normal User */}
          <Route path="/stores" element={
            <ProtectedRoute roles={['user', 'admin']}>
              <Stores />
            </ProtectedRoute>
          } />

          {/* Store Owner */}
          <Route path="/owner" element={
            <ProtectedRoute roles={['store_owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
