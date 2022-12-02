import express from "express";
import User from "../modals/User.js"
import Cryptr from "cryptr"
import { lastValueFrom } from "rxjs";


const router = express.Router()


router.get("/:id/:password" , async(req , res)=>{
    const cryptr = new Cryptr('ReallySecretKey');
    const id = req.params.id;
    const password =cryptr.encrypt(req.params.password);
    console.log("Request is received for changing password",req.params.id)
    // User.find({email:email ,password:password} , (err , data)=>{
    //     if (err){res.status(500).send(err)}
    //     else{
    //         res.status(200).send(data);
    //     }
    // }
    // )
    try{
        await User.findOneAndUpdate({_id:id},{password:password})
        res.send(true)
    }
    catch(err){
        res.send(false)

    }

})

export default router;