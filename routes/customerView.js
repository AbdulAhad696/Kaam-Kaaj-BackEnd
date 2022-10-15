import express from "express";
import Service from "../modules/Services.js";

const router = express.Router();

router.get("/",function(req,res){
    console.log("Getting all services..........");
    Service.find({})
    .exec(function(err , services){
        if(err){
            console.log("Error in retreiving serices..........")
        }
        else{
            res.json(services);
        }
    });
});

export default  router;


