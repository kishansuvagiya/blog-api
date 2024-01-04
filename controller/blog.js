const { default: mongoose } = require('mongoose');
var blog = require('../models/blog');
var catData = require('../models/category');
var user = require('../models/user')
// ------------- blog api----------------------
exports.Addblog = async function (req, res, next) {
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
            message: "Blog add successfully",
            data: newData
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.Allblog = async function (req, res, next) {
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
            message: "Your Blog deleted",
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
            message: "Your Blog updated",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}

exports.search = async (req, res) => {
    const query = req.query.q
    try {
        let searchQuery;
        // Check if the query is a valid ObjectId
        if (mongoose.isValidObjectId(query)) {
            searchQuery = {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { category: query },
                    { author: query }
                ]
            }
        }
        // If not a valid ObjectId
        else {
            const category = await catData.findOne({ name: { $regex: query, $options: 'i' } })
            const author = await user.findOne({ fullname: { $regex: query, $options: 'i' } })
            if (category == null) {
                if (author == null) {
                    searchQuery = { title: { $regex: query, $options: 'i' } }
                } else {
                    searchQuery = { author: author._id }
                }
            }
            else {
                searchQuery = { category: category._id }
            }
        }
        let result = await blog.find(searchQuery).populate(['category', 'author'])
        res.json({
            data: result
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}