const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth")


router.get("/", (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {

            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + doc._id
                        }
                    }
                })
            }

            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

//product with image
router.post("/", checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    });
    product.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created Product Successfully",
                product: {
                    name: result.name,
                    price: result.price,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:4000/products/" + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

//product with no image
/*
router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    });
    product.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created Product Successfully",
                product: {
                    name: result.name,
                    price: result.price,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:4000/products/" + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})
*/

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price quantity _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        description: "Get All Products",
                        url: "http://localhost:4000/products/"
                    }
                })
            } else {
                res.status(404).json({ message: "No product with this id was found!" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product Updated",
                request: {
                    type: "GET",
                    url: "http://localhost:4000/products/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product Deleted Successfully",
                request: [{
                        type: "GET",
                        description: "Get All Products",
                        url: "http://localhost:4000/products/"
                    },
                    {
                        type: "POST",
                        description: "Create A New Product",
                        url: "http://localhost:4000/products/",
                        body: { name: "String", price: "Number", quantity: "Number" }
                    }

                ]
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
})


module.exports = router