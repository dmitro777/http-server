/**
 * Users Model Schema
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const favorite = require('./favorite');

const userSchema = new Schema({
    
    firstname: {
        type: String,
        default: ''
    },

    lastname: {
        type: String,
        default: ''
    },

    favoriteDishes: [favorite.schema],

    facebookId: String,

    admin: {
        type: Boolean,
        default: false
    }
},

{ timestamps: true }

);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);