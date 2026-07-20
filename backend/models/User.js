const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, enum: ['seeker', 'employer', 'admin'], default: 'seeker' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [
      {
        title: String,
        company: String,
        from: String,
        to: String,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        from: String,
        to: String,
      },
    ],
    resumeUrl: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
