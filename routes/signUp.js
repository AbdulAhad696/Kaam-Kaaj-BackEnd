import express from "express";
import User from "../modules/User.js"

const router = express.Router()

router.post("/" ,async (req,res)=>{
    let user=new User(req.body);
    let result=await user.save();
    res.send(result);
})

router.get("/",async(req,res)=>{
    User.find({},function(err,result){
        res.send(result)
    })
})

export default router;