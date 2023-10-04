const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        trim:true,
    },
    lastName: {
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type:String,
        required:true,
        trim:true,
    },
    contactNumber: {
        type:String,
        
    },
    password: {
       type:String,
       required:true,
    },
    // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
    accountType: {
       type:String,
       enum:["Admin","Student","Instructor"],
       required:true,
    },
    active: {
        type:Boolean,
        default:true,
     },
     approved: {
        type:Boolean,
        default:true,
     },

    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    ],
    image: {
        type:String,
        // required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires: {
         type:Date,
    },
    courseProgress: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ],
    //add timestamp for when the document is created and modified at last time


},
{timestamps: true}
);
module.exports=mongoose.model("User",userSchema);