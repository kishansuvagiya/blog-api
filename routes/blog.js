var express = require('express');
var router = express.Router();
var blogController = require('../controller/blog')
var userController = require('../controller/user')
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

// ------------- blog api----------------------
router.post('/', userController.SECURE, upload.single('image'), blogController.Addblog)
router.get('/', blogController.Allblog)
router.get('/search', blogController.search)
router.delete('/', userController.SECURE, blogController.Deleteblog)
router.delete('/admin/delete', adminController.SECURE, blogController.Deleteblog)
router.put('/', userController.SECURE, upload.single('image'), blogController.Updateblog)

module.exports = router;
