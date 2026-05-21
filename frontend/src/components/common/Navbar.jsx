import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'store_owner' ? '/owner' :
    '/stores';

  return (
    <nav className="navbar">
      <Link to={dashboardPath} className="navbar-brand">
        Store<span>Rate</span>
      </Link>
      <div className="navbar-links">
        {user && (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: 14, marginRight: 8 }}>
              {user.name}
            </span>
            <Link to="/change-password" className="btn btn-ghost btn-sm">Password</Link>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
