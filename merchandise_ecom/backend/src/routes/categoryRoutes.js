import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories) // Public
  .post(protect, adminOnly, createCategory); // Admin only

router.route('/:id')
  .delete(protect, adminOnly, deleteCategory); // Admin only

export default router;
