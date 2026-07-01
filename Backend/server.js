
require('dotenv').config()
const App = require("./src/App/App");
const DB=require('./src/Database/Db')
const {connectRedis}=require("./src/Database/Redis")

const PORT = process.env.PORT || 4000

async function start() {
    try {
        await DB();
        await connectRedis();
        App.listen(PORT, () => console.log("Server Running on port " + PORT))
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start() 