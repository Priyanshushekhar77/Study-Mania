const Tag= require("..models/tags");

//create tag ka handler function 

exports.createTag = async(re,res) => {
    try{
       const {name,description} = req.body;
       if(!name || !description){
        return res.status(400).json({
            sucess:false,
            message:'All fields are required',
        })
       }
       //create entry in database 
       const tagDetails = await Tag.create({
           name:name,
           description:description,
       });
       console.log(tagDetails);
       //return respone
       return res.status(200).json({
        sucess:true,
        message:'Tag created successfully'
       })
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:'tag not created'
        })
    }
};

//get all tags handler function 

exports.showAllTags = async(req,res) => {
    try{
        const allTags = await Tag.find({},{name:true,description:true}); //to get all tags
        return res.status(200).json({
            sucess:true,
            message:'All Tags  successfully'
           })
    }
    catch(error){
        return res.status(500).json({
            sucess:false,
            message:'tags not get'
        })
    }
};