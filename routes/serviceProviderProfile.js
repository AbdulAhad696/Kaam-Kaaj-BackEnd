import express  from "express";
import ServiceProviders from "../modals/ServiceProviders.js";


const router = express.Router();

router.get("/:email" ,async function(req,res){
    console.log("Request is received for getting the profile of "+req.params.email);
    let data;
    ServiceProviders.aggregate([
        { $lookup:
            {
                from:'users',
                localField:'serviceProvider',
                foreignField:'_id',
                as:'serviceProviderDetails'
            }

        },
        {
            $lookup:{
                from: "services", 
                localField: "serviceCategory", 
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        {
            $match:{
                $and:[{"serviceProviderDetails.email" : req.params.email}]
            }
        }, 
        
    ]).exec(function(err , services){
        if(err){
            console.log("Error in retreiving serices..........")
        }
        else{
            res.json(services)
        }
    })
    
    // data=await ServiceProviders.find({service:req.params.service})
    // if(data)
    // {
    //     return res.send(data)
    // }
    // else{
    //     console.log("error in retrieving service providers...............")
    //     return []
    // }
// } ); 
})

export default router;