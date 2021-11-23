const express = require("express");
const app = express()
const morgan = require("morgan")
const mongoose = require("mongoose");
const url = 'mongodb://localhost/Students'

mongoose.connect(url, {
    useNewUrlParser: true
});
const conn = mongoose.connection;

conn.on('open', function() {
    console.log("Database Connected...");
})

app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hello World")
    console.log("Hello World")
})

const studentRouter = require("./tests")

app.use(morgan('dev'))

app.use("/students", studentRouter)

app.listen(4000, () => {
    console.log("Server Running On Port: 4000")
})