const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/BDAS")

var db = mongoose.connection

db.on("error",(error)=>{
    console.log(error);
    
})

db.on("open",()=>{
    console.log("Database connected");
    
})

module.exports=db

