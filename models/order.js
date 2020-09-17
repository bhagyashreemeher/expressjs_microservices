const mongoose = require('mongoose');
const dbModel = require('./index');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId: {
        type: mongoose.Types.ObjectId, required: [true, "Please enter a valid id"], ref: dbModel.Product
    },
    price: { type: Number, required: [true, "Please enter a valid price "] },
    profileId: { type: mongoose.Types.ObjectId, required: [true, "Please enter a valid profileid"], ref: dbModel.Profile },
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    validateOrders.call(this, next);
});

const validateOrders = function (next) {

    const Profile = mongoose.model(dbModel.Profile);
    Profile.findById(this.profileId, (err, found) => {
        if (found) {
            const Product = mongoose.model(dbModel.Product);
            Product.findById(this.productId, (err, found) => {
                if (found) return next();
                else return next({ message: "productId does not exist" });
            });
        }
        else return next({ message: "profileId does not exist" });
    });
}

const Order = mongoose.model(dbModel.Order, orderSchema);

module.exports = Order;
