/**
 * Users Router
 */
const express = require('express');
const passport = require('passport');
const userRouter = express.Router();
const cors = require('./cors');
const User = require('../models/user');
const authenticate = require('../authenticate');

userRouter.use(express.json());
/**
 * User athentication
 **/
userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, (req, res, next) => {
        // find() provided by mongoose
        User.find({})
        .then((users) => {
    
            res.statusCode = 200; // ok
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

userRouter.post('/signup', cors.corsWithOptions, 
(req, res, next) => {

    User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        else {
            if (req.body.firstname)
                user.firstname = req.body.firstname;
            if (req.body.lastname)
                user.lastname = req.body.lastname;

            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            });
        }
    });
});

userRouter.post('/login', cors.corsWithOptions, 
    passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200; // ok
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

userRouter.get('/signout', cors.corsWithOptions, (req, res, next) => {

    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in.');
        err.status = 403; // forbidden
        next(err);
    }
});

userRouter.get('/facebook/token', passport.authenticate('facebook-token'), 
    (req, res) => {
    
        if (req.user) {
            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, token: token, status: 'You are successfully logged in!'});
        }
});

module.exports = userRouter;
