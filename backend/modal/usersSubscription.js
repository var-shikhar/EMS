import mongoose from 'mongoose';

const userSubscriptionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionType',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Expired'],
      default: 'Active',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
}, { timestamps: true });
  
const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);
export default UserSubscription