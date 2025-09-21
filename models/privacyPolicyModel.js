const mongoose = require('mongoose');

const { Schema } = mongoose;

const PrivacyPolicySchema = new Schema({
  content: {
    type: Schema.Types.Mixed, // Mixed type for flexible structure
    required: true,
  },
}, { timestamps: true });

const PrivacyPolicy = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);

module.exports = PrivacyPolicy;
