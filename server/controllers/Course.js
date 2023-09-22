const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const {secToDuration} = require("../utils/secToDuration");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create course handler function
exports.createCourse = async(req,res) => {
    try{
        //fetch all data
        const {courseName, courseDescription, whatYouWillBeLearn, price, tag:_tag, category, status,instructions:_instructions} = req.body;
        //get thumbnail 
        const thumbnail = req.files.thumbnailImage;
        //conver the tag and instructions from stringified array to array
        const tag=JSON.parse(_tag)
        const instructions=JSON.parse(_instructions)
        console.log("tag",tag)
        console.log("instructions",instructions)
        //validation
        if(!courseName ||  !courseDescription || !whatYouWillBeLearn || !price || !tag || !thumbnail || !category || !instructions.length) {
            return res.status(400).json({
                success:false,
                message:'All fields are required to field',
            });
        }

        if(!status || status===undefined) {
            status = "Draft"
        }
         //check if the user is instructor 
         const userId = req.user.id; //payload me store hai ye id
         const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}
         console.log("instructor Details :" ,instructorDetails) ;

         // Check if the category given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

         //upload image to cloudinary 
         const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
          console.log(thumbnailImage)
         //create an entry in db for new course 
         const newCourse = await Course.create({
             
            // instructor ek object id hai isliye instructor detail ka object id hamne upper fetch kiye hao
            courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillBeLearn: whatYouWillBeLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
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
                },
            },
            {new:true}  //get updated response
          );

          //add the new courses to upd categories
         const updCategory =  await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
          
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


exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentEnrolled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndReviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}
