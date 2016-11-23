const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const util = require('util');
const statistics = require('../models/statistics');

router.get('/', usersRouter.ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Home', user: req.user });
});

module.exports = router;

module.exports.socketio = function(io) {
    //hash map que guarda el nombre del usuario y el estado del jugador
    var users = {};
    //hash map para guardar los ids de cada usuarios
    var mapUsers = {};
    //hash map para los retos pendientes
    var challenge = {};
    //namespace
    var nsp = io.of('/home');
    
    nsp.on('connection', function(socket){
        //añadirlo al array de usuarios
        users[socket.request.user]='listo';
        //Obtener el id
        mapUsers[socket.request.user] = socket.id;
        //mandar la lista de usuarios
        nsp.emit('usersList', users);
        
        socket.on('disconnect', function(){
            //resetear el estado del usuario que espera una respuesta
            users[challenge[socket.request.user]]='listo';
            nsp.to(mapUsers[challenge[socket.request.user]]).emit('resetState');
            //borrar al usuario
            delete users[socket.request.user];
            delete mapUsers[socket.request.user];
            delete challenge[challenge[socket.request.user]];
            delete challenge[socket.request.user];
            //mandar la lista de usuarios
            nsp.emit('usersList', users);
        });
        
        socket.on('challenge', function(user){
            //cambiar los estados
            users[socket.request.user]='esperando';
            users[user]='retado';
            //añdir en retos pendientes
            challenge[socket.request.user]=user;
            challenge[user]=socket.request.user;
            //actualizar la lista de los usuarios
            nsp.emit('usersList', users);            
            //mandar el reto
            nsp.to(mapUsers[user]).emit('challenge', socket.request.user);
        });
        
        socket.on('responseChallenge', function(json){
            if(json.accepted){
                nsp.to(mapUsers[json.user]).emit('responseChallenge', {rival: socket.request.user, accepted: true});
            }else{
                //cambiar los estados
                users[socket.request.user]='listo';
                users[json.user]='listo';
                //actualizar la lista de los usuarios
                nsp.emit('usersList', users);
                //enviar la respuesta
                nsp.to(mapUsers[json.user]).emit('responseChallenge', {accepted: false});
            }
            //eliminar de retos pendientes
        });
        
        socket.on('statistics', function(player){
            statistics.getStatistics(player).then( result =>{
                socket.emit('statistics', result[0]);
            }).catch (err =>{
                console.log('Error al obtener las estadísticas' +util.inspect(err));
            }); ;
        });
    });
};