/**
 * Favorites Router
 */
const express = require('express');
const favoritesRouter = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const User = require('../models/user');

favoritesRouter.use(express.json());
/**
 * GET all favorite dishes
 */
favoritesRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {

    User.findById(req.user._id)
    .then((user) => {

        if (user != null) {
            res.statusCode = 200; // ok
            res.setHeader('Content-Type', 'application/json');
            res.json(user.favoriteDishes);
        }
        else {
            err = new Error('User: ' + req.user._id + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }
    
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {

    User.findById(req.user._id)
    .then((user) => {
        
        if (!user.favoriteDishes.id(req.body.dish)) {

            user.favoriteDishes.addToSet(req.body.dish);
            user.save()
            .then((user) => {

                User.findById(user._id)
                    .populate('favoriteDishes.user')
                    .then((user) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(user);
                    })                
            }, (err) => next(err));
        }
        else {

            err = new Error('Dish: ' + req.body.dish + ' already in your favorites!');
            err.statusCode = 404; // not found
            return next(err);
        }
}, (err) => next(err))
.catch((err) => next(err));
})

.put(cors.cors, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on */favorites/');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
    
    User.findById(req.user._id)
    .then((user) => {

        if (user != null) {

            for (var i = (user.favoriteDishes.length -1); i >= 0; i-- ) {
                user.favoriteDishes.id(user.favoriteDishes[i]._id).remove();
            }
            user.save() // save() provided by mongoose
            .then((user) => {

                res.statusCode = 200; // ok
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err));
        }
        else {

            err = new Error('User: ' + req.user._id + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }

    }, (err) => next(err))
    .catch((err) => next(err));
});
/**
 * GET all favorite dishes
 */
favoritesRouter.route('/:dishId')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('GET operation not suported on /favorites/' 
    + req.params.dishId);
})

.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {

    User.findById(req.user._id)
    .then((user) => {
        
        if (!user.favoriteDishes.id(req.params.dishId)) {

            user.favoriteDishes.addToSet(req.params.dishId);
            user.save()
            .then((user) => {

                User.findById(user._id)
                    .populate('favoriteDishes.user')
                    .then((user) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(user);
                    })                
            }, (err) => next(err));
        }
        else {

            err = new Error('Dish: ' + req.params.dishId + ' already in your favorites!');
            err.statusCode = 404; // not found
            return next(err);
        }
}, (err) => next(err))
.catch((err) => next(err));
})

.put(cors.cors, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /favorites/' 
    + req.body.dish);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {

User.findById(req.user._id)
.then((user) => {

    if (user != null && user.favoriteDishes.id(req.params.dishId) != null) {
        
        user.favoriteDishes.id(req.params.dishId).remove();
        user.save() // save() provided by mongoose
        .then((user) => {
            User.findById(req.user._id)
        .populate('favoriteDishes.user')
        .then((user) => {
                res.statusCode = 200; // ok
                res.setHeader('Content-Type', 'application/json');
                res.json(user.favoriteDishes);
            })
        }, (err) => next(err))
    }
    else {
        err = new Error('Dish: ' + req.params.dishId + ' not found.');
        err.statusCode = 404; // not found
        return next(err);
    }

}, (err) => next(err))
.catch((err) => next(err));
});

module.exports = favoritesRouter;