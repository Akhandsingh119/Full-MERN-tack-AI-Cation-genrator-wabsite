const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: String,
  caption: String,
  variants: {
    short: String,
    medium: String,
    long: String,
  },
  hashtags: [String],
  id: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
