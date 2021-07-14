/**
 * File upload router
 */
const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({

destination: (req, file, cb) => {
    cb(null, 'public/images');
},

filename: (req, file, cb) => {
    cb(null, file.originalname);
}
});

const imageFileFilter = (req, file, cb) => {

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {

    return cb(new Error('You can upload only image files!'), false);
    }

    cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(express.json());
/**
 * Operations on file upload
 */
uploadRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('GET operation not suported on imageUpload.');
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    upload.single('imageFile'), (req, res) => {

        res.statusCode = 200; // ok
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})

.put(cors.corsWithOptions, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('PUT operation not suported on imageUpload.');
})

.delete(cors.corsWithOptions, (req, res, next) => {

    res.statusCode = 403; // operation not suported
    res.end('DELETE operation not suported on imageUpload.');
});

module.exports = uploadRouter;