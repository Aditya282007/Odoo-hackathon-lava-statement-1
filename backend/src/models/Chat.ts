import mongoose, { Schema } from 'mongoose';
import { IChat } from '../types';

const chatSchema = new Schema<IChat>({
  from: {
    type: String,
    required: true,
    ref: 'User'
  },
  to: {
    type: String,
    required: true,
    ref: 'User'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
});

// Indexes for efficient querying
chatSchema.index({ from: 1, to: 1, timestamp: -1 });
chatSchema.index({ to: 1, read: 1 }); // For unread message queries
chatSchema.index({ timestamp: -1 }); // For general sorting

// Virtual for message age
chatSchema.virtual('age').get(function() {
  return Date.now() - this.timestamp.getTime();
});

// Method to mark message as read
chatSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

export default mongoose.model<IChat>('Chat', chatSchema);