const mongoose=require('mongoose')


  function  connecDB()
{
    mongoose.connect(process.env.Mongo_Db).then(()=>{
        console.log("console is sucessfully connected to DB")
    }).catch((err)=>{
console.log(err)
    })
}

module.exports=connecDB 