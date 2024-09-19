const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    cash: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date: {
        type: Date,
        required: true
    }
},{timestamps:true});

const Sales = mongoose.model('Sales',salesSchema);

module.exports = Sales;