//Router
const express = require('express');
const router = express.Router();
exports.router = router;

//Sesión
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Cliente rest para hacer peticiones
const restify = require('restify');
const client = restify.createJsonClient({
    url: 'http://localhost:8888',
    version: '*'
});

//Utilidades
const util = require('util');

//le mandamos la página donde puede registrarse o loguearse
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login Screen', messages: req.flash('loginMessage') });
});

//cuando el cliente nos manda el formulario de login, usamos passport para autenticarlo
router.post('/login/send', passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: '/users/login',
        failureFlash: true
    })
);

//cuando el cliente nos manda el formulario de registro, llamamos a la api de crear usuario
router.post('/login/register', function(req, res, next){
    client.post('/api/users/insert', {
        "username" : req.body.username,
        "password" : req.body.password,
        "provider" : "local",
        "familyName" : req.body.familyName,
        "middleName" : req.body.middleName,
        "emails" : [req.body.email],
        "photos" : []
    }, (err, req, response, obj) =>{
        if(obj === 'OK'){
            res.redirect('/');
        }else{
            res.redirect('/users/login');
        }
    });   
});

//salir de la sesión
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//Passport
exports.initPassport = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
};

//Función que se usará en otros Routes para comprobar que el usuario haya iniciado sesión
exports.ensureAuthenticated = function(req, res, next) {
  // req.user is set by Passport in the deserialize function
  if (req.user) next();
  else res.redirect('/users/login');
};

//Passport usará la estrategia local, es decir usando el usuario y la contraseña lo atenticaremos en nuestro propio servidor
passport.use(new LocalStrategy({ 
        passReqToCallback : true
    }, function(request, username, password, cb) {
    //hacer una petición a la api de logueo
    client.post('/api/users/login', {
        "username" : username,
        "password" : password
    }, (err, req, res, user) => {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false, request.flash('loginMessage', 'Something its wrong')); }
        //sino viene el usuario, tenemos que mostrar el mensaje de error
        if (user.username === undefined) { 
            return cb(null, false, request.flash('loginMessage', user)); 
        }
        return cb(null, user);
    });
}));

//metodo necesario para iniciar sesión en passport
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

//metodo necesario para cerrar sesión en passport
passport.deserializeUser(function(user, done) {
  done(null, user);
});