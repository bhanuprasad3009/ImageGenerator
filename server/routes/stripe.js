import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe (optional key)
const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripeInstance = null;

if (stripeSecret) {
  stripeInstance = new Stripe(stripeSecret);
}

// Plan Configurations
const PLANS = {
  pro: {
    name: 'AetherArt Pro',
    credits: 200,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_mock_pro_999',
    price: 9.99
  },
  premium: {
    name: 'AetherArt Premium',
    credits: 10000, // Effectively infinite
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_mock_premium_2499',
    price: 24.99
  }
};

// @desc    Create Stripe Checkout Session (or fallback to Simulation)
// @route   POST /api/stripe/checkout
// @access  Private
router.post('/checkout', protect, async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!['pro', 'premium'].includes(plan)) {
      res.status(400);
      throw new Error('Invalid plan selection');
    }

    const planConfig = PLANS[plan];
    const user = await User.findById(req.user.id);

    // DUAL MODE: MOCK OR REAL STRIPE
    if (!stripeInstance) {
      console.log('Stripe Key missing. Running in Simulated Mode...');
      return res.json({
        success: true,
        mode: 'simulation',
        url: `/billing?simulated_checkout=success&plan=${plan}`
      });
    }

    // Real Stripe Checkout
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${req.headers.origin}/billing?checkout=cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        plan: plan
      }
    });

    res.json({
      success: true,
      mode: 'live',
      url: session.url
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Simulate checkout completion (for instant local testing without keys)
// @route   POST /api/stripe/simulate-checkout
// @access  Private
router.post('/simulate-checkout', protect, async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!['pro', 'premium'].includes(plan)) {
      res.status(400);
      throw new Error('Invalid plan selection');
    }

    const planConfig = PLANS[plan];
    const user = await User.findById(req.user.id);

    // Update user plan immediately
    user.plan = plan;
    user.subscriptionStatus = 'active';
    user.credits = user.credits + planConfig.credits; // Top up credits!
    await user.save();

    res.json({
      success: true,
      message: `Successfully simulated subscription to AetherArt ${plan.toUpperCase()}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create Stripe Portal Session (or simulation) for managing subscription
// @route   POST /api/stripe/portal
// @access  Private
router.post('/portal', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!stripeInstance || !user.stripeCustomerId) {
      // Mock portal response
      return res.json({
        success: true,
        mode: 'simulation',
        url: `/billing?portal=simulation`
      });
    }

    // Real Stripe Customer Portal
    const portalSession = await stripeInstance.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.origin}/billing`,
    });

    res.json({
      success: true,
      mode: 'live',
      url: portalSession.url
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Stripe Webhook Listener (Handles subscription updates from live stripe)
// @route   POST /api/stripe/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeInstance || !sig || !endpointSecret) {
    return res.status(400).send('Webhook environment is unconfigured');
  }

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle stripe events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;
        const planConfig = PLANS[plan];

        if (userId && planConfig) {
          await User.findByIdAndUpdate(userId, {
            plan: plan,
            subscriptionStatus: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            $inc: { credits: planConfig.credits } // Top up credits!
          });
          console.log(`User ${userId} subscribed successfully to ${plan}`);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Reset user subscription status
        await User.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan: 'free',
            subscriptionStatus: 'inactive',
            stripeSubscriptionId: null
          }
        );
        console.log(`Subscription ${subscription.id} canceled`);
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Processing Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
