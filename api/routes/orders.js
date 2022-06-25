const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Test GET request to /orders'
    })

});

router.post('/', (req, res, next) => {
    const order = {
        product_id: req.body.productId,
        quantity: req.body.quantity,
    }
    res.status(201).json({
        message: 'Test POST request to /orders',
        order: order
    })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Test GET request to /orders'
    })

});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Update order',
        id: id
    })

});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Delete order',
        id: id
    })

});

module.exports = router;
