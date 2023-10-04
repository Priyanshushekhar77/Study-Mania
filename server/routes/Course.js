


const express=require("express");
const router=express.Router();
//importing the controllers

//course controller
const{createCourse,getAllCourses,getCourseDetails} = require("../controllers/Course")

//categories controller
const{showAllCategories,createCategory,categoryPageDetails} = require("../controllers/Category")

//sections controllers
const{createSection,updateSection,deleteSection} = require("../controllers/Section")

//sub-section controllers
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")
//Rating controllers
const{createRating,getAverageRating,getAllRating} = require("../controllers/RatingAndReview")

//importing middlewares
const{auth,isInstructor,isStudent, isAdmin} = require("../middlewares/auth")

//course routes


// course can only be created by instructor
router.post("/createCourse",auth,isInstructor,createCourse)
//add a section to the course
router.post("/addSection",auth,isInstructor,createSection)
//update a section
router.post("/updateSection",auth,isInstructor,updateSection)
//delete a section
router.post("/deleteSection",auth,isInstructor,deleteSection)

//add a subsection to the course
router.post("/addSubSection",auth,isInstructor,createSubSection)
//update a subsection
router.post("/updateSubSection",auth,isInstructor,updateSubSection)
//delete a subsection
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection)

//get all registered course
router.get("/getAllCourses",getAllCourses)
//get details for specified course
router.post("/getCourseDetails",getCourseDetails)


//category routes ->oly by admin
router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories",showAllCategories)
router.post("/getcategoryPageDetails",categoryPageDetails)

//rating and review routes
router.post("/createRating",auth,isStudent,createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getReviews",getAllRating)

module.exports=router;

