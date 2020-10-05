const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dbModel = require('./index');

const { Schema } = mongoose;
const profileSchema = new Schema({
  name: {
    type: String, required: [true, 'Please enter a valid name'],
  },
  country: { type: String, required: [true, 'Please enter a valid country name'] },
  age: { type: Number, required: true },
  sex: {
    type: String,
    required: [true, 'Please enter a valid sex'],
    enum: {
      values: ['male', 'female'],
      message: 'Please enter \'male\female\'',
    },
  },
  email: {
    type: String,
    required: [true, 'Please enter a valid email'],
    index: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: [true, 'please enter a valid password'],
  },
}, { timestamps: true });

profileSchema.pre('save', async function preSave(next) {
  try {
    const profile = this;
    const hash = await bcrypt.hash(this.password, 10);
    profile.password = hash;
    next();
  } catch (error) {
    next({
      data: null,
      errors: 'Profile validation failed: password: Path `password` is required.',
      code: 400,
    });
  }
});

const Profile = mongoose.model(dbModel.Profile, profileSchema);

module.exports = Profile;
