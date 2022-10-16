import  express  from "express";
import reservation from "../modules/reservation.js";

const router = express.Router();

router.post("/",async(req,res)=>{
    let reserve = new reservation(req.body);
    let sent;
    await reserve.save().then((err,res)=>{
        if(err.body){
            console.log("error");
            sent= false;
        }
        else{
            console.log("successful");
            sent=true;
        }
    });
    res.send(sent);
    
})

export default router;