const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

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