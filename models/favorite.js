/**
 * Favorite Model Schema
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const favoriteSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // reference to User Model
    },
    
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish' // reference to Dish Model
    }
},

{ timestamps: true }

);

favoriteSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Favorite', favoriteSchema);