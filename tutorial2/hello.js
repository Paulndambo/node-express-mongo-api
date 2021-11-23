const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const PORT = 5000


app.use(bodyParser.json())

const usersRouter = require("./routes/users")

app.get("/", (req, res) => {
    console.log("HELLO")
    res.send("Hello")
})

app.use("/users", usersRouter)

app.listen(PORT, () => {
    console.log(`Server Running On: http://localhost:${PORT}`)
})