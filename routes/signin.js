import express from "express";
import User from "../modules/User.js"

const router = express.Router()



router.get("/signin" , (req , res)=>{
    const cnicPhoneUsername = req.body.cnicPhoneUsername;
    const password = req.body.password;
    console.log("ENTERED")
    User.find({email:cnicPhoneUsername ,password:password} , (err , data)=>{
        if (err){res.status(500).send(err)}
        else{
            console.log("ENTERED")
            res.status(200).send(data);
        }
    }
    )

})

export default router;