const mongoose=require("mongoose");
require("dotenv").config();

 //const { MONGODB_URL} = process.env;
exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((error) => {
        console.log("connection failed");
        console.log(error);
        process.exit(1);
    });
};