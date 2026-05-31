import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide the image URL or source'],
  },
  prompt: {
    type: String,
    required: [true, 'Please provide the prompt used'],
    trim: true,
  },
  enhancedPrompt: {
    type: String,
    trim: true,
  },
  style: {
    type: String,
    default: 'None',
  },
  aspectRatio: {
    type: String,
    default: '1:1',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
}, {
  timestamps: true,
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
