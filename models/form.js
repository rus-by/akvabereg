const mongoose = require('mongoose');

const {
    Schema
} = mongoose;


var FormSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    date: {
        type: Date,
    },
    created: {
        type: Date,
        required: true
    },
    status:{
        type: Number,
        required: true
    }
})

//    UserSchema.set('toObject', {virtuals: true})
//    UserSchema.set('toJSON', {virtuals: true})
const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
