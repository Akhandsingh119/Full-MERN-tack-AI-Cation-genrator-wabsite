
require('dotenv').config()
const App = require("./src/App/App");
const DB=require('./src/Database/Db')
const {connectRedis}=require("./src/Database/Redis")
connectRedis();

const PORT = process.env.PORT || 4000

DB()


app.listen(PORT, () => console.log("Server Running on port " + PORT)) 