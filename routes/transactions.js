import e from "express";
import express from "express";
import mongoose from "mongoose";
import ServiceProviders from "../modals/ServiceProviders.js";
import Transactions from "../modals/Transactions.js";

const router = express.Router();

router.post("/spToAdmin", async (req, res) => {
    console.log("Pohanch gaya post")
    const transaction = new Transactions(req.body)
    await transaction.save().then(
        data => {
            console.log("Transaction Saved", data)
            // ServiceProviders.findOneAndUpdate({ serviceProvider: req.body.from }, {
            //     balance: 0
            // }).then(
            //     data1 => console.log("Transaction Completed", data1)
            // )
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
router.get("/getTransactions/:spid", async (req, res) => {
    // req.params.spid.replace(":", "")
    console.log("Get Transaction Details for", req.params.spid)

    Transactions.find({ from: mongoose.Types.ObjectId(req.params.spid) }, (err, data) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            console.log(data)
            res.send(data)
        }
    })
})

export default router;