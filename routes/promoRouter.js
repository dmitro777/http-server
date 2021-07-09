/**
 * Promotions Router
 */
const express = require('express');
const promoRouter = express.Router();
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');
promoRouter.use(express.json());
/**
 * GET all Promotions
 */
promoRouter.route('/')

.get((req, res, next) => {
    // find() provided by mongoose
    Promotions.find({})
    .then((promotions) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, 
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

.put((req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /promotions');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, 
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
 
 .get((req, res, next) => {
    // findById() provided by mongoose
    Promotions.findById(req.params.promoId)
    .then((promotion) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
 })
 
 .post((req, res, next) => {
 
    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /promotions ' 
    + req.params.promoId);
 })
 
 .put(authenticate.verifyUser, authenticate.verifyAdmin, 
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
 
 .delete(authenticate.verifyUser, authenticate.verifyAdmin, 
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