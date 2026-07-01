const mongoose=require('mongoose')

async function connecDB()
{
    await mongoose.connect(process.env.Mongo_Db)
    console.log("DB is successfully connected")
}

module.exports=connecDB 