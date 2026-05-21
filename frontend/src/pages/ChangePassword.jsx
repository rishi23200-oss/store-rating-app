import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';
import { validatePassword } from '../utils/validators';

export default function ChangePassword() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwErr = validatePassword(form.password);
    const confirmErr = form.password !== form.confirm ? 'Passwords do not match' : '';
    setErrors({ password: pwErr, confirm: confirmErr });
    if (pwErr || confirmErr) return;

    setLoading(true);
    setSuccess('');
    try {
      await api.put('/auth/password', { password: form.password });
      setSuccess('Password updated successfully!');
      setForm({ password: '', confirm: '' });
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 480 }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Change Password</h1>
              <p className="page-subtitle">Update your account password</p>
            </div>
          </div>
          <div className="card">
            {success && <div className="alert alert-success">{success}</div>}
            {errors.server && <div className="alert alert-error">{errors.server}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type="password"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className={`form-input ${errors.confirm ? 'error' : ''}`}
                  type="password"
                  placeholder="Re-enter new password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                />
                {errors.confirm && <div className="form-error">{errors.confirm}</div>}
              </div>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
