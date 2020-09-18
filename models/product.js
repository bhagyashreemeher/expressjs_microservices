const mongoose = require('mongoose');
const dbModel = require('./index');

const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String, required: [true, 'Please enter a valid product name'],
  },
  description: { type: String, required: [false, 'Please enter a valid description'] },
  price: { type: Number, required: [true, 'Please enter a valid price'] },
  discount: {
    type: Number, required: [true, 'Please enter a valid discount'],
  },

}, { timestamps: true });

const Product = mongoose.model(dbModel.Product, productSchema);

module.exports = Product;
