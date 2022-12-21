
import express  from "express";
import ServiceProviders from "../modals/ServiceProviders.js";
import multer from "multer";
import User from "../modals/User.js";
import Services from "../modals/Services.js";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import  fs from "fs";
import path from 'path';
import {fileURLToPath} from 'url';
import Cryptr from "cryptr"
import Review from "../modals/Review.js";
import Jobs from "../modals/Jobs.js";
const router = express.Router();

const storageProfilePicture = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './Images/ProfilePics');
    },
    filename: function(req, file, cb) {
      var date = new Date();
      var timeStamp = date.toDateString()+"_"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds()+"-"+date.getMilliseconds();
      // timeStampArray.push(timeStamp)
      timeStamp = timeStamp?.toLowerCase().split(' ').join('_');
      file.originalname = file.originalname?.toLowerCase().split(' ').join('_');
      cb(null , timeStamp+"_"+file.originalname)
    }
  });

const storagePortfolioPicture = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './Images/PortfolioPics/');
    },
    filename: function(req, file, cb) {
      var date = new Date();
      var timeStamp = date.toDateString()+"_"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds()+"-"+date.getMilliseconds();
      // timeStampArray.push(timeStamp)
      timeStamp = timeStamp?.toLowerCase().split(' ').join('_');
      file.originalname = file.originalname?.toLowerCase().split(' ').join('_');
      cb(null , timeStamp+"_"+file.originalname)
    }
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jfif') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
const uploadPortfolioPicture = multer({
    storage: storagePortfolioPicture,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
  const uploadProfilePicture = multer({
    storage: storageProfilePicture,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

  

router.get("/:email" ,async function(req,res){

    console.log("Request is received for getting the profile of "+req.params.email);
    
    User.aggregate([
      { $lookup:
          {
              from:'serviceproviders',
              localField:'_id',
              foreignField:'serviceProvider',
              as:'serviceProviderDetails'
          }

      },
      {
          $lookup:{
              from: "services", 
              localField: "serviceProviderDetails.serviceCategory", 
              foreignField: "_id",
              as: "serviceDetails"
          }
      },
      {
          $match:{
              $and:[{"email" : req.params.email}]
          }
      }, 
      
  ]).exec(function(err , services){
      if(err){
          console.log("Error in retreiving serices..........")
      }
      else{
        console.log("sp service: ",services)
          res.send(services)
      }
  }) 
})

router.put("/updateProfile" ,uploadProfilePicture.single("url"),(req, res)=>{
  let serviceId;
  let userId;
  console.log("Request received to update profile" , req.body)
  const profile = req.body;
  profile.url = req?.file?.path;
  console.log(profile)
  // Updating data in USER Collection
  User.findOneAndUpdate({email:profile.email} ,{
  address : profile.address,
  userName :profile.name
  }).then((updatedUser)=>{
    console.log(1)
    console.log("USER THAT IS UPDATED")
    console.log(updatedUser)
    // Getting ID of the new Service
    Services.find({tittle:profile.category}).then((service)=>{
      console.log(2)
      console.log("New Service Object")
      console.log(service[0]._id)
      if (profile.url){
    // Updating data in ServiceProvider Collection
    // if profile picture is changed
    ServiceProviders.findOneAndUpdate({serviceProvider:updatedUser._id} ,{
              profilePicture : profile.url,
              serviceCategory :service[0]._id
           })
           .then((updatedSP)=>{
            console.log(3)
            console.log(updatedSP)
            const __filename = fileURLToPath(import.meta.url);
            // console.log(__filename)
            // console.log(path.dirname(path.dirname(__filename)))
            console.log(updatedSP.profilePicture)
            if (updatedSP.profilePicture != "uploads\\defaultProfile.png"){
              fs.unlink(path.dirname(path.dirname(__filename))+"/"+updatedSP.profilePicture , (err)=>{
                if(err) console.log(err);
                console.log('image was deleted');
              })
            }
           })
          }
          else{
    // Updating data in ServiceProvider Collection
    // if profile picture is NOT changed
            // console.log(updatedUser._id)
            // console.log(service[0]._id)
            ServiceProviders.findOneAndUpdate({serviceProvider:updatedUser._id} ,{
            serviceCategory : service[0]._id
        })
        .then((updatedSP)=>{
          console.log(3)

          console.log(updatedSP)
         })}
    })

  }).catch(err=>console.log(err))
  setTimeout(() => {
    res.status(200).send("");
    
  }, 1000);
  
})
router.put("/updateProfile/deleteImage" , (req , res)=>{
  let email = req.body.email
  let imageUrl = req.body.image
  // console.log(imageUrl)
  User.find({email:email}).then((user)=>{
    // __filename contains the absolute path of the current file
    const __filename = fileURLToPath(import.meta.url); //
    // path.dirname gives the parent directory of the file passed in as a parameter
    fs.unlink(path.dirname(path.dirname(__filename))+"/"+imageUrl, (err)=>{
      if(err) console.log(err);
      console.log('image was deleted');
    })
    ServiceProviders.findOneAndUpdate({serviceProvider:user[0]._id},{
      $pull:{portfolioImages:{$in:[imageUrl]}}
    }).then((sp)=>res.status(200).send(sp)).catch((err)=>res.status(500).send(err))
  }).catch((err)=>res.status(500).send(err))
})
router.put("/updateProfile/uploadImage" ,uploadPortfolioPicture.single("url"),(req, res)=>{
  let email = req.body.email
  let imageUrl = req.file.path
  console.log(imageUrl)
  User.find({email:email}).then((user)=>{
    console.log(user[0])
    ServiceProviders.findOneAndUpdate({serviceProvider:user[0]._id},{
      $push:{portfolioImages:imageUrl}
    }).then((sp)=>res.status(200).send(sp)).catch((err)=>res.status(500).send(err))
  }).catch((err)=>res.status(500).send(err))

})
router.get("/reviews/:email",async(req, res)=>{
  console.log("Requesting reviews for id" , req.params.email)
  var id = await User.find({email:req.params.email} ,'_id')
  console.log(id)
  Review.aggregate([
    {$lookup:
    {
      from:'jobs',
      localField:"job",
      foreignField:"_id",
      as:"job"
    }},
    {$lookup:
    {
      from:"users",
      localField:"job.jobAssignedBy",
      foreignField:"_id",
      as:"client"
    }},
    {$lookup:
      {
        from:"clientprofiles",
        localField:"client._id",
        foreignField:"client",
        as:"profile"
      }},
    {$match:
    {"reviewTo":id[0]._id}
   }
  
  ]).exec((err , data)=>{
    if (err){
      res.status(404).send(err)
    }
    else{
      console.log(data)
      data.map((element) => {
        element.reviewDate = new Date(element.reviewDate).toUTCString()
        return element
    })
      res.status(200).send(data)
    }
  })
})
router.patch("/sp/status-update",(req , res)=>{
  var currentStatus = req.body.status
  console.log( "REQUEST RECEIVED TO TOGGLE STATUS OF", req.body.id)
  console.log(currentStatus)
  ServiceProviders.findOneAndUpdate({serviceProvider:req.body?.id},
    [{$set:{status:
      {
        $cond: { if:{$or:[{ $eq: [ currentStatus, "" ] } ,{ $eq: [ currentStatus, "Enabled" ] } ]} , then: "Disabled", else: "Enabled" }
      }
  }}]
    ).then((sp)=>res.status(200).send(sp)).catch((err)=>{res.status(500).send(err) ; console.log(err)} )
})


export default router;















// router.put("/updateProfile" ,uploads.single("url"),(req, res)=>{
//   let serviceId;
//   let userId;
//     console.log("Request received to update profile" , req.body)
//     const profile = req.body;
//     profile.url = req?.file?.path;
// User.findOneAndUpdate({email:profile.email} ,{
//   address : profile.address,
//   userName :profile.name
// } ,(err,user)=>{
//   if(err){
//     console.log("Couldn't find user")
//   }
//   else{
//     userId = user._id   
//    }
// }).then(()=>
//   Services.find({tittle:profile.category},(err , ser) =>{
//     if(err){
//       console.log("Couldn't find service")
//     }
//     else{
//       console.log(ser)
//       console.log(123)
//       serviceId = ser[0]._id
//     } 
//   }).then(
//     ServiceProviders.findOneAndUpdate({serviceProvider:userId} ,{
//       profilePicture : profile.url,
//       serviceCategory : serviceId
//    } ,(err,sp)=>{
//      if(err){
//        console.log("Couldn't find detail")
//      }
//      else{
//         console.log("Updates")
//         console.log(sp)
//         console.log(userId)
//         console.log(serviceId)
//      }   
//    }
   
// )
//   ).catch(err=>console.log(err))
// ).catch(err=>console.log(err))

    
  
// })