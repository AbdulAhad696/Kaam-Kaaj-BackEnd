import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import Jobs from "../modals/Jobs.js";


// -----------------------array of images------------------
var imagesArray=[];
var temporarilyHoldImages=[];

// ----------------------------storing images into the uploads folder---------------------------

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req , file , callback) => {
        callback(null ,  'uploads/')
    },
    filename: (req , file , callback) =>{
        callback(null , `${file.originalname}`)
    }
})
var upload = multer({storage: storage})
router.post('/multipleFiles' , upload.array('files') , (req , res , next) =>{
    const files = req.files;
    temporarilyHoldImages = req.files;
    console.log("kashir")
    console.log(files);

// ------------------------storing paths of each image in array------------------------

    for(let obj of temporarilyHoldImages){
        imagesArray.push(obj.destination+obj.originalname)
    }
    
    if(!files){
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error)
    }
    res.send({status: 'ok'});
}  )

// -------------------------storing job to the Mongo compass----------------------

router.post("/", async (req,res)=>{
    let job = new Jobs({
        title: req.body.title,
        jobPostDate: req.body.jobPostDate,
        description: req.body.description,
        estAmount: req.body.estAmount,
        gigPics: imagesArray,
        status: req.body.status,
        jobAddress: req.body.jobAddress,
        estCompletionTime: req.body.estCompletionTime,
        category: req.body.category,
        jobAssignedBy: req.body.jobAssignedBy
    })
    imagesArray=[]
    let isJobAdded;
    isJobAdded = await job.save().then((err,res) =>{
        if(err.body){
            console.log("Failed to add job");
            return false;
        }
        else{
            console.log("Job added successfully");
            return true;
        }
    } )
    res.send(isJobAdded);
})

export default router;