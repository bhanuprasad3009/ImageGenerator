import mongoose from 'mongoose';

const blocklistSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: [true, 'Please provide the blocked word or phrase'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

const Blocklist = mongoose.model('Blocklist', blocklistSchema);
export default Blocklist;
