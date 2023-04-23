require("dotenv").config();
const fs = require("fs");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const sendEmailTest = async (req, res) => {
  // create test email
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  //send mail
  let info = await transporter.sendMail({
    from: `viettai <${testAccount.user}>`, // sender address
    to: "viettaixca123@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  res.json(info);
};
const emails = ["reodev2003@gmail.com"];
const htmls = `
    <h1>Hello </h1>
`;
const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: emails,
    from: "viettaixca123@gmail.com",
    subject: "test mail",
    text: "OK",
    html: htmls,
  };
  const info = await sgMail.send(msg);
  res.json(info);
};

module.exports = sendEmail;
