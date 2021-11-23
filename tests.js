const express = require("express")
const router = express.Router()

const Student = require("./student")

router.get("/", async(req, res) => {
    res.send("Hello Students")
    console.log("Hello Students")
})



module.exports = router