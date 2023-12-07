var blog = require('../models/blog');

// ------------- blog api----------------------
exports.Addblog =  async function (req, res, next) {
    try {
        console.log(req.file);
        let data = req.body
        data.image = req.file.filename
        data.author = req.userId
        if (!data.title || !data.description || !data.image || !data.category) {
            throw new Error("Please enter valid fields")
        }
        const newData = await blog.create(data)
        res.status(201).json({
            status: "success",
            message: "data add successfully",
            data: newData
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.Allblog= async function (req, res, next) {
    try {
        let data = await blog.find().populate(['category', 'author'])
        res.status(200).json({
            status: "success",
            message: "All your data",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}


exports.Deleteblog = async function (req, res, next) {
    try {
        let data = await blog.findByIdAndDelete(req.query.id)
        res.status(200).json({
            status: "success",
            message: "Your data deleted",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.Updateblog = async function (req, res, next) {
    try {
        req.body.image = req.file.filename
        let data = await blog.findByIdAndUpdate(req.query.id, req.body, { new: true })
        res.status(200).json({
            status: "success",
            message: "Your data updated",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}