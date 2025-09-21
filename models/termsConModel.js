const mongoose = require('mongoose');

const { Schema } = mongoose;

const TermsConditionSchema = new Schema({
  content: {
    type: Schema.Types.Mixed, // Mixed type for flexible structure
    required: true,
  },
}, { timestamps: true });

const TermsCondition = mongoose.model('TermsCondition', TermsConditionSchema);

module.exports = TermsCondition;
