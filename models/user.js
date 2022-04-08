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
    created: {
        type: Date,
    },
    status: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    chatId: {
        type: String
    }
})

//    UserSchema.set('toObject', {virtuals: true})
//    UserSchema.set('toJSON', {virtuals: true})
const User = mongoose.model('User', UserSchema);

module.exports = User;