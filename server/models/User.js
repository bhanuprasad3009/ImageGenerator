import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  credits: {
    type: Number,
    default: 20,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'active', 'canceled'],
    default: 'inactive',
  },
  stripeCustomerId: {
    type: String,
    default: null,
  },
  stripeSubscriptionId: {
    type: String,
    default: null,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
