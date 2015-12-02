'use strict';

exports.init = function(req, res, next) {
    res.render('index', {
        rel: req.query.rel
    });
};