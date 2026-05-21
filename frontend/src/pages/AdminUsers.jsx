import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ by: 'name', order: 'ASC' });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.by, order: sort.order };
    api.get('/admin/users', { params })
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSort = (col) => {
    setSort(prev => ({
      by: col,
      order: prev.by === col && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const SortIcon = ({ col }) => sort.by === col ? (sort.order === 'ASC' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Users</h1>
              <p className="page-subtitle">Manage platform users</p>
            </div>
            <Link to="/admin/users/new" className="btn btn-primary">+ Add User</Link>
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
            <select
              className="form-select"
              style={{ flex: 1, minWidth: 140 }}
              value={filters.role}
              onChange={e => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
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
                    <th onClick={() => toggleSort('role')}>Role<SortIcon col="role" /></th>
                    <th>Store Rating</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No users found</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address || '—'}</td>
                      <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                      <td>{u.store_rating ? `⭐ ${u.store_rating}` : '—'}</td>
                      <td><Link to={`/admin/users/${u.id}`} className="btn btn-ghost btn-sm">View</Link></td>
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
