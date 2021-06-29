const express = require('express');
const leadersRouter = express.Router();

leadersRouter.use(express.json());

/**
 * For all Leaders - Iplementing HTTP communication protocol methods using express
 */
 leadersRouter.route('/')
.all((req, res, next) => {
    
    res.statusCode = 200; // Ok
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {

    res.end('We will send all leaders to you!');
})

.post((req, res, next) => {

    res.end('We will add the leader: ' + req.body.name 
    + ' with details: ' + req.body.description);
})

.put((req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /leaders');
})

.delete((req, res, next) => {

    res.end('Deliting all leaders.');
});

/**
 * For all Leaders Id's - Iplementing HTTP communication protocol methods using express
 */
 leadersRouter.route('/:leaderId')
 .all((req, res, next) => {
     
     res.statusCode = 200; // Ok
     res.setHeader('Content-Type', 'text/plain');
     next();
 })
 
 .get((req, res, next) => {
 
    res.end('We will send the details of the leader: '
    + req.params.leaderId + ' to you!');
 })
 
 .post((req, res, next) => {
 
    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /leaders ' 
    + req.params.leaderId);
 })
 
 .put((req, res, next) => {

    res.write('Updating leader: ' + req.params.leaderId + '\n');
    res.end('We will update the leader: ' + req.body.name 
    + ' with details: ' + req.body.description);
 })
 
 .delete((req, res, next) => {
 
    res.end('Deliting leader: ' + req.params.leaderId);
 });

 module.exports = leadersRouter;