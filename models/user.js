const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    fullname: String,
    password: String,
});

let userData = mongoose.model('user', userSchema)

module.exports = userData;