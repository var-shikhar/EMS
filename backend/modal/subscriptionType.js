import mongoose from 'mongoose';

const subscriptionTypeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
}, { timestamps: true });
  
const SubscriptionType = mongoose.model('SubscriptionType', subscriptionTypeSchema);
export default SubscriptionType;