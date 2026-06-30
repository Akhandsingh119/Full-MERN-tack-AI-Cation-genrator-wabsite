const NotificationModel = require('../Model/Notification.model');

const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ user: req.user._id })
      .sort({ _id: -1 })
      .limit(50)
      .lean();
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { type, message, image, caption } = req.body;
    if (!type || !message) {
      return res.status(400).json({ message: 'type and message are required' });
    }
    const notification = await NotificationModel.create({
      user: req.user._id,
      type,
      message,
      image,
      caption,
    });
    res.status(201).json(notification);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await NotificationModel.countDocuments({ user: req.user._id, read: false });
    res.status(200).json({ count });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};

module.exports = { getNotifications, createNotification, markAsRead, markAllAsRead, getUnreadCount };
