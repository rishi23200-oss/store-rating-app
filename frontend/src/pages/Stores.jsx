import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import StarRating from '../components/common/StarRating';
import api from '../utils/api';

function RateModal({ store, onClose, onSuccess }) {
  const [rating, setRating] = useState(store.user_rating || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a rating'); return; }
    setLoading(true);
    try {
      await api.post(`/stores/${store.id}/rate`, { rating });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{store.user_rating ? 'Update Rating' : 'Rate Store'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>{store.name}</p>
        <div style={{ marginBottom: 20 }}>
          <StarRating value={rating} onChange={setRating} />
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>
            {rating ? `You selected: ${rating} star${rating > 1 ? 's' : ''}` : 'Click a star to rate'}
          </p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : store.user_rating ? 'Update' : 'Submit'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ by: 'name', order: 'ASC' });
  const [ratingStore, setRatingStore] = useState(null);

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy: sort.by, order: sort.order };
    api.get('/stores', { params })
      .then(res => setStores(res.data))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const toggleSort = (col) =>
    setSort(prev => ({ by: col, order: prev.by === col && prev.order === 'ASC' ? 'DESC' : 'ASC' }));

  return (
    <>
      <Navbar />
      {ratingStore && (
        <RateModal store={ratingStore} onClose={() => setRatingStore(null)} onSuccess={fetchStores} />
      )}
      <div className="page">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Stores</h1>
              <p className="page-subtitle">Browse and rate registered stores</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toggleSort('name')}
              >
                Sort by Name {sort.by === 'name' ? (sort.order === 'ASC' ? '↑' : '↓') : ''}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => toggleSort('rating')}
              >
                Sort by Rating {sort.by === 'rating' ? (sort.order === 'ASC' ? '↑' : '↓') : ''}
              </button>
            </div>
          </div>

          <div className="filters-bar">
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Search by name..."
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
            />
            <input
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Search by address..."
              value={filters.address}
              onChange={e => setFilters({ ...filters, address: e.target.value })}
            />
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" />Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <p>No stores found</p>
            </div>
          ) : (
            <div className="stores-grid">
              {stores.map(store => (
                <div key={store.id} className="store-card">
                  <div className="store-name">{store.name}</div>
                  <div className="store-address">📍 {store.address || 'Address not provided'}</div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Overall Rating</div>
                      <div className="rating-display">
                        <StarRating value={Math.round(store.overall_rating || 0)} readonly />
                        <span className="rating-value" style={{ fontSize: 14 }}>
                          {store.overall_rating ? store.overall_rating : 'No ratings'}
                        </span>
                        <span className="rating-count">({store.total_ratings})</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Your Rating</div>
                      {store.user_rating ? (
                        <StarRating value={store.user_rating} readonly />
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Not rated</span>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setRatingStore(store)}
                  >
                    {store.user_rating ? '✏️ Modify Rating' : '⭐ Rate Store'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
