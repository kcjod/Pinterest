const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
    type: String,
  }
})

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);