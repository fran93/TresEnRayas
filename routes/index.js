const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const util = require('util');

router.get('/', usersRouter.ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Home', user: req.user });
});

module.exports = router;

module.exports.socketio = function(io) {
    var users = [];
    var mapUsers = {};
    //namespace
    var nsp = io.of('/home');
    
    nsp.on('connection', function(socket){
        //añadirlo al array de usuarios
        users.push(socket.request.user);
        //Obtener el id
        mapUsers[socket.request.user] = socket.id;
        //mandar la lista de usuarios
        nsp.emit('usersList', users);
        
        socket.on('disconnect', function(){
            //borrar al usuario
            users.splice(users.indexOf(socket.request.user), 1);
            delete mapUsers[socket.request.user];
            //mandar la lista de usuarios
            nsp.emit('usersList', users);
            //resetear cosas del cliente
        });
        
        socket.on('challenge', function(user){
            nsp.to(mapUsers[user]).emit('challenge', socket.request.user);
        });
        
        socket.on('responseChallenge', function(json){
            if(json.accepted){
                nsp.to(mapUsers[json.user]).emit('responseChallenge', {rival: socket.request.user, accepted: true});
            }else{
                nsp.to(mapUsers[json.user]).emit('responseChallenge', {accepted: false});
            }
        });
    });
};