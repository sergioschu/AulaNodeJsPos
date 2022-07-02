const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replaceAll(':', '') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if ((file.mimetype === 'image/jpeg') || (file.mimetype === 'image/png')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const ProductModel = mongoose.model('Product');

router.get('/', async (req, res, next) => {
    try {
        const products = await ProductModel.find().select('name price _id');
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.post('/', upload.single('productImage'), async (req, res, next) => {
    console.log(req.file);
    try {
        const product = new ProductModel({
            name: req.body.name,
            price: req.body.price,
            image: req.file.path
        });

        await product.save();

        res.status(201).json({
            message: "Produto criado com sucesso!",
            createdProduct: {
                name: product.name,
                price: product.price,
                image: product.image,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + product.id
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/:productId', async (req, res, next) => {

    const id = req.params.productId;
    try {

        const product = await ProductModel.findOne({ _id: id });

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json("Produto não existe!");
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.patch('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    const updatedCampos = {};
    Object.entries(req.body).map(item => {
        updatedCampos[item[0]] = item[1];
    })
    try {
        let status = await ProductModel.updateOne({ _id: id }, { $set: updatedCampos });
        res.status(200).json({
            message: 'Update Products',
            status: status
        })
    } catch (error) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.delete('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    try {
        let status = await ProductModel.deleteOne({ _id: id });

        res.status(200).json({
            message: 'Produto deletado Products',
            status: status
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;