const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ['created', 'deleted'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: String,
  caption: String,
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = NotificationModel;
