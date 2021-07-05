/**
 * Users Router
 */
var express = require('express');
var userRouter = express.Router();
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

// bodyParser.json() depricated, using expess.json()
userRouter.use(express.json());
/**
 * User athentication
 **/
userRouter.get('/', (req, res, next) => {
    res.send('Respond with a resource.');
});

userRouter.post('/signup', (req, res, next) => {

    User.register(new User({username: req.body.username}), 
        req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    });
  });

userRouter.post('/login', passport.authenticate('local'), 
(req, res) => {

    res.statusCode = 200; // ok
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

userRouter.get('/signout', (req, res) => {

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

module.exports = userRouter;
