import mongoose, { Schema } from 'mongoose';
import { IReport } from '../types';

const reportSchema = new Schema<IReport>({
  fromUser: {
    type: String,
    required: true,
    ref: 'User'
  },
  toUser: {
    type: String,
    required: true,
    ref: 'User'
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: [
      'Inappropriate behavior',
      'Harassment or bullying',
      'Spam or fake profile',
      'Inappropriate content',
      'Scam or fraud',
      'Other'
    ]
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: '',
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  reviewedBy: {
    type: String,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  resolution: {
    type: String,
    maxlength: [1000, 'Resolution cannot exceed 1000 characters'],
    trim: true
  }
});

// Indexes for efficient querying
reportSchema.index({ toUser: 1, timestamp: -1 });
reportSchema.index({ fromUser: 1, timestamp: -1 });
reportSchema.index({ status: 1, timestamp: -1 });
reportSchema.index({ reason: 1 });

// Prevent duplicate reports from same user to same user
reportSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

// Virtual for report age
reportSchema.virtual('age').get(function() {
  return Date.now() - this.timestamp.getTime();
});

// Method to mark report as reviewed
reportSchema.methods.markAsReviewed = function(reviewerId: string, resolution?: string) {
  this.status = 'reviewed';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  if (resolution) {
    this.resolution = resolution;
  }
  return this.save();
};

export default mongoose.model<IReport>('Report', reportSchema);