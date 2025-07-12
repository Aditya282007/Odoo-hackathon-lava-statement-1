import mongoose, { Schema } from 'mongoose';
import { IRequest } from '../types';

const requestSchema = new Schema<IRequest>({
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Prevent duplicate requests
requestSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model<IRequest>('Request', requestSchema);