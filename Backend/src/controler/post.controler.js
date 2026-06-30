const Postmodel = require('../Model/Post.model');
const NotificationModel = require('../Model/Notification.model');
const generateCaption = require("../Service/AI.SRVICE");
const upload = require('../Service/Imagekit.service.post');
const { v4: uuidv4 } = require('uuid');

const createpostcontroler = async (req, res) => {
  const file = req.file;
  const base64images = Buffer.from(req.file.buffer).toString("base64");

  try {
    const aiResult = await generateCaption(base64images);
    const result = await upload(file.buffer, `${uuidv4()}`);

    const variants = aiResult.variants || {
      short: aiResult.caption || aiResult,
      medium: aiResult.caption || aiResult,
      long: aiResult.caption || aiResult,
    };
    const hashtags = aiResult.hashtags || [];
    const primaryCaption = variants.medium || variants.short || variants.long;

    const Post = await Postmodel.create({
      image: result.url,
      caption: primaryCaption,
      variants,
      hashtags,
      id: result.fileId,
      user: req.user._id,
    });

    await NotificationModel.create({
      user: req.user._id,
      type: 'created',
      message: 'Caption Generated Successfully',
      image: result.url,
      caption: primaryCaption,
    });

    res.status(200).json({
      caption: primaryCaption,
      variants,
      hashtags,
      message: "Operation performed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to generate caption' });
  }
};

const getHistoryController = async (req, res) => {
  try {
    const posts = await Postmodel.find({ user: req.user._id })
      .sort({ _id: -1 })
      .select('image caption variants hashtags id createdAt')
      .lean();

    const history = posts.map(post => ({
      _id: post._id,
      image: post.image,
      caption: post.caption,
      variants: post.variants,
      hashtags: post.hashtags,
      id: post.id,
      createdAt: post.createdAt,
    }));

    res.status(200).json(history);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

const deletePostController = async (req, res) => {
  try {
    const post = await Postmodel.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await Postmodel.deleteOne({ _id: req.params.id });

    await NotificationModel.create({
      user: req.user._id,
      type: 'deleted',
      message: 'Caption Deleted',
      image: post.image,
      caption: post.caption,
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = { createpostcontroler, getHistoryController, deletePostController };
