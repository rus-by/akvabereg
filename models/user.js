const mongoose = require('mongoose');

const { Schema } = mongoose;


var UserSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }})

//    UserSchema.set('toObject', {virtuals: true})
//    UserSchema.set('toJSON', {virtuals: true})
    const User = mongoose.model('User', UserSchema);

    module.exports = User;