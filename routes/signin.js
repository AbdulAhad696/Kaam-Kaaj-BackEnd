import express from "express";
import User from "../modals/User.js"
import Cryptr from "cryptr"
import { lastValueFrom } from "rxjs";


const router = express.Router()


router.get("/:email/:password" , async(req , res)=>{
    const cryptr = new Cryptr('ReallySecretKey');
    const email = req.params.email;
    const password =req.params.password;
    console.log("ENTERED")
    const user=await User.find({email:email})
    if (email!="kaamkaaj35@gmail.com" && user[0]?.password!=null){
        if(password==cryptr.decrypt(user[0]?.password)){
            res.status(200).send(user);
        }
        else{
            res.send({})
        }
    }
    else{
        if(password==(user[0]?.password)){
            res.status(200).send(user);
        }
        else{
            res.send({})
        }
    }
    

})

export default router;