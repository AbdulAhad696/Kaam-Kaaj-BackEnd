import express  from "express";
import ServiceProviders from "../modals/ServiceProviders.js";
import Users from "../modals/User.js";
import multer from "multer";
import User from "../modals/User.js";
import Services from "../modals/Services.js";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import  fs from "fs";
import path from 'path';
import {fileURLToPath} from 'url'
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname)?.toLowerCase().split(' ').join('_');
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jfif') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
const uploads = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

  

router.get("/:email" ,async function(req,res){
    console.log("Request is received for getting the profile of "+req.params.email);
    let data;
    ServiceProviders.aggregate([
        { $lookup:
            {
                from:'users',
                localField:'serviceProvider',
                foreignField:'_id',
                as:'serviceProviderDetails'
            }

        },
        {
            $lookup:{
                from: "services", 
                localField: "serviceCategory", 
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        {
            $match:{
                $and:[{"serviceProviderDetails.email" : req.params.email}]
            }
        }, 
        
    ]).exec(function(err , services){
        if(err){
            console.log("Error in retreiving serices..........")
        }
        else{
            res.json(services)
        }
    })
    
    // data=await ServiceProviders.find({service:req.params.service})
    // if(data)
    // {
    //     return res.send(data)
    // }
    // else{
    //     console.log("error in retrieving service providers...............")
    //     return []
    // }
// } ); 
})

router.put("/updateProfile" ,uploads.single("url"),(req, res)=>{
  let serviceId;
  let userId;
  console.log("Request received to update profile" , req.body)
  const profile = req.body;
  profile.url = req?.file?.path;
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
            fs.unlink(path.dirname(path.dirname(__filename))+"/"+updatedSP.profilePicture , (err)=>{
              if(err) console.log(err);
              console.log('image was deleted');
            })
           })
          }
          else{
    // Updating data in ServiceProvider Collection
    // if profile picture is NOT changed
        ServiceProviders.findOneAndUpdate({serviceProvider:updatedUser._id} ,{
            serviceCategory : service[0]._id
        })
        .then((updatedSP)=>{
          console.log(3)
          console.log(updatedSP)
         })}
    })

  }).catch(err=>console.log(err))

  res.status(200).send("");
  
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
router.put("/updateProfile/uploadImage" ,uploads.single("url"),(req, res)=>{
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