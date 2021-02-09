const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    //you should assign the name of the ref in which the model you have the relation with
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema); 