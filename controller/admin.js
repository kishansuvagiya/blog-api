var admin = require('../models/admin')
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
    let decode = jwt.verify(token, process.env.ADMIN_KEY)
    // console.log(decode.id);
    let checkUser = await admin.findById(decode.id)
    if(!checkUser){
      throw new Error("Admin Not found")
    }
    // req.userId = decode.id
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
        if (!data.username || !data.password) {
            throw new Error("Please enter all details")
        }

        data.password = await bcrypt.hash(data.password, 10)
        const newUser = await admin.create(data)
        var token = jwt.sign({ id: data._id }, process.env.ADMIN_KEY);
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
      let loginUser = await admin.findOne({ username: loginData.username })
      // console.log(loginUser.password);
      if (!loginUser) {
        throw new Error("Username is wrong")
      }
      let password = await bcrypt.compare(loginData.password, loginUser.password)
      if (!password) {
        throw new Error("password is invalid")
      }
      var token = jwt.sign({ id: loginUser._id }, process.env.ADMIN_KEY);
      res.status(200).json({
        status: "success",
        message: "Admin login succesfully",
        data: loginUser,
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

  exports.AllUser = async (req, res) => {
    try {
      let data = await user.find({}, {password: 0})
      res.status(200).json({
        status: "success",
        message: "All Users data",
        data: data
      })
    } catch (error) {
      res.statis(404).json({
        status: "fail",
        message: error.message
      })
    }
  }

  exports.DeleteUser = async function (req, res, next) {
    try {
        let data = await user.findByIdAndDelete(req.query.id)
        res.status(200).json({
            status: "success",
            message: "User deleted",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}