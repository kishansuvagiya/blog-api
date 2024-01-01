var user = require('../models/user')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const speakeasy = require('speakeasy');

exports.SECURE = async function (req, res, next) {
  try {
    let token = req.headers.authorization
    // console.log(token);
    if (!token) {
      throw new Error("Please attched token ")
    }
    let decode = jwt.verify(token, process.env.JWT_KEY)
    // console.log(decode);
    let checkUser = await user.findById(decode.id)
    if (!checkUser) {
      throw new Error("User Not found")
    }
    req.userId = decode.id
    next()
  }
  catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    })
  }
}

exports.signUp = async function (req, res) {
  try {
    let data = req.body;
    if (!data.fullname || !data.email || !data.password) {
      throw new Error("Please enter all details")
    }
    data.password = await bcrypt.hash(data.password, 10)
    const newUser = await user.create(data)
    // console.log(newUser);
    var token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
    res.status(201).json({
      status: "success",
      message: "SignUp successfully",
      data: newUser,
      token
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    })
  }
}

exports.login = async function (req, res, next) {
  try {
    let loginData = req.body
    if (!loginData.email || !loginData.password) {
      throw new Error("Please enter valid fields")
    }
    let email = await user.findOne({ email: loginData.email })
    // console.log(email.password);
    if (!email) {
      throw new Error("Email is wrong !")
    }
    let password = await bcrypt.compare(loginData.password, email.password)
    if (!password) {
      throw new Error("password is invalid !")
    }
    var token = jwt.sign({ id: email._id }, process.env.JWT_KEY);
    res.status(200).json({
      status: "success",
      message: "Login succesfully",
      data: email,
      token
    })
  }
  catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // `true` for port 465, `false` for all other ports
  auth: {
    user: "hitikro@gmail.com",
    pass: "hmkn wvjs xvmn qerv",
  },
});

async function main(email, otpToken) {
  const info = await transporter.sendMail({
    from: 'hitikro@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Forgot Password OTP", // Subject line
    text: `Your OTP for password reset is: ${otpToken}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`, // plain text body
    html: `<p>Your OTP for password reset is: <b>${otpToken}</b></p><br /><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
}
main().catch(console.error);

exports.ForgotPassword = async (req, res) => {
  try {
    let { email } = req.body
    const userdata = await user.findOne({ email: email })
    if (!userdata) {
      throw new Error('User not found !')
    }

    const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;
    userdata.otpSecret = otpSecret
    await userdata.save();

    var otpToken = speakeasy.hotp({
      secret: otpSecret,
      encoding: 'base32',
      counter: 123
    });
    main(email, otpToken)
    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully'
    })

  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    })
  }
}

exports.verifyOTP = async(req, res) => {
  try {
    let {email, otp, newPassword} = req.body
    const userdata = await user.findOne({email: email})
    if(!userdata){
      throw new Error('User not found !')
    }

    var isValidOTP = speakeasy.hotp.verify({
      secret: userdata.otpSecret,
      encoding: 'base32',
      token: otp,
      counter: 123
    });

    if(isValidOTP){
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      userdata.password = hashedPassword
      userdata.otpSecret = undefined
      await userdata.save()
    }
    else{
      throw new Error('Invalid OTP')
    }
    res.status(200).json({
      status: 'success',
      message: 'Password reset succesfully'
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    })
  }
}