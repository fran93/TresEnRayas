//Router
const express = require('express');
const router = express.Router();
exports.router = router;
const Game = require('../models/game');

//sesiones
const usersRouter = require('./users');

//Solo se le manda al usuario la vista del tablero, el resto se hace con socket.io
router.get('/', usersRouter.ensureAuthenticated, function(req, res, next) {
    res.render('bot', { title: 'Tablero bot', user: req.user });
});

module.exports.socketio = function(io) {
    var games = {};
    //namespace
    var nsp = io.of('/bot');
    
    //Si se desconecta un usuario que se acabe la partida
    nsp.on('connection', function(socket){
        
        //El cliente nos manda la posición a la que ha movido
        socket.on('next', function(json){
            var state = games[socket.request.user].next(json.position, json.symbol);
            if(state==='next'){
                //le mandamos la posición que a la que el bot ha movido
                socket.emit('next', games[socket.request.user].bot());
                //comprobamos si ha ganado o no
                state = games[socket.request.user].nextBot();
            }else{
                //borrar el juego
                delete games[socket.request.user];
            }
            //comprobar el tipo de final
            if(state!=='next'){
                if(state==='o'){
                    socket.emit('end', 'o');
                }else if(state==='x'){
                    socket.emit('end', 'x');
                }else if(state==='tables'){
                    socket.emit('end', 'tables');
                }
            }
        });
        
        //Cuando el usuario quiere empezar un nuevo juego, creamos el objeto juego y lo guardamos en un hashmap, con el nombre de usuario como key
        socket.on('newGame', function(){
            if(socket.request.user in games){
                delete games[socket.request.user];
            }
            games[socket.request.user] = new Game(socket.request.user);
        });
        
        //Si el usuario se desconecta sin terminar la partida, borramos el juego
        socket.on('disconnect', function(){
            if(socket.request.user in games) delete games[socket.request.user];
        });
    });
};