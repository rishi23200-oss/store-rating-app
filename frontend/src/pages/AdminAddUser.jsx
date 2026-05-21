import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
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
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user');
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
              <h1 className="page-title">Add User</h1>
              <p className="page-subtitle">Create a new platform user</p>
            </div>
            <Link to="/admin/users" className="btn btn-ghost">← Back</Link>
          </div>
          <div className="card">
            {serverError && <div className="alert alert-error">{serverError}</div>}
            <form onSubmit={handleSubmit}>
              {[
                ['name', 'Full Name', 'text', 'Min 20 characters'],
                ['email', 'Email', 'email', 'user@example.com'],
                ['password', 'Password', 'password', '8-16 chars, 1 uppercase, 1 special'],
              ].map(([key, label, type, placeholder]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    className={`form-input ${errors[key] ? 'error' : ''}`}
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                  {errors[key] && <div className="form-error">{errors[key]}</div>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  rows={2}
                  placeholder="Optional address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
                {errors.address && <div className="form-error">{errors.address}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
