import express from "express";
import User from "../modules/User.js"

const router = express.Router()


router.get("/:email/:password" , (req , res)=>{
    const cnicPhoneUsername = req.params.email;
    const password = req.params.password;
    console.log("ENTERED")
    User.find({email:cnicPhoneUsername ,password:password} , (err , data)=>{
        if (err){res.status(500).send(err)}
        else{
            res.status(200).send(data);
        }
    }
    )

})

export default router;