const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
}, {
    timestamps: true
});

mongoose.model('Order', orderSchema);