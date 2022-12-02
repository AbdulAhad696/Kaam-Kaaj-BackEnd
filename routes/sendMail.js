import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import fs from "fs";
import handlebars from "handlebars";    
import { frontEndBaseurl } from "../constants.js";
import express from "express";
import mongoose from 'mongoose'
import User from "../modals/User.js";


const router = express.Router()

router.get("/:email" , async(req , res)=>{

    const userData=await User.find({email:req.params.email})

    console.log("Request is received for sending mail to ",req.params.email)
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
          if (err) {
            callback(err);
          } else {
            callback(null, html);
          }
        });
      };
    
    
    const smtpTransport1 = nodemailer.createTransport(
    smtpTransport({
        service: "gmail",
        auth: {
        user: "kaamkaaj35@gmail.com",
        pass: "gpfxdgjcqgkttblh",
        },
    })
    );
    
    
    if(userData.length>0){
        readHTMLFile(
            "D:/5th Semester/Kaam-Kaaj-BackEnd/views/changePasswordEmailTemplate.html",
            function (err, html) {
            if (err) {
                console.log("error reading file", err);
                return;
            }
            var template = handlebars.compile(html);
            var replacements = {
                url: frontEndBaseurl + "/changepassword/" + userData[0]._id
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: "KaamKaaj",
                to: req.params.email,
                subject: "Change Password",
                html: htmlToSend,
            };
            smtpTransport1.sendMail(mailOptions, function (error, response) {
                if (error) {
                console.log(error);
                } else {
                console.log(response);
                }
            });
        })
    }
    else{
        console.log("No account found with email:",req.params.email)
    }
})



export default router;
