import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
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
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
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
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Store<span>Rate</span></div>
        <p className="auth-subtitle">Create your account</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          {field('name', 'Full Name', 'text', 'Min 20 characters')}
          {field('email', 'Email', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', '8-16 chars, 1 uppercase, 1 special')}
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className={`form-input ${errors.address ? 'error' : ''}`}
              rows={2}
              placeholder="Your address (optional)"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              style={{ resize: 'vertical' }}
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
