import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

import { verifyEmailTemplate } from "../../Template/SendEmail/verify_email.template.js";
import { ResetPasswordTemplate } from "../../Template/SendEmail/reset_password.template.js";



export const sendEmailService = async ({ email, type }) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "localhost",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_GMAIL_SERVICE,
      pass: process.env.PASSWORD_GMAIL_SERVICE,
    },
  });

  const tokenVerify = jwt.sign({ email }, process.env.VERIFY_EMAIL_SIGNATURE)

  const tokenResetPassword = jwt.sign({ email:email },process.env.RESET_PASSWORD_SIGNATURE)

  let test = verifyEmailTemplate(tokenVerify)
  if (type == 'forgetPassword') test = ResetPasswordTemplate(tokenResetPassword)


  const info = await transporter.sendMail({
    from: `"Task_Route" <${process.env.USER_GMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "can you verify email now", // Subject line
    html: test, // html body

  });

}