const mongoose = require('mongoose');
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

const Profile = mongoose.model(dbModel.Profile, profileSchema);

module.exports = Profile;
