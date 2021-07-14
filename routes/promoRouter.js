/**
 * Promotions Router
 */
const express = require('express');
const promoRouter = express.Router();
const cors = require('./cors');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');
promoRouter.use(express.json());
/**
 * GET all Promotions
 */
promoRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {
    // find() provided by mongoose
    Promotions.find({})
    .then((promotions) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // create() provided by mongoose
    Promotions.create(req.body)
    .then((promotion) => {

        console.log('Promotion created! ', promotion);
        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /promotions');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // remove() provided by mongoose
    Promotions.remove({})
    .then((resp) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
/**
 * For all Promotion Id's
 */
promoRouter.route('/:promoId')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
 
 .get(cors.cors, (req, res, next) => {
    // findById() provided by mongoose
    Promotions.findById(req.params.promoId)
    .then((promotion) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
 })
 
 .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
 
    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /promotions ' 
    + req.params.promoId);
 })
 
 .put(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // findByIdAndUpdate() provided by mongoose
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body 
    }, {new: true})
    .then((promotion) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
 })
 
 .delete(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // findByIdAndRemove() provided by mongoose
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
 });

 module.exports = promoRouter;