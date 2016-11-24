# El clásico juego del tres en rayas en node.js. 

-Para jugar tienes que registrarte y loguearte localmente. <br />
-Tiene pantalla de lobby donde poder retar a otros jugadores. <br />
-Si te retas a ti mismo puedes jugar contra un bot. <br />
-Al finalizar la partida se guardan el resultado en MongoDB, para que más tarde 
puedas consultas las estadísticas de dicho jugador.  <br />

# Instalación:
npm install  <br />
./node_modules/bower/bin/bower init <br />
./node_modules/bower/bin/bower install bootstrap <br />

#Para que los usuarios puedan autenticarse, necesitarás este proyecto.
https://github.com/fran93/User-Authenticate-Server

#Debes de tener una base de datos llamada data en mongoDB para las estadísticas
mongod --dbpath data

# Iniciar el servidor
node ./app

# Tecnologías usadas:
-Node.js <br />
-Passport.js <br />
-Bootstrap <br />
-Jquery <br />
-MongoDB <br />
-Restify <br />
-Express.js <br />
-Socket.io <br />
-Ejs <br />
-Bower <br />



