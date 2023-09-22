const Category= require("..models/Category");

//create tag ka handler function 
function getRandomInt(max){
    return Math.floor(Math.random()*max)
}

exports.createCategory = async(re,res) => {
    try{
       const {name,description} = req.body;
       if(!name || !description){
        return res.status(400).json({
            sucess:false,
            message:'All fields are required',
        })
       }
       //create entry in database 
       const CategoryDetails = await Category.create({
           name:name,
           description:description,
       });
       console.log(CategoryDetails);
       //return respone
       return res.status(200).json({
        sucess:true,
        message:'Category created successfully'
       })
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:'tag not created'
        })
    }
};

//get all Category handler function 

exports.showAllCategory = async(req,res) => {
    try{
        const allCategory = await Tag.find({},{name:true,description:true}); //to get all category
        return res.status(200).json({
            sucess:true,
            message:'All Category'
           })
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:'Category not get'
        })
    }
};

// Particular Category
exports.categoryPageDetails = async(req,res) => {
    try{
        const {categoryId} = req.body;
        //get courses for thr specified category
        const selectedCategory = await Category.findById(categoryId).populate({
            path: "Course",
            match: { status:"Published"},
            populate: "ratingAndReviews"
        })
        .exec();
        console.log("courses for selected category",selectedCategory);
        if(!selectedCategory){
            console.log("selectedCategory not found");
            return res.status(404).json({
                success:false,
                message :"selectedCategory not found"
            })
        }

        //get courses for other categories
        const differentCategories = await Category.find({
            _id: {$ne: categoryId},
            })
            let diffcatg=await Category.findOne(
                differentCategories[getRandomInt(differentCategories.length)]
                ._id
            )
            .populate({
                path: "Course",
                match: { status:"Published"},

            })
            .exec();
            const allCourses = allCategories.flatMap((Category) => Category.course)
            const mostSellCourse =  allCourses.sort((a,b) => b.sold - a.sold)
                                               .slice(0,10)
             
                                               //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                    mostSellCourse,
                },
            });
    }

    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}