import express from "express";
import User from "../modals/User.js";
import ServiceProvider from "../modals/ServiceProviders.js";
import nodemailer from "nodemailer";
import clientProfile from "../modals/ClientProfile.js";

//Email authentication setup
import smtpTransport from "nodemailer-smtp-transport";
import fs from "fs";
import handlebars from "handlebars";
import { baseUrl } from "../constants.js";

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
//End here

const router = express.Router();
// <!-- --------------------Upadating the authentication to true and sending verified template------------------------------ -->

router.get("/", (req, res) => {
  console.log("req:", req.query.id);
  try {
    User.findOneAndUpdate(
      { _id: req.query.id },
      { authentication: "true" }
    ).then((res) => {
      console.log(res);
      User.deleteMany(
        { email: res.email, authentication: "false" },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Deleted User : ", docs);
          }
        }
      );
    });

    res.sendFile(
      "D:/5th Semester/Kaam-Kaaj-BackEnd/views/successfullyVerifiedTemplate.html"
    );
  } catch (err) {
    console.log(err);
  }
});

// <!-- --------------------Signing up a new user------------------------------ -->
router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    const isRegister = await user.save();
    console.log("User is registered:", isRegister);
    if (user.role == "Worker") {
      const workerProfile = new ServiceProvider({
        serviceProvider: isRegister._id,
      });
      await workerProfile.save();
      console.log("Worker profile is also created..");
    } else{
      const myProfile = new clientProfile({
        client: isRegister._id,
        profileImage: "uploads\\defaultProfile.png",
      });
      await myProfile.save();
      console.log("Client profile is also created..");
    }
    // <!-- --------------------Sending mail to a user------------------------------ -->

    readHTMLFile(
      "D:/5th Semester/Kaam-Kaaj-BackEnd/views/emailTemplate.html",
      function (err, html) {
        if (err) {
          console.log("error reading file", err);
          return;
        }
        var template = handlebars.compile(html);
        var replacements = {
          url: baseUrl + "/signup?id=" + isRegister._id,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: "KaamKaaj",
          to: user.email,
          subject: "Authentication",
          html: htmlToSend,
        };
        smtpTransport1.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
          } else {
            console.log(response);
          }
        });
      }
    );
    //End here

    res.send(true);
  } catch (err) {
    console.log("Error occured....", err);
    res.send(false);
  }
});

// <!-- --------------------Checking user is already registerd or not------------------------------ -->

router.get("/:email", async (req, res) => {
  console.log(
    "Request is received for getting data with email " + req.params.email
  );
  let isvalid;
  isvalid = await User.findOne({ email: req.params.email });
  if (isvalid?.authentication == "true") {
    res.send(true);
    console.log("Result:true");
  } else {
    res.send(false);
    console.log("Result:false");
  }
});

export default router;
