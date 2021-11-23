const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.get("/", (req, res, next) => {
    User.find()
        .select('_id email password')
        .exec()
        .then(users => {
            res.status(200).json({
                count: users.length,
                users: users.map(user => {
                    return {
                        _id: user._id,
                        email: user.email,
                        password: user.password,
                        request: {
                            type: "GET",
                            description: "Get User Details",
                            url: "http://localhost:4000/users/" + user._id
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

router.post("/register", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email Already Taken"
                })
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(200).json({
                                    message: "User Created"
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    message: "User Creation Failed",
                                    error: err
                                })
                            })
                    }
                });
            }
        })

});


router.post("/login", (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Authentication Failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authentication Failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "secret", {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Successfully Authenticated",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Authentication Failed"
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId
    User.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted Successfully"
            })
        })
        .catch(err => {
            res.json(500).json({
                message: "User Not Deleted"
            })
        })
})

module.exports = router