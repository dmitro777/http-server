const express = require('express');
const cors = require('cors'); // Cross-origin resource sharing
const app = express();

const whiteList = ['http://localhost:3000', 'https://localhost:3443'];

const corsOptionsDelegate = (req, callback) => {

    var corsOptions;
    // checking for presence of 'Origin' in the array by index
    if (whiteList.indexOf(req.header('Origin')) != -1) {
        corsOptions = {origin: true};
    }
    else {
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);