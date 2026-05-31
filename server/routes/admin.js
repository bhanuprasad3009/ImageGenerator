import express from 'express';
import User from '../models/User.js';
import Image from '../models/Image.js';
import Blocklist from '../models/Blocklist.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Apply protect & admin middlewares to all routes here
router.use(protect);
router.use(admin);

// @desc    Get dashboard metrics & stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalImages = await Image.countDocuments();
    const totalBlockedPhrases = await Blocklist.countDocuments();

    // Plan distribution
    const freeUsers = await User.countDocuments({ plan: 'free' });
    const proUsers = await User.countDocuments({ plan: 'pro' });
    const premiumUsers = await User.countDocuments({ plan: 'premium' });

    // Popular styles aggregation
    const styleStats = await Image.aggregate([
      { $group: { _id: '$style', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Average user credits
    const creditStats = await User.aggregate([
      { $group: { _id: null, avgCredits: { $avg: '$credits' }, totalCredits: { $sum: '$credits' } } }
    ]);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalImages,
        totalBlockedPhrases,
        avgCredits: creditStats.length ? Math.round(creditStats[0].avgCredits) : 0,
        totalCreditsInCirculation: creditStats.length ? creditStats[0].totalCredits : 0
      },
      plans: {
        free: freeUsers,
        pro: proUsers,
        premium: premiumUsers
      },
      stylePopularity: styleStats
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

// @desc    Set credits for a user
// @route   POST /api/admin/users/:id/credits
// @access  Private (Admin only)
router.post('/users/:id/credits', async (req, res, next) => {
  try {
    const { credits } = req.body;

    if (credits === undefined || isNaN(credits)) {
      res.status(400);
      throw new Error('Please enter a valid credit amount');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.credits = parseInt(credits);
    await user.save();

    res.json({
      success: true,
      message: `Updated credits for user ${user.name} to ${credits}`,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Change a user's subscription plan manually
// @route   POST /api/admin/users/:id/plan
// @access  Private (Admin only)
router.post('/users/:id/plan', async (req, res, next) => {
  try {
    const { plan, subscriptionStatus } = req.body;

    if (!['free', 'pro', 'premium'].includes(plan)) {
      res.status(400);
      throw new Error('Invalid plan selection');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.plan = plan;
    if (subscriptionStatus) {
      user.subscriptionStatus = subscriptionStatus;
    } else {
      user.subscriptionStatus = plan === 'free' ? 'inactive' : 'active';
    }
    await user.save();

    res.json({
      success: true,
      message: `Updated plan for user ${user.name} to ${plan.toUpperCase()}`,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get word blocklist
// @route   GET /api/admin/blocklist
// @access  Private (Admin only)
router.get('/blocklist', async (req, res, next) => {
  try {
    const blocklist = await Blocklist.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blocklist });
  } catch (error) {
    next(error);
  }
});

// @desc    Add a word/phrase to blocklist
// @route   POST /api/admin/blocklist
// @access  Private (Admin only)
router.post('/blocklist', async (req, res, next) => {
  try {
    const { phrase } = req.body;

    if (!phrase) {
      res.status(400);
      throw new Error('Word or phrase is required');
    }

    const alreadyExists = await Blocklist.findOne({ phrase: phrase.toLowerCase() });
    if (alreadyExists) {
      res.status(400);
      throw new Error('Phrase is already blocked');
    }

    const newBlock = await Blocklist.create({
      phrase: phrase.toLowerCase(),
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: `Successfully blocked phrase "${phrase}"`,
      phrase: newBlock
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a phrase from blocklist
// @route   DELETE /api/admin/blocklist/:id
// @access  Private (Admin only)
router.delete('/blocklist/:id', async (req, res, next) => {
  try {
    const item = await Blocklist.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Blocked item not found');
    }

    await Blocklist.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Phrase removed from blocklist'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
