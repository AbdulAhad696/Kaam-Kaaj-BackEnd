import express from "express";
import User from "../modals/User.js"
import Cryptr from "cryptr"
import { lastValueFrom } from "rxjs";


const router = express.Router()


router.get("/:email/:password" , async(req , res)=>{
    const cryptr = new Cryptr('ReallySecretKey');
    const email = req.params.email;
    const password =req.params.password;
    // console.log(password)
    console.log("ENTERED")
    // User.find({email:email ,password:password} , (err , data)=>{
    //     if (err){res.status(500).send(err)}
    //     else{
    //         res.status(200).send(data);
    //     }
    // }
    // )

    const user=await User.find({email:email})
    if(password==cryptr.decrypt(user[0]?.password)){
        res.status(200).send(user);
    }
    else{
        res.send({})
    }

})

export default router;