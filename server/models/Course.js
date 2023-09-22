const mongoose=require("mongoose");
const CourseSchema = new mongoose.Schema({
    courseName: {
        type:String,
        required:true,
        trim:true,
    },
    courseDescription: {
        type:String,
        required:true,
        trim:true,
    },
    instructor: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    whatYouWillBeLearn: {
        type:String,
    },
    courseContent: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }
    ],
    ratingAndReviews: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }
    ],
    price:{
        type:Number,
    },
    thumbNail:{
        type:String,
    },
    tag:{
        type:[String],
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentEnrolled: [{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
],
instructions:{
    type:[String],
},
status:{
    type:String,
    enum:["Draft" , "Published"],
},

createdAt:{
    type:Date,
    dafault:Date.now(),
}

});
module.exports = mongoose.model("Course",CourseSchema);