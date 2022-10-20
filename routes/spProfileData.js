import  express  from "express";
import ServiceProviders from "../modals/ServiceProviders.js";
const router = express.Router();

router.get("/:spid" ,(res,req)=>{
    console.log("SPDATA")
    // req.params.spid
    console.log(req.params.spid)
    ServiceProviders.find({serviceProvider:req.params.spid}, (data , err)=>{
        if (data){
            return data
        }
        else{
            console.log("Couldn't find SP data")
        }
    })
} )

export default router;