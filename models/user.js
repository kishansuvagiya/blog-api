const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    fullname: String,
    password: String,
    otpSecret: String
});

let userData = mongoose.model('user', userSchema)

module.exports = userData;