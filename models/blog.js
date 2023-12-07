const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: String,
  description: String,
  category: {type: Schema.Types.ObjectId, ref: 'category'},
  image: String,
  author: {type: Schema.Types.ObjectId, ref: 'user'},
  date: {type: Date, default: Date.now}
});

let blog = mongoose.model('blog', blogSchema)

module.exports = blog;