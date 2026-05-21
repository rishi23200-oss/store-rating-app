import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import StarRating from '../components/common/StarRating';
import api from '../utils/api';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ by: 'name', order: 'ASC' });

  useEffect(() => {
    api.get('/owner/dashboard')
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const sortedRaters = data?.raters ? [...data.raters].sort((a, b) => {
    const valA = sort.by === 'rating' ? a.rating : (a[sort.by] || '').toLowerCase();
    const valB = sort.by === 'rating' ? b.rating : (b[sort.by] || '').toLowerCase();
    if (valA < valB) return sort.order === 'ASC' ? -1 : 1;
    if (valA > valB) return sort.order === 'ASC' ? 1 : -1;
    return 0;
  }) : [];

  const toggleSort = (col) =>
    setSort(prev => ({ by: col, order: prev.by === col && prev.order === 'ASC' ? 'DESC' : 'ASC' }));

  const SortIcon = ({ col }) => sort.by === col ? (sort.order === 'ASC' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">My Store Dashboard</h1>
              <p className="page-subtitle">Track your store ratings</p>
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" />Loading...</div>
          ) : !data ? (
            <div className="card">
              <p style={{ color: 'var(--text-muted)' }}>No store assigned to your account. Contact an admin.</p>
            </div>
          ) : (
            <>
              <div className="stats-grid" style={{ marginBottom: 32 }}>
                <div className="stat-card">
                  <div className="stat-label">Store Name</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 8 }}>
                    {data.store.name}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Average Rating</div>
                  <div className="stat-value">{data.store.avg_rating ?? '—'}</div>
                  {data.store.avg_rating && (
                    <div style={{ marginTop: 8 }}>
                      <StarRating value={Math.round(data.store.avg_rating)} readonly />
                    </div>
                  )}
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Ratings</div>
                  <div className="stat-value">{data.store.total_ratings}</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Users Who Rated Your Store</span>
                </div>
                {sortedRaters.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No ratings submitted yet</p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => toggleSort('name')}>Name<SortIcon col="name" /></th>
                          <th onClick={() => toggleSort('email')}>Email<SortIcon col="email" /></th>
                          <th onClick={() => toggleSort('rating')}>Rating<SortIcon col="rating" /></th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRaters.map(r => (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 500 }}>{r.name}</td>
                            <td>{r.email}</td>
                            <td><StarRating value={r.rating} readonly /></td>
                            <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                              {new Date(r.updated_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
