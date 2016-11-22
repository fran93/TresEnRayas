//Router
const express = require('express');
const router = express.Router();
exports.router = router;
const Game = require('../models/game');

//sesiones
const usersRouter = require('./users');

router.get('/', usersRouter.ensureAuthenticated, function(req, res, next) {
    res.render('tablero', { title: 'Tablero', user: req.user, rival: req.query.rival });
});

module.exports.socketio = function(io) {
    var users = [];
    var mapUsers = {};
    var games = {};
    //namespace
    var nsp = io.of('/tablero'); 
    
    nsp.on('connection', function(socket){
        //añadirlo al array de usuarios
        users.push(socket.request.user);
        //Obtener el id
        mapUsers[socket.request.user] = socket.id;  
        
        socket.on('disconnect', function(){
            //borrar al usuario
            users.splice(users.indexOf(socket.request.user), 1);
            delete mapUsers[socket.request.user];
        });
        
        socket.on('newGame', function(rival){
            //comprobar que el rival no ha creado ya el juego
            if(rival in games){
                //si lo ha creado nos unimos
                if(games[rival].getTurno()==0){
                    //start game
                    socket.emit('startGame', rival);
                    nsp.to(mapUsers[rival]).emit('startGame', rival);
                }else{
                    //borrar el juego del rival
                    delete games[rival];
                    //en caso contrario lo creamos nosotros
                    games[socket.request.user] = new Game([socket.request.user, rival]);
                }  
            }else{
                //en caso contrario lo creamos nosotros
                games[socket.request.user] = new Game([socket.request.user, rival]);
            }            
        });
        
        socket.on('next', function(json){
            //obtener el estado del juego
            var state = games[json.game].next(json.position, json.symbol);
            //obtener el id de tu oponente
            var rival = games[json.game].getUser()===socket.request.user ? games[json.game].getRival() : games[json.game].getUser();
            //mandarle tu movimiento a tu oponente
            nsp.to(mapUsers[rival]).emit('next', json.position);
            //comprobar el tipo de final
            if(state!=='next'){
                if(state==='o'){
                    socket.emit('end', 'o');
                    nsp.to(mapUsers[rival]).emit('end', 'o');
                }else if(state==='x'){
                    socket.emit('end', 'x');
                     nsp.to(mapUsers[rival]).emit('end', 'x');
                }else if(state==='tables'){
                    socket.emit('end', 'tables');
                     nsp.to(mapUsers[rival]).emit('end', 'tables');
                }
                //borrar el juego
                delete games[json.game];
            }
        });
        
        //Chat entre los dos jugadores 
        socket.on('message', function(json){
            nsp.to(mapUsers[json.rival]).emit('message', json.message);
        });
    });
};