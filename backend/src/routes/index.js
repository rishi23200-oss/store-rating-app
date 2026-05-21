const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  handleValidation,
  userValidationRules,
  passwordUpdateRules,
  storeValidationRules,
  ratingValidationRules,
} = require('../middleware/validate');
const { register, login, updatePassword } = require('../controllers/authController');
const { getDashboardStats, getUsers, getUserById, createUser, getStores: adminGetStores, createStore } = require('../controllers/adminController');
const { getStores, submitRating } = require('../controllers/storeController');
const { getOwnerDashboard } = require('../controllers/ownerController');

// --- Auth Routes ---
router.post('/auth/register', userValidationRules, handleValidation, register);
router.post('/auth/login', login);
router.put('/auth/password', authenticate, passwordUpdateRules, handleValidation, updatePassword);

// --- Admin Routes ---
router.get('/admin/dashboard', authenticate, authorize('admin'), getDashboardStats);
router.get('/admin/users', authenticate, authorize('admin'), getUsers);
router.get('/admin/users/:id', authenticate, authorize('admin'), getUserById);
router.post('/admin/users', authenticate, authorize('admin'), userValidationRules, handleValidation, createUser);
router.get('/admin/stores', authenticate, authorize('admin'), adminGetStores);
router.post('/admin/stores', authenticate, authorize('admin'), storeValidationRules, handleValidation, createStore);

// --- Normal User Routes ---
router.get('/stores', authenticate, authorize('user', 'admin'), getStores);
router.post('/stores/:storeId/rate', authenticate, authorize('user'), ratingValidationRules, handleValidation, submitRating);

// --- Store Owner Routes ---
router.get('/owner/dashboard', authenticate, authorize('store_owner'), getOwnerDashboard);

module.exports = router;
