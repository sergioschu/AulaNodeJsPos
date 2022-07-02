const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const OrderModel = mongoose.model('Order');
const ProductModel = mongoose.model('Product');

router.get('/', async (req, res, next) => {
    try {
        const orders = await OrderModel.find({}).populate('product', 'name')
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + order._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.post('/', async (req, res, next) => {

    try {
        const product = await ProductModel.findOne({ _id: req.body.productId });
        if (!product) {
            res.status(404).json({ message: "Produto não existe" });
            return;
        }

        let order = new OrderModel({
            product: req.body.productId,
            quantity: req.body.quantity
        })
        order = await order.save();

        res.status(201).json({
            message: 'Ordem criada com sucesso!',
            createdOrder: {
                product: order.product,
                quantity: order.quantity,
                _id: order._id
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + order._id
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;
    try {
        console.log(id);
        const order = await OrderModel.findOne({ _id: id }).populate('product')
        console.log(order);
        if (order) {
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + order._id
                }
            })
        } else {
            res.status(404).json("Ordem não existe!");
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    try {
        res.status(200).json({
            message: 'Update order',
            id: id
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.delete('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;
    try {
        const status = await OrderModel.deleteOne({ _id: id });

        res.status(200).json({
            message: 'Delete order',
            status: status
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
