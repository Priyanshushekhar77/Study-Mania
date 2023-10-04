// const mongoose = require("mongoose");
// const Course = require("../models/Course");
// const Section = require("../models/Section");
// const SubSection = require("../models/SubSection");
// const CourseProgress = require("../models/CourseProgress");

// exports.updateCourseProgress = async(req,res) => {
//     const { courseId, subsectionId} = req.body;
//     const userId = req.user.id;
//     try{
        
//             const subsection = await SubSection.findById(subsectionId)
//             if(!subsection){
//                 return res.status(404).json({
//                     error:"Invalid"
//                 })
//             }
//             //FIND THE COURSE PROGRESS DOCUMENT FORTHE USER AND COURSES
//             let courseProgress = await CourseProgress.findOne({
//               courseId: courseId,
//               userId:userId,
//             })
//             if(!CourseProgress){
//                 return res.status(404).json({
//                     success: false,
//                     message: "course progress doesnot exist"
//                 })
//             }
//             else{
//                 //if course progress exist check it subsection is already compelted
//                 if(CourseProgress.completedVideos.includes(subsectionId)){
//                     return res.status(400).json({
//                         error:"subsection already completted"
//                     })
//                 }
//                 //push the subsection into the completed vidoe array
//                 CourseProgress.completedVideos.push(subsectionId)
//             }
//             await CourseProgress.bulkSave()
//             return res.status(404).json({
               
//                 message: "course progres updated"
//             })
    
        
//     }
//     catch(error){
//         console.error(error)
//         return res.status(500).json({
//             error:"internal server error"
//         })
//     }
// }