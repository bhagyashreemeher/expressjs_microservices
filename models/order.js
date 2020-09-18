const mongoose = require('mongoose');
const dbModel = require('./index');

const { Schema } = mongoose;

const orderSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId, required: [true, 'Please enter a valid id'], ref: dbModel.Product,
  },
  price: { type: Number, required: [true, 'Please enter a valid price '] },
  profileId: { type: Schema.Types.ObjectId, required: [true, 'Please enter a valid profileid'], ref: dbModel.Profile },
}, { timestamps: true });

function validateOrders(next) {
  const Profile = mongoose.model(dbModel.Profile);
  Profile.findById(this.profileId, (err, found) => {
    if (!found) {
      return next({ message: 'profileId does not exist' });
    }
    const Product = mongoose.model(dbModel.Product);
    return Product.findById(this.productId, (error, doc) => {
      if (doc) return next();
      return next({ message: 'productId does not exist' });
    });
  });
}

orderSchema.pre('save', function preSave(next) {
  validateOrders.call(this, next);
});

const Order = mongoose.model(dbModel.Order, orderSchema);

module.exports = Order;
