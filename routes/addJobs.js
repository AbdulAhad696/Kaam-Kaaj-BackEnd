import express from "express";
import Jobs from "../modals/Jobs.js";

const router = express.Router();

router.post("/", async (req,res)=>{
    let job = new Jobs(req.body);
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
