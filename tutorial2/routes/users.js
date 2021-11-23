const express = require("express");
const router = express.Router()
    //const { v4 } = require("uuid")
const { v4 } = require('uuid');

let users = [{
        name: "Paul Ndambo",
        age: 23,
        gender: "Male"
    },
    {
        name: "Jane Doe",
        age: 24,
        gender: "Female"
    }
]


router.get("/", (req, res) => {
    res.send(users)
    console.log(users)
})

router.post("/", (req, res) => {
    const user = req.body
    const userId = v4();
    const userWithId = {...user, id: userId }
    users.push(userWithId)
    res.send(userWithId)
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    const foundUser = users.find((user) => user.id == id)
    res.json(foundUser)
})

router.delete("/:id", (req, res) => {
    let id = req.params.id
    users = users.filter((user) => user.id !== id)
    res.send(`User with id: ${id} deleted`)
});

router.patch("/:id", (req, res) => {
    let id = req.params.id
    const { name, age, gender } = req.body
    const user = users.find((user) => user.id == id)

    if (name) {
        user.name = name
    }
    if (gender) {
        user.gender = gender
    }
    if (age) {
        user.age = age
    }

    res.send(`User with Id: ${id} updated`)

})

module.exports = router