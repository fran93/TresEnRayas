//Router
const express = require('express');
const router = express.Router();
exports.router = router;
const Game = require('../models/game');

//sesiones
const usersRouter = require('./users');

router.get('/', usersRouter.ensureAuthenticated, function(req, res, next) {
    console.log('Rival: '+req.query.rival);
    res.render('tablero', { title: 'Tablero', user: req.user, rival: req.query.rival });
});

module.exports.socketio = function(io) {
    var users = [];
    var mapUsers = {};
    //namespace
    var nsp = io.of('/tablero');    
};