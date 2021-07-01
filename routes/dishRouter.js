const express = require('express');
const dishRouter = express.Router();
// const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
// bodyParser.json() depricated, using expess.json()
dishRouter.use(express.json());
/**
 * For all Dishes
 */
dishRouter.route('/')

.get((req, res, next) => {
    // find() provided by mongoose
    Dishes.find({})
    .then((dishes) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    // create() provided by mongoose
    Dishes.create(req.body)
    .then((dish) => {

        console.log('Dish created! ', dish);
        res.statusCode = 200; // ok
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
    // remove() provided by mongoose
    Dishes.remove({})
    .then((resp) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
/**
 * For all Dish Id's
 */
dishRouter.route('/:dishId')

.get((req, res, next) => {
    // findById() provided by mongoose
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /dishes/' 
    + req.params.dishId);
})

.put((req, res, next) => {
    // findByIdAndUpdate() provided by mongoose
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body 
    }, {new: true})
    .then((dish) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req, res, next) => {
    // findByIdAndRemove() provided by mongoose
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
/**
 * For all Comments
 */
 dishRouter.route('/:dishId/comments')

 .get((req, res, next) => {
     // find() provided by mongoose
     Dishes.findById(req.params.dishId)
     .then((dish) => {

        if (dish != null) {
            res.statusCode = 200; // ok
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish: ' + req.params.dishId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }

     }, (err) => next(err))
     .catch((err) => next(err));
 })
 
 .post((req, res, next) => {
     // findById() provided by mongoose
     Dishes.findById(req.params.dishId)
     .then((dish) => {

        if (dish != null) {
            // function push() depricated, using instead addToSet() to add a sub-document
            dish.comments.addToSet(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish: ' + req.params.dishId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }

     }, (err) => next(err))
     .catch((err) => next(err));
 })
 
 .put((req, res, next) => {
 
     res.statusCode = 403; // operation not suported
     res.end('PUT operation not suported on /dishes/' 
     + req.params.dishId + '/comments');
 })
 
 .delete((req, res, next) => {
    // findById() provided by mongoose
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i-- ) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save() // save() provided by mongoose
            .then((dish) => {
                res.statusCode = 200; // ok
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish: ' + req.params.dishId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }

     }, (err) => next(err))
     .catch((err) => next(err));
 });
 /**
  * For all Comments Id's
  */
 dishRouter.route('/:dishId/comments/:commentId')
 
 .get((req, res, next) => {
    // findById() provided by mongoose
     Dishes.findById(req.params.dishId)
     .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200; // ok
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish: ' + req.params.dishId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }
        else {
            err = new Error('Comment: ' + req.params.commentId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }

     }, (err) => next(err))
     .catch((err) => next(err));
 })
 
 .post((req, res, next) => {
 
     res.statusCode = 403; // operation not suported
     res.end('POST operation not suported on /dishes/' 
     + req.params.dishId + '/comments/' + req.params.commentId);
 })
 
 .put((req, res, next) => {
    // findById() provided by mongoose
    Dishes.findById(req.params.dishId)
    .then((dish) => {
       if (dish != null && dish.comments.id(req.params.commentId) != null) {
           
           if (req.body.rating) {
                // updating a sub-document 'rating of comment'
                dish.comments.id(req.params.commentId).rating = req.body.rating;

           }
           if (req.body.comment) {
                // updating a sub-document 'comment of dish'
                dish.comments.id(req.params.commentId).comment = req.body.comment;
           }

           dish.save() // save() provided by mongoose
           .then((dish) => {
               res.statusCode = 200; // ok
               res.setHeader('Content-Type', 'application/json');
               res.json(dish.comments);
           }, (err) => next(err));
       }
       else if (dish == null) {
           err = new Error('Dish: ' + req.params.dishId + ' not found.');
           err.statusCode = 404; // not found
           return next(err);
       }
       else {
           err = new Error('Comment: ' + req.params.commentId + ' not found.');
           err.statusCode = 404; // not found
           return next(err);
       }

    }, (err) => next(err))
     .catch((err) => next(err));
 })
 
 .delete((req, res, next) => {
    // findById() provided by mongoose
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            
            dish.comments.id(req.params.commentId).remove();
            dish.save() // save() provided by mongoose
            .then((dish) => {
                res.statusCode = 200; // ok
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish: ' + req.params.dishId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }
        else {
            err = new Error('Comment: ' + req.params.commentId + ' not found.');
            err.statusCode = 404; // not found
            return next(err);
        }

     }, (err) => next(err))
     .catch((err) => next(err));
 });

module.exports = dishRouter;