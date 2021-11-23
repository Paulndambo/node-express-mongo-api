const http = require("http");
const app = require("./app")

const PORT = process.env.PORT || 4000

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server Running Port: ${PORT}`)
});