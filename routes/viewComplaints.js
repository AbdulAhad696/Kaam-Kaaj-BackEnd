import express from "express";
import reservations from "../modals/reservation.js";

// ------------------getting all the complaints------------------
const router = express.Router();

router.get("/",function(req,res){
    console.log("Getting all complaints..........");
    reservations.find({})
    .exec(function(err , allComplaints){
        if(err){
            console.log("Error in retreiving complaints..........")
        }
        else{
            res.json(allComplaints);
        }
    });
});

export default  router;