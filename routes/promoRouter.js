const express = require('express');
const promoRouter = express.Router();

promoRouter.use(express.json());

/**
 * For all Promotions - Iplementing HTTP communication protocol methods using express
 */
promoRouter.route('/')
.all((req, res, next) => {
    
    res.statusCode = 200; // Ok
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {

    res.end('We will send all the promotions to you!');
})

.post((req, res, next) => {

    res.end('We will add the promotion: ' + req.body.name 
    + ' with details: ' + req.body.description);
})

.put((req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /promotions');
})

.delete((req, res, next) => {

    res.end('Deliting all the promotions.');
});

/**
 * For all Promotion Id's - Iplementing HTTP communication protocol methods using express
 */
 promoRouter.route('/:promoId')
 .all((req, res, next) => {
     
     res.statusCode = 200; // Ok
     res.setHeader('Content-Type', 'text/plain');
     next();
 })
 
 .get((req, res, next) => {
 
    res.end('We will send the details of the promotion: '
    + req.params.promoId + ' to you!');
 })
 
 .post((req, res, next) => {
 
    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /promotions ' 
    + req.params.promoId);
 })
 
 .put((req, res, next) => {

    res.write('Updating promotion: ' + req.params.promoId + '\n');
    res.end('We will update the promotion: ' + req.body.name 
    + ' with details: ' + req.body.description);
 })
 
 .delete((req, res, next) => {
 
    res.end('Deliting promotion: ' + req.params.promoId);
 });

 module.exports = promoRouter;