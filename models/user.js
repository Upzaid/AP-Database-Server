const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    user_type: {type: String, required: true , enum: ['admin', 'editor', 'viewer']}
})

module.exports = mongoose.model('User', UserSchema)