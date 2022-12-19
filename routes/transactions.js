import e from "express";
import express from "express";
import mongoose from "mongoose";
import ServiceProviders from "../modals/ServiceProviders.js";
import Transactions from "../modals/Transactions.js";
import User from "../modals/User.js";

const router = express.Router();

router.post("/spToAdmin", async (req, res) => {
    console.log("Pohanch gaya post")

    const transaction = new Transactions(req.body)
    await transaction.save().then(
        data => {
            console.log("Transaction Saved", data)
        }
    ).catch(err => { console.log(err) })
    res.status(200).send()

});
router.patch("/spToAdmin/:spId", async (req, res) => {
    console.log("Request received to update the balance of:" + req.params.spId)
    await ServiceProviders.findOneAndUpdate({ serviceProvider: req.params.spId }, {
        balance: 0
    }).then(
        data1 => {
            console.log("Balance Reset", data1)
            res.status(200).send(data1)
        }
    ).catch(err => { console.log(err) })

}
)

router.patch("/getMoney/:amount", async (req, res) => {
    console.log("Request received to update the profit of admin:" + req.params.amount)
    // const user = await User.findById("639726e583fb10e22a7bb183")
    // console.log(user.totalEarning)
    User.updateOne({ _id: mongoose.Types.ObjectId("639726e583fb10e22a7bb183") }, { $inc: { totalEarning: parseInt(req.params.amount) } }, (err, data) => {
        if (err) {
            console.log(err)
        }
        else { console.log(data) }
    }).then(
        data1 => {
            console.log("AMount Received", data1)
            res.status(200).send(data1)
        }
    ).catch(err => { console.log(err) })

}
)
router.get("/getTransactions/:spid", async (req, res) => {
    // req.params.spid.replace(":", "")
    console.log("Get Transaction Details for", req.params.spid)
    Transactions.aggregate([
        {
            $match: {
                $or: [{
                    from: mongoose.Types.ObjectId(req.params.spid)
                }
                    ,
                {
                    to: mongoose.Types.ObjectId(req.params.spid)
                }
                ]
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'to'
            }
        }, {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'from'
            }
        }
    ]
    ).exec(function (err, data) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            console.log(data)
            res.send(data)
        }
    })
    // Transactions.find({ $or: [{ from: mongoose.Types.ObjectId(req.params.spid) }, { to: mongoose.Types.ObjectId(req.params.spid) }] }, (err, data) => {
    //     if (err) {
    //         console.log(err)
    //         res.send(err)
    //     }
    //     else {
    //         console.log(data)
    //         res.send(data)
    //     }
    // })
})

export default router;