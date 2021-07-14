/**
 * Dish Router
 */
const express = require('express');
const dishRouter = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');
dishRouter.use(express.json());
/**
 * GET all Dishes
 */
dishRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {
    // find() provided by mongoose
    Dishes.find({})
    .then((dishes) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    (req, res, next) => {
    
        // create() provided by mongoose
        Dishes.create(req.body)
        .then((dish) => {

            console.log('Dish created! ', dish);
            res.statusCode = 200; // ok
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        },(err) => next(err))
    .catch((err) => next(err));    
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on /dishes');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    (req, res, next) => {
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

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {
    // findById() provided by mongoose
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /dishes/' 
    + req.params.dishId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, (req, res, next) => {
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

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, (req, res, next) => {
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

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {
// find() provided by mongoose
Dishes.findById(req.params.dishId)
.populate('comments.author') 
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

.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
// findById() provided by mongoose
Dishes.findById(req.params.dishId)
.then((dish) => {

    if (dish != null) {

        req.body.author = req.user._id; 
        dish.comments.addToSet(req.body);
        dish.save()
        .then((dish) => {

            Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })                
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

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

res.statusCode = 403; // operation not suported
res.end('PUT operation not suported on /dishes/' 
+ req.params.dishId + '/comments');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    authenticate.verifyAdmin, (req, res, next) => {
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

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {
// findById() provided by mongoose
Dishes.findById(req.params.dishId)
.populate('comments.author')
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

.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('POST operation not suported on /dishes/' 
    + req.params.dishId + '/comments/' + req.params.commentId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
// findById() provided by mongoose
Dishes.findById(req.params.dishId)
.then((dish) => {
    
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
    
        if (req.user._id.equals(dish.comments.id(req.params.commentId).author)) {

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
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                        res.statusCode = 200; // ok
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish.comments);
                    })
            }, (err) => next(err));
        }
        else {
            err = new Error('You are not authorized to update this comment.');
            err.statusCode = 403; // not found
            return next(err);
        }
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

.delete(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
// findById() provided by mongoose
Dishes.findById(req.params.dishId)
.then((dish) => {

    if (dish != null && dish.comments.id(req.params.commentId) != null) {
        
        if (req.user._id.equals(dish.comments.id(req.params.commentId).author)) {   
            
            dish.comments.id(req.params.commentId).remove();
            dish.save() // save() provided by mongoose
            .then((dish) => {
                Dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish) => {
                    res.statusCode = 200; // ok
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                })
            }, (err) => next(err))
        }
        else {
            err = new Error('You are not authorized to delete this comment.');
            err.statusCode = 403; // not found
            return next(err);
        }
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