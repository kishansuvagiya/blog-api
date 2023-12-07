const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  image: String,
});

let catData = mongoose.model('category', categorySchema)

module.exports = catData;