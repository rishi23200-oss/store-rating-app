import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Platform overview and management</p>
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /> Loading stats...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats?.totalUsers ?? '—'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Stores</div>
                <div className="stat-value">{stats?.totalStores ?? '—'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Ratings Submitted</div>
                <div className="stat-value">{stats?.totalRatings ?? '—'}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">User Management</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
                View, filter, and add users to the platform.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/admin/users" className="btn btn-primary btn-sm">View Users</Link>
                <Link to="/admin/users/new" className="btn btn-ghost btn-sm">Add User</Link>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Store Management</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
                View all registered stores and their ratings.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/admin/stores" className="btn btn-primary btn-sm">View Stores</Link>
                <Link to="/admin/stores/new" className="btn btn-ghost btn-sm">Add Store</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
