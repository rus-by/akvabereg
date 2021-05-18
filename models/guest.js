const mongoose = require('mongoose');

const {
    Schema
} = mongoose;


var guestSchema = new Schema({

    visit: {
        type: Number
    },
    date:[{
        type: Date
    }],
    status:{
        type: Number
    },
    data:{
        type: Array
    }
})

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
