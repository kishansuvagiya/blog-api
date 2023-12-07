var express = require('express');
var router = express.Router();
var categoryController = require('../controller/category')
var adminController = require('../controller/admin')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

// ------------- category api----------------------
router.post('/', adminController.SECURE, upload.single('image'), categoryController.AddCategory)
router.get('/', categoryController.AllCategory)
router.delete('/', adminController.SECURE, categoryController.DeleteCategory)
router.put('/', adminController.SECURE, upload.single('image'), categoryController.UpdateCategory)

module.exports = router;
