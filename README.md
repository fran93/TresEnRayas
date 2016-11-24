# El clásico juego del tres en rayas en node.js. 

-Para jugar tienes que registrarte y loguearte localmente.
-Tiene pantalla de lobby donde poder retar a otros jugadores.
-Si te retas a ti mismo puedes jugar contra un bot.
-Al finalizar la partida se guardan el resultado en MongoDB, para que más tarde
puedas consultas las estadísticas de dicho jugador. 

# Instalación:
npm install 
./node_modules/bower/bin/bower init
./node_modules/bower/bin/bower install bootstrap

#Para que los usuarios puedan autenticarse, necesitarás este proyecto.
https://github.com/fran93/User-Authenticate-Server

#Debes de tener una base de datos llamada data en mongoDB para las estadísticas
mongod --dbpath data

# Iniciar el servidor
node ./app

# Tecnologías usadas:
-Node.js
-Passport.js
-Bootstrap
-Jquery
-MongoDB
-Restify
-Express.js
-Socket.io
-Ejs
-Bower



