import express from "express";
import multer from "multer";
import Service from "../modals/Services.js";

const router = express.Router();


const storageServicePicture = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Images/ServicePics/');
    },
    filename: function (req, file, cb) {
        var date = new Date();
        var timeStamp = date.toDateString() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getMilliseconds();
        // timeStampArray.push(timeStamp)
        timeStamp = timeStamp?.toLowerCase().split(' ').join('_');
        file.originalname = file.originalname?.toLowerCase().split(' ').join('_');
        cb(null, timeStamp + "_" + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jfif') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const uploadServicePicture = multer({
    storage: storageServicePicture,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


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

// playlist.update({} , {myquery1} , function (err , obj){

// })

router.post("/addService", uploadServicePicture.single("url"), async (req, res) => {
    console.log("ADGYAA MAI")
    const profile = req.body;
    profile.image = req?.file?.path;
    console.log(profile)
    res.send({})
    await new Service(req.body).save()
})

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


