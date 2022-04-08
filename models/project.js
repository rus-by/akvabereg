const mongoose = require('mongoose');

const {
    Schema
} = mongoose;


var projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        unique: false
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
    changes: [{
        ref: 'Project',
        type: Schema.Types.ObjectId
    }],
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
