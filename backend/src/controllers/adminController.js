const bcrypt = require('bcryptjs');
const db = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) as totalUsers FROM users WHERE role != 'admin'");
    const [[{ totalStores }]] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
    const [[{ totalRatings }]] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    const allowedSort = ['name', 'email', 'address', 'role'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
        ROUND(AVG(r.rating), 1) as store_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (name) { query += ' AND u.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND u.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND u.address LIKE ?'; params.push(`%${address}%`); }
    if (role) { query += ' AND u.role = ?'; params.push(role); }

    query += ` GROUP BY u.id ORDER BY u.${sortCol} ${sortOrder}`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[user]] = await db.query(`
      SELECT u.id, u.name, u.email, u.address, u.role,
        ROUND(AVG(r.rating), 1) as store_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE u.id = ?
      GROUP BY u.id
    `, [id]);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address, role || 'user']
    );

    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;

    const allowedSort = ['name', 'email', 'address', 'rating'];
    const sortCol = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        ROUND(AVG(r.rating), 1) as rating,
        COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sortCol === 'rating' ? 'rating' : `s.${sortCol}`} ${sortOrder}`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const [existing] = await db.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Store email already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: 'Store created', storeId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getUsers, getUserById, createUser, getStores, createStore };
