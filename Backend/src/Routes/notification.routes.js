const express = require('express')
const router = express.Router()
const Authentication = require('../middleware1/middleware.auth')
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controler/notification.controller')

router.get('/', Authentication, getNotifications)
router.get('/unread-count', Authentication, getUnreadCount)
router.post('/', Authentication, createNotification)
router.patch('/read-all', Authentication, markAllAsRead)
router.patch('/:id/read', Authentication, markAsRead)

module.exports = router
