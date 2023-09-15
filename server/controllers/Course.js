const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async(req,res) => {
    try{
        //fetch all data
        const {courseName, courseDescription, whatYouWillBeLearn, price, tag} = req.body;
        //get thumbnail 
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName ||  !courseDescription || !whatYouWillBeLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success:false,
                message:'All fields are required to field',
            });
        }
         //check for instructor 
         //db call to get account type if req.user.accounttype is not in payload 
         const userId = req.user.id; //payload me store hai ye id
         const instructorDetails = await User.findById(userId);
         console.log("instructor Details :" ,instructorDetails) ;
         //TODO:verify that userid and instructor id is same or different;

         if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'instructor Details Not Found',
            });
         }
         // tag validation here,tag is object id
         const tagDetails = await Tag.findById(tag);
         if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:'tag Details Not Found',
            });
         }

         //upload image to cloudinary 
         const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

         //create an entry in db for new course 
         const newCourse = await Course.create({
            courseName, 
            courseDescription, 
            // instructor ek object id hai isliye instructor detail ka object id hamne upper fetch kiye hao
            instructor: instructorDetails._id,
            whatYouWillBeLearn, 
            price, 
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
         })

         //adding new course entry also in user schema database of instructor by findidandupdate
        // method -> main wo user ke course ke array ke under newcourse ki id insert karna chahta hu 
          await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id,
            },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true}  //get updated response
          );

          //update the tag schema by entry tag in db
          //TODO:HW





          return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Course Creation Failed',
            error: error.message,
        });
    }
};


//get all courses handler function 

exports.showAllCourses = async(req,res) => {
    try{
        //todo : change the below methods
        const allCourses = await Course.find({}, {courseName:true,
                                                 price:true,
                                                 thumbnail:true,
                                                 instructor:true,
                                                 retingAndReviews:true,
                                                 studentsEnrolled:true,})
                                                 .populate("instructor")
                                                 .exec();
        return res.status(200).json({
            success:true,
            message:"data for all courses fetched sucessfully",
            data:allCourses
        })


    

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Cannot fetch courses',
            error: error.message,
        });
    }
}
