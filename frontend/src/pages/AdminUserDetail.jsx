import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(res => setUser(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 600 }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">User Detail</h1>
              <p className="page-subtitle">Full profile information</p>
            </div>
            <Link to="/admin/users" className="btn btn-ghost">← Back</Link>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" />Loading...</div>
          ) : !user ? (
            <div className="card"><p style={{ color: 'var(--text-muted)' }}>User not found.</p></div>
          ) : (
            <div className="card">
              {[
                ['Name', user.name],
                ['Email', user.email],
                ['Address', user.address || '—'],
                ['Role', <span className={`badge badge-${user.role}`}>{user.role}</span>],
                ...(user.role === 'store_owner' ? [['Store Rating', user.store_rating ? `⭐ ${user.store_rating}` : 'No ratings yet']] : []),
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 140, color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{label}</span>
                  <span style={{ flex: 1, fontWeight: 400 }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
