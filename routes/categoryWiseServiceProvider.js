import express  from "express";
import ServiceProviders from "../modals/ServiceProviders.js";


const router = express.Router();

router.get("/:service" ,async function(req,res){
    console.log("Request is received for getting data according to particular service "+req.params.service);
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
                $and:[{"serviceDetails.tittle" : req.params.service}]
            }
        }, 
        
    ]).exec(function(err , services){
        if(err){
            console.log("Error in retreiving serices..........")
        }
        else{
            console.log("response sent");
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