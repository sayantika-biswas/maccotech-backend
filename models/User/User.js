const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  acceptTerms: { type: Boolean, default: false },
  profilePicture: { type: String },
  role: {
    type: String,
    enum: ['user', 'hr', 'admin'],
    default: 'admin'
  },
  passwordChangedAt: Date,
}, { timestamps: true });

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to ensure token is created after this
  next();
});

module.exports = mongoose.model('MaccoUser', userSchema);
