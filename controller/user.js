var user = require('../models/user')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

exports.SECURE = async function (req, res, next) {
  try {
    let token = req.headers.authorization
    // console.log(token);
    if(!token){
      throw new Error("Please attched token ")
    }
    let decode = jwt.verify(token, process.env.JWT_KEY)
    // console.log(decode.id);
    let checkUser = await user.findById(decode.id)
    if(!checkUser){
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
        if (!data.fullname || !data.username || !data.password) {
            throw new Error("Please enter all details")
        }
        data.password = await bcrypt.hash(data.password, 10)
        const newUser = await user.create(data)
        var token = jwt.sign({ id: data._id }, process.env.JWT_KEY);
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
      if (!loginData.username || !loginData.password) {
        throw new Error("Please enter valid fields")
      }
      let username = await user.findOne({ username: loginData.username })
      // console.log(username.password);
      if (!username) {
        throw new Error("username is wrong")
      }
      let password = await bcrypt.compare(loginData.password, username.password)
      if (!password) {
        throw new Error("password is invalid")
      }
      var token = jwt.sign({ id: username._id }, process.env.JWT_KEY);
      res.status(200).json({
        status: "success",
        message: "User login succesfully",
        data: username,
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