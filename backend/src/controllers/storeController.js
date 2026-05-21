const db = require('../config/db');

const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;

    const allowedSort = ['name', 'address', 'rating'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.address, s.email,
        ROUND(AVG(r.rating), 1) as overall_rating,
        COUNT(r.id) as total_ratings,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` GROUP BY s.id, ur.rating ORDER BY ${sortCol === 'rating' ? 'overall_rating' : `s.${sortCol}`} ${sortOrder}`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const [existing] = await db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );
      return res.json({ message: 'Rating updated successfully' });
    }

    await db.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, submitRating };
