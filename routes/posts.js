const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const postModel = mongoose.Schema({
  posttext: {
    type: String,
    required: true,
  },
  image: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: []
})


module.exports = mongoose.model('Post',postModel);