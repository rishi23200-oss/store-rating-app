import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ by: 'name', order: 'ASC' });

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.by, order: sort.order };
    api.get('/admin/stores', { params })
      .then(res => setStores(res.data))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const toggleSort = (col) => {
    setSort(prev => ({ by: col, order: prev.by === col && prev.order === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const SortIcon = ({ col }) => sort.by === col ? (sort.order === 'ASC' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Stores</h1>
              <p className="page-subtitle">All registered stores</p>
            </div>
            <Link to="/admin/stores/new" className="btn btn-primary">+ Add Store</Link>
          </div>

          <div className="filters-bar">
            {['name', 'email', 'address'].map(f => (
              <input
                key={f}
                className="form-input"
                style={{ flex: 1, minWidth: 140 }}
                placeholder={`Filter by ${f}`}
                value={filters[f]}
                onChange={e => setFilters({ ...filters, [f]: e.target.value })}
              />
            ))}
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" />Loading...</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => toggleSort('name')}>Name<SortIcon col="name" /></th>
                    <th onClick={() => toggleSort('email')}>Email<SortIcon col="email" /></th>
                    <th onClick={() => toggleSort('address')}>Address<SortIcon col="address" /></th>
                    <th onClick={() => toggleSort('rating')}>Rating<SortIcon col="rating" /></th>
                    <th>Total Ratings</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No stores found</td></tr>
                  ) : stores.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.name}</td>
                      <td>{s.email}</td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address || '—'}</td>
                      <td>{s.rating ? `⭐ ${s.rating}` : '—'}</td>
                      <td>{s.total_ratings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
