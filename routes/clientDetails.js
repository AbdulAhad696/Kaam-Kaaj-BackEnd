import express from "express";
// import User from "../modals/User.js"
import ServiceProviders from "../modals/ServiceProviders.js";
import Jobs from "../modals/Jobs.js";
import ClientProfile from "../modals/ClientProfile.js";


const router = express.Router()
var totalJobs
var totalDoneJobs
var totalDoneJobsInDueDate
var totalRejectedJobs
router.get("/:email" , async(req , res)=>{
    console.log("Request is received for getting the details of "+req.params.email)

    ClientProfile.aggregate([
        { $lookup:
            {
                from:'users',
                localField:'client',
                foreignField:'_id',
                as:'clientDetails'
            }

        },
        {
            $match:{
                $and:[{"clientDetails.email" : req.params.email}]
            }
        }, 
        
    ]).exec(async (err , data)=>{
        if(err){
            console.log("Error in retreiving serices..........")
        }
        else{
            // console.log(data[0].serviceProviderDetails[0]._id)
            const querryForTotalJobs=Jobs.find({jobAssignedBy:data[0]?.clientDetails[0]?._id})
            const querryForDoneJobs=Jobs.find({jobAssignedBy:data[0]?.clientDetails[0]?._id,status:"done"})
            const querryForDoneJobsOnTime=Jobs.find( {jobAssignedBy:data[0]?.clientDetails[0]?._id,jobDoneStatus:"early"} );
            // const querryForRejectedJobs=Jobs.find({jobAssignedTo:data[0].serviceProviderDetails[0]._id,status:"reject"})
            
            totalJobs= await querryForTotalJobs.count()
            totalDoneJobs= await querryForDoneJobs.count()
            totalDoneJobsInDueDate=await querryForDoneJobsOnTime.count()
            // totalRejectedJobs=await querryForRejectedJobs.count()
            if(data.length>0){
            data[0].orderCompletion=((totalDoneJobs/totalJobs)*100).toFixed(2)
            data[0].deliverOnTime=((totalDoneJobsInDueDate/totalDoneJobs)*100).toFixed(2)
            data[0].jobsCompleted=totalDoneJobs
            }
            // data[0].responseRate=(100-(totalRejectedJobs/totalJobs)*100)
            
            res.json(data)
        }
    })
    

})

export default router;