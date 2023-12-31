var catData = require('../models/category');

// ------------- category api----------------------
exports.AddCategory = async function (req, res, next) {
    try {
        let category = req.body
        category.image = req.file.filename
        if (!category.name || !category.image) {
            throw new Error("Please enter valid fields")
        }
        const newCategory = await catData.create(category)
        res.status(201).json({
            status: "success",
            message: "Category add successfully",
            data: newCategory
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.AllCategory = async function (req, res, next) {
    try {
        let data = await catData.find()
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
exports.DeleteCategory = async function (req, res, next) {
    try {
        let data = await catData.findByIdAndDelete(req.query.id)
        res.status(200).json({
            status: "success",
            message: "Category delete successfully",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}
exports.UpdateCategory = async function (req, res, next) {
    try {
        req.body.image = req.file.filename
        let data = await catData.findByIdAndUpdate(req.query.id, req.body, { new: true })
        res.status(200).json({
            status: "success",
            message: "Category update successfully",
            data: data
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
        })
    }
}