const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const otp_Generator = require('otp-generator');
const NodeCache = require('node-cache');
const e = require('express');

const otpCache = new NodeCache({ stdTTL: 300 });

dotenv.config();

const sendOTP = async (req, res) => {

    const { email, email_msg} = req.body;

    const OTP = otp_Generator.generate(6, 
        { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    console.log(OTP);

    otpCache.set(email, OTP);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject:  "OpinioNet OTP Verification Code: ",
        text: email_msg + OTP || 'OpinioNet OTP Verification Code: ' + OTP
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Email sent' });
        }
    });

};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if(!email || !otp) return res.status(400).send('Email and OTP are required');

    const storedOtp = otpCache.get(email);

    if(storedOtp === otp){
      otpCache.del(email);
      res.status(200).send('OTP verified successfully');
    } 
    else{
        res.status(400).send('Invalid or expired OTP');
    }
 }

module.exports = { sendOTP, verifyOTP };

    