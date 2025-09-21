const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    required: true,
    enum: ['Admin', 'Manager', 'Developer', 'Designer', 'HR'],
    trim: true 
  },
  employeeType: { 
    type: String, 
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    trim: true 
  },
  dateOfJoining: { type: Date, required: true, default: Date.now },
  profilePicture: { type: String, default: 'default.jpg' },
  description: { type: String, trim: true }
}, { timestamps: true });

// Auto-generate fullName
EmployeeSchema.pre('save', function(next) {
  this.fullName = `${this.firstName}${this.middleName ? ' ' + this.middleName : ''} ${this.lastName}`;
  next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);