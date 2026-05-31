import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Image from '../models/Image.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @desc    Get all public images (Community Gallery)
// @route   GET /api/images
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, style, page = 1, limit = 12 } = req.query;

    const query = { isPublic: true };

    // Search filter
    if (search) {
      query.prompt = { $regex: search, $options: 'i' };
    }

    // Style filter
    if (style && style !== 'All') {
      query.style = style;
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);

    // Fetch images populated with user details (name, email)
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skipIndex)
      .populate('user', 'name');

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user's generated images
// @route   GET /api/images/my
// @access  Private
router.get('/my', protect, async (req, res, next) => {
  try {
    const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      images
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user's saved/favorited images
// @route   GET /api/images/favorites
// @access  Private
router.get('/favorites', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'user', select: 'name' }
    });

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle Save to Favorites
// @route   POST /api/images/:id/favorite
// @access  Private
router.post('/:id/favorite', protect, async (req, res, next) => {
  try {
    const image = await Image.findById(req.id || req.params.id);
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    const user = await User.findById(req.user.id);
    const isFavorited = user.favorites.includes(image._id);

    if (isFavorited) {
      // Remove favorite
      user.favorites = user.favorites.filter(id => id.toString() !== image._id.toString());
      await user.save();
      res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    } else {
      // Add favorite
      user.favorites.push(image._id);
      await user.save();
      res.json({ success: true, favorited: true, message: 'Added to favorites' });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Like / Unlike a public image
// @route   POST /api/images/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    const isLiked = image.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      image.likes = image.likes.filter(id => id.toString() !== req.user.id.toString());
      await image.save();
      res.json({ success: true, liked: false, likesCount: image.likes.length });
    } else {
      // Like
      image.likes.push(req.user.id);
      await image.save();
      res.json({ success: true, liked: true, likesCount: image.likes.length });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Comment on a public image
// @route   POST /api/images/:id/comment
// @access  Private
router.post('/:id/comment', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    const comment = {
      user: req.user.id,
      userName: req.user.name,
      text,
      createdAt: new Date()
    };

    image.comments.push(comment);
    await image.save();

    res.status(201).json({
      success: true,
      comment: image.comments[image.comments.length - 1]
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a generated image
// @route   DELETE /api/images/:id
// @access  Private (Owner or Admin only)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404);
      throw new Error('Image not found');
    }

    // Check permissions: creator or admin
    if (image.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Unauthorized to delete this image');
    }

    // Delete local physical file if it exists and starts with '/generations'
    if (image.url.startsWith('/generations')) {
      const filename = image.url.split('/').pop();
      const localFilePath = path.join(__dirname, '../public/generations', filename);
      
      try {
        if (fs.existsSync(localFilePath)) {
          await fs.promises.unlink(localFilePath);
          console.log(`Deleted file locally: ${localFilePath}`);
        }
      } catch (err) {
        console.error('Failed to delete file from disk:', err.message);
      }
    }

    // Remove reference from all users who saved this in favorites
    await User.updateMany(
      { favorites: image._id },
      { $pull: { favorites: image._id } }
    );

    // Delete image document from DB
    await Image.findByIdAndDelete(image._id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
