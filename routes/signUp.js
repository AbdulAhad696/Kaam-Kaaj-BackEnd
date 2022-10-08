import express from "express";
import User from "../modules/User.js"

const router = express.Router()

router.post("/" ,async (req,res)=>{
    let user=new User(req.body);
    let isregister
    isregister= await user.save().then((err,res)=>{
        if(err.body)
        {
            console.log("Registration failed")
            return false
        }
        else{
            console.log("Registered successfully")
            return true
        }

    })
    res.send(isregister)

})
router.get("/:email",async(req,res)=>{
    console.log("Request is received for getting data with email "+req.params.email)
    let isvalid
    isvalid=await User.findOne({email:req.params.email})
    if(isvalid)
    {
        res.send(true)
        console.log("Result:true")
    }
    else{
        res.send(false)
        console.log("Result:false")
    }
})


export default router;