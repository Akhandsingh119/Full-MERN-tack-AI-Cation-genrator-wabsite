
require('dotenv').config()
const App = require("./src/App/App");
const DB=require('./src/Database/Db')
const {connectRedis}=require("./src/Database/Redis")
connectRedis();

const PORT = process.env.PORT || 4000

DB()


App.listen(PORT, () => console.log("Server Running on port " + PORT)) 