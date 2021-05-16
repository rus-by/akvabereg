const mongoose = require('mongoose');

const {
    Schema
} = mongoose;


var projectSchema = new Schema({
    image:{
        type: String,
        required: true,
        unique: true
        
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    author: {
        ref: 'User',
        type: Schema.Types.ObjectId
    }
})

//    UserSchema.set('toObject', {virtuals: true})
//    UserSchema.set('toJSON', {virtuals: true})
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
