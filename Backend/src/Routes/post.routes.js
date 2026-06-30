const express = require('express')
const router = express.Router()
const Authentication = require('../middleware1/middleware.auth.js')
const multer = require('multer')
const { createpostcontroler, getHistoryController, deletePostController } = require('../controler/post.controler.js')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/', Authentication, upload.single('images'), createpostcontroler)
router.get('/history', Authentication, getHistoryController)
router.delete('/:id', Authentication, deletePostController)

module.exports = router
