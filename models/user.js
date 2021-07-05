/**
 * Users Model Schema
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    
    // Now passport-local-mongoose module will take care of it
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

    // password: {
    //     type: String,
    //     required: true,
    //     unique: false
    // },

    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);