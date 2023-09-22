const mongoose=require("mongoose");
const invoiceSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    courseName: {
        type:String,
        required:true,
    },
    address: {
        type:String,
        required:true,
    },
    pincode: {
        type:String,
        required:true,
    },
    courseId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course",
    },
});
module.exports = mongoose.model("invoice",invoiceSchema);