import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }

  const url = req.file.path || req.file.secure_url || req.file.url;
  if (!url) {
    return res.status(500).json({
      success: false,
      message: 'Upload completed but no file URL was returned by the storage provider.',
    });
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    url,
  });
});

export default router;
