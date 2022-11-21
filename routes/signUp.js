import express from "express";
import User from "../modals/User.js";
import ServiceProvider from "../modals/ServiceProviders.js";
import nodemailer from 'nodemailer'


//Email authentication setup
import smtpTransport from 'nodemailer-smtp-transport'
import fs from 'fs'
import handlebars from 'handlebars'
import { baseUrl } from "../constants.js";

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
         callback(err);                 
      }
      else {
          callback(null, html);
      }
  });
};


const smtpTransport1 = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
    auth: {
      user: 'kaamkaaj35@gmail.com',
      pass: 'gpfxdgjcqgkttblh'
    }
}));
//End here

const router = express.Router()

router.get('/',(req,res)=>{
  console.log('req:',req.query.id)
  try{
  User.findOneAndUpdate({_id: req.query.id}, {authentication: "true"}).then((res)=>{
    console.log(res)
    User.deleteMany({email:res.email,authentication:"false"}, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Deleted User : ", docs);
      }
    });
  })

  res.sendFile('D:/5th Semester/Kaam-Kaaj-BackEnd/views/successfullyVerifiedTemplate.html')
}
  catch(err){
    console.log(err)
  }


})
router.post("/" ,async (req,res)=>{
    const user=new User(req.body);
    try{

        const isRegister =await user.save()
        console.log('User is registered:',isRegister)
        if(user.role=="Worker"){
            const workerProfile=new ServiceProvider({serviceProvider:isRegister._id})
            await workerProfile.save()
            console.log("Worker profile is also created..")
        }
        //Sending mail to a user
        readHTMLFile('D:/5th Semester/Kaam-Kaaj-BackEnd/views/emailTemplate.html', function(err, html) {
          if (err) {
             console.log('error reading file', err);
             return;
          }
          var template = handlebars.compile(html);
          var replacements = {
            url: baseUrl+"/signup?id="+isRegister._id
          };
          var htmlToSend = template(replacements);
          var mailOptions = {
              from: 'KaamKaaj',
              to : user.email,
              subject : 'Authentication',
              html : htmlToSend
           };
          smtpTransport1.sendMail(mailOptions, function (error, response) {
              if (error) {
                  console.log(error);
              }
              else{
                console.log(response)
              }
          });
        });
        //End here

        res.send(true)
    }catch(err){

        console.log('Error occured....',err)
        res.send(false)
    }

    // isregister=await ( user.save(function(err,res){
    //     console.log("vbhdjbvjh")
    //     if(err){
    //         console.log("Registration failed")
    //         return false
    //     }
    //     else{
    //         if(user.role=="Worker"){
    //             console.log(res)
    //             console.log("Worker detected...")
    //             let workerProfile={serviceProvider:res._id}
    //             let worker=new ServiceProvider(workerProfile)
    //             let isProfileCreated
    //             isProfileCreated= worker.save(function(err,result){
    //                 if(err)
    //                 {
    //                     console.log("Error in creating worker profile")
    //                     return false
    //                 }
    //                 else
    //                 {
    //                     console.log("Registered successfully")
    //                     return true
    //                 }
    //             })
    //         }
    //         else
    //         {
    //             console.log("Registered successfully")
    //             return true
    //         }
    //     }
    
    //  }))
    // isregister= await user.save().then((err,res)=>{
    //     if(err.body)
    //     {
    //         console.log("Registration failed")
    //         return false
    //     }
    //     else{
    //         if(user.role=="Worker")
    //         {
    //             console.log(res)
    //             console.log("Worker detected...")
    //             let workerProfile={serviceProvider:res?.body?.role}
    //             let worker=new ServiceProvider(workerProfile)
    //             let isProfileCreated
    //             isProfileCreated= worker.save(function(err,result){
    //                 if(err)
    //                 {
    //                     console.log("Prpfile error")
    //                 }
    //                 else
    //                 {
    //                     console.log(result._id)
    //                 }
    //             })
    //             console.log(isProfileCreated)
    //             // .then((err,res)=>{
    //             //     if(err.body)
    //             //     {
    //             //         console.log("Registration failed")
    //             //         return false
    //             //     }
    //             //     else{
    //             //         console.log("Registered successfully")
    //             //         return true
    //             //     }

    //             // })

    //         }
    //         else{
    //             console.log("Registered successfully")
    //             return true
    //         }
    //     }

    // })
    // res.send(isRegister)

})
router.get("/:email",async(req,res)=>{
    console.log("Request is received for getting data with email "+req.params.email)
    let isvalid
    isvalid=await User.findOne({email:req.params.email})
    if(isvalid?.authentication=="true")
    {
        res.send(true)
        console.log("Result:true")
    }
    else{
        res.send(false)
        console.log("Result:false")
    }
})


export default router;