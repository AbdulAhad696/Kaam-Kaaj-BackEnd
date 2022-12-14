import express from "express";
import User from "../modals/User.js"
import Cryptr from "cryptr"



const router = express.Router()


router.get("/:email/:password", async (req, res) => {
    const cryptr = new Cryptr('ReallySecretKey');
    const email = req.params.email;
    const password = req.params.password;
    console.log("ENTERED", password)
    const user = await User.find({ email: email })
    console.log(user, "USer")
    console.log(cryptr.decrypt(user[0]?.password))
    if (password == cryptr.decrypt(user[0]?.password)) {
        res.status(200).send(user);
    }
    else {
        res.send({})
    }

})

export default router;