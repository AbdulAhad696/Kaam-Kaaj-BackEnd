import express from "express";
import User from "../modals/User.js"
import Cryptr from "cryptr"
import ServiceProviders from "../modals/ServiceProviders.js";



const router = express.Router()


router.get("/:email/:password", async (req, res) => {
    const cryptr = new Cryptr('ReallySecretKey');
    const email = req.params.email; const password = req.params.password;
    console.log("ENTERED")
    const userdata = await User.find({ email: email })
    if (email != "kaamkaaj35@gmail.com" && userdata[0]?.password != null) {
        if (userdata[0].role == "Worker") {
            User.aggregate([
                {
                    $lookup: {
                        from: "serviceproviders",
                        localField: "_id",
                        foreignField: "serviceProvider",
                        as: "spDetails"
                    }
                },
                {
                    $match: {
                        $and: [{ "email": req.params.email }]
                    }
                }

            ]).exec(function (err, resData) {
                if (err) {
                    console.log("Error in retreiving")
                }
                else {
                    if (password == cryptr.decrypt(userdata[0]?.password) && resData[0].spDetails[0].status != "Disabled") {
                        res.status(200).send(userdata);
                    }
                    else if (resData[0].spDetails[0].status == "Disabled") {
                        res.send({ msg: "Your Account Has been disabled. Please contact Admin" })
                    }
                    else {
                        res.send({})
                    }
                }
            })
        }
        else {
            if (password == cryptr.decrypt(userdata[0]?.password)) {
                res.status(200).send(userdata);
            }
            else {
                res.send({})
            }
        }

    }

    else {
        if (password == (userdata[0]?.password)) {
            res.status(200).send(userdata);
        }
        else {
            res.send({})
        }


    }
})

export default router;