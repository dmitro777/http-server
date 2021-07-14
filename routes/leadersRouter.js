/**
 * Leaders Router
 */
const express = require('express');
const leadersRouter = express.Router();
const cors = require('./cors');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');
leadersRouter.use(express.json());
/**
 * GET all Leaders
 */
leadersRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {
    // find() provided by mongoose
    Leaders.find({})
    .then((leaders) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // create() provided by mongoose
    Leaders.create(req.body)
    .then((leader) => {

        console.log('Leader created! ', leader);
        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /leaders');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // remove() provided by mongoose
    Leaders.remove({})
    .then((resp) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
/**
 * For all Leaders Id's
 */
 leadersRouter.route('/:leaderId')

 .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
 
.get(cors.cors, (req, res, next) => {
    // findById() provided by mongoose
    Leaders.findById(req.params.leaderId)
    .then((leader) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
 
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
 
    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /leaders/' 
    + req.params.leaderId);
})
 
.put(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // findByIdAndUpdate() provided by mongoose
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body 
    }, {new: true})
    .then((leaders) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, 
    (req, res, next) => {
    // findByIdAndRemove() provided by mongoose
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leadersRouter;