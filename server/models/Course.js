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
    prices:{
        type:Number,
    },
    thumbNail:{
        type:String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },
    studentEnrolled: [{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }
]

});
module.exports = mongoose.model("Course",CourseSchema);