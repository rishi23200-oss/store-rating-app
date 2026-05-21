import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';
import { validateName, validateEmail, validateAddress } from '../utils/validators';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner' } })
      .then(res => setOwners(res.data));
  }, []);

  const validate = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setServerError('');
    setLoading(true);
    try {
      await api.post('/admin/stores', form);
      navigate('/admin/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Store</h1>
              <p className="page-subtitle">Register a new store</p>
            </div>
            <Link to="/admin/stores" className="btn btn-ghost">← Back</Link>
          </div>
          <div className="card">
            {serverError && <div className="alert alert-error">{serverError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Min 20 characters"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="store@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  rows={2}
                  placeholder="Store address (optional)"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
                {errors.address && <div className="form-error">{errors.address}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Owner (Optional)</label>
                <select
                  className="form-select"
                  value={form.owner_id}
                  onChange={e => setForm({ ...form, owner_id: e.target.value })}
                >
                  <option value="">— No owner assigned —</option>
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Store'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
