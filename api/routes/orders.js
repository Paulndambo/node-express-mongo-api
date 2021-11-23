const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const checkAuth = require("../middleware/check-auth")

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", checkAuth, (req, res, next) => {
    Order.find()
        .select('product quantity')
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            description: "Get All Orders",
                            url: "http://localhost:4000/orders/" + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post("/", (req, res) => {
        Product.findById(req.body.productId)
            .then(product => {
                if (!product) {
                    res.status(404).json({
                        message: "No Product Found"
                    })
                };
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    quantity: req.body.quantity
                });
                return order.save()
                    .then(result => {
                        res.status(201).json({
                            message: "Order Created",
                            request: {
                                type: "GET",
                                description: "Get Order Details",
                                url: "http://localhost:4000/orders/" + result._id
                            }
                        });
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Product Not Found",
                    error: err
                })
            })
    })
    //

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    description: "Get All Orders",
                    url: "http://localhost:4000/orders/"
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Order With Provided ID No Found",
                error: err
            })
        })
})

router.delete("/:orderId", (req, res, next) => {
    const id = req.params.orderId
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: "No Order With Such ID"
                })
            }
            res.status(200).json({
                message: "Order Deleted Successfully",
                request: [{
                        type: "GET",
                        description: "Get All Orders",
                        url: "http://localhost:4000/orders/"
                    },
                    {
                        type: "POST",
                        description: "Create A New Order",
                        url: "http://localhost:4000/orders/",
                        body: { product: "String", quantity: "Number" }
                    }

                ]
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
});

module.exports = router