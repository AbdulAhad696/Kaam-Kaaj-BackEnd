import express  from "express";
import ServiceProviders from "../modules/ServiceProviders.js";

const router = express.Router();

router.get("/:service" ,async function(req,res){
    console.log("Request is received for getting data according to particular service "+req.params.service);
    let data;
    data=await ServiceProviders.find({service:req.params.service})
    if(data)
    {
        return res.send(data)
    }
    else{
        console.log("error in retrieving service providers...............")
        return []
    }
} );

export default router;