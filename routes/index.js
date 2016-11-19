const express = require('express');
const router = express.Router();
const util = require('util');

const usersRouter = require('./users');

router.get('/', usersRouter.ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Home', user: req.user });
});

module.exports = router;

module.exports.socketio = function(io) {
    var users = [];
    
    io.on('connection', function(socket){
        //añadirlo al array de usuarios
        users.push(socket.request.user);
        //mandar la lista de usuarios
        io.emit('usersList', users);
        
        socket.on('disconnect', function(){
            users.splice(users.indexOf(socket.request.user), 1);
            //mandar la lista de usuarios
            io.emit('usersList', users);
        });
    });
};