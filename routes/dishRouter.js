const express = require('express');
const dishRouter = express.Router();
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
// bodyParser.json() depricated, using expess.json()
dishRouter.use(express.json());
/**
 * For all Dishes - Iplementing HTTP communication protocol methods using express
 */
dishRouter.route('/')

.get((req, res, next) => {
    // find() is provided by mongoose
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    // create() is provided by mongoose
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish created! ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /dishes');
})

.delete((req, res, next) => {

    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
/**
 * For all Dish Id's - Iplementing HTTP communication protocol methods using express
 */
dishRouter.route('/:dishId')

.get((req, res, next) => {

    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /dishes ' 
    + req.params.dishId);
})

.put((req, res, next) => {

    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body 
    }, {new: true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req, res, next) => {

    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;