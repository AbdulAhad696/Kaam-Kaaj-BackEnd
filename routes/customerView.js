import express from "express";
import Service from "../modals/Services.js";

const router = express.Router();

router.get("/", function (req, res) {
    console.log("Getting all services..........");
    Service.find({ tittle: { $ne: "Not Selected" } })
        .exec(function (err, services) {
            if (err) {
                console.log("Error in retreiving serices..........")
            }
            else {
                res.json(services);
            }
        });
});

router.get("/:service", async function (req, res) {
    let data;
    data = await Service.find({ tittle: req.params.service })
    if (data) {
        return res.send(data)
    }
    else {
        console.log("error in retrieving service providers...............")
        return []
    }
});

export default router;


