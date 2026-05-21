const db = require('../config/db');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [[store]] = await db.query(
      'SELECT id, name FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const [[{ avg_rating, total_ratings }]] = await db.query(`
      SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as total_ratings
      FROM ratings WHERE store_id = ?
    `, [store.id]);

    const [raters] = await db.query(`
      SELECT u.id, u.name, u.email, r.rating, r.updated_at
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
      ORDER BY r.updated_at DESC
    `, [store.id]);

    res.json({
      store: { ...store, avg_rating, total_ratings },
      raters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getOwnerDashboard };
