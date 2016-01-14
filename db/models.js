var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
  User: {
    password: {type: String, required: true},
    email: {type: String, required: true}
  },
  Article: {
    user: {type: ObjectId, ref: 'User'},
    title: String,
    content: String,
    img: String,
    pv: {type: Number, default: 0},
    comments: [{
      user: {type: ObjectId, ref: 'User'},
      content: String,
      createAt: {type: Date, default: Date.now}
    }],
    createAt: {type: Date, default: Date.now}
  }
};