'use strict';

/**
 * Clase para jugar al tres en raya. 
 */
module.exports = class Game {
    /**
     * Constructor por defecto que inicializa el juego.
     * @param [] users Array de usuarios con el usuario que ha empezado el juego y el rival.
     */
    constructor(users) {
        this.users = users;
        this.tablero = ['', '', '', '', '', '', '', '', ''];
        this.turno = 0;
    };
    
    /**
     * Obtiene el usuario que ha empezado la partida.
     * @return String usuario
     */
    getUser(){
        return this.users[0];
    }
    
    /**
     * Obtiene el rival del usuario que ha empezado la partida.
     * @return String usuario
     */
    getRival(){
        return this.users[1];
    }
    
    /**
     * Obtiene el turno actual de la partida
     * @return int turno
     */
    getTurno(){
        return this.turno;
    }
    
    /**
     * Comprueba si el bot ha ganado la partida, solo se usa cuando juegas contra el bot.
     * @return String Devuelve si la partida continua o si ha terminado y el resultado.
     */
    nextBot(){
        //comprobar si se ha ganado
        if(this.turno>4){
            var v = this.victory();
            if(this.turno<9){
                if(v==='tables'){
                    return 'next';
                }else{
                    return v;
                }
            }else{
                return v;
            }
        }else{
            return 'next';
        }
    }
    
    /**
     * Comprueba si algún usuario ha ganado la partida y avanza un turno añadiendo el movimiento realizado por el usuario
     * @param int position Posición del movimiento
     * @param String symbol La forma de las fichas que usa el jugador que ha movido.
     * @return String Devuelve si la partida continua o si ha terminado y el resultado.
     */
    next(position, symbol){
        //poner la ficha
        this.tablero[position]=symbol;
        this.turno++;
        //comprobar si se ha ganado a partir del turno 5, que es el mínimo de movimientos para ganar. 
        if(this.turno>4){
            var v = this.victory();
            if(this.turno<9){
                if(v==='tables'){
                    return 'next';
                }else{
                    return v;
                }
            }else{
                return v;
            }
        }else{
            return 'next';
        }
    };

    /**
     * Comprueba si alguien ha ganado la partida.
     * @return String devuelve tables sino ha ganado nadie, en caso contrario devuelve el símbolo de quien ha ganado.
     */
    victory(){
        var result = 'tables';
        var victory = this.victoriaDiagonal();
        if(victory===null){
            victory = this.victoriaHorizontal();
            if(victory===null){
                victory = this.victoriaVertical();
            }
        }
        //si alguna línea ha ganado 
        if(victory!==null){
            result = victory;
        }

        return result;
    }
    
    /**
     * Comprueba las posiciones diagonales de las fichas del tablero, para ver si hay 3 símbolos iguales.
     * @return String Devuel null si no hay 3 símbolos iguales en caso contrario devuelve el símbolo.
     */
    victoriaDiagonal(){
        var ganador = null;
        //diagonal 0
        if(this.tablero[0].length>0 && this.tablero[0] === this.tablero[4] && this.tablero[4] === this.tablero[8]){
            ganador = this.tablero[0];
        }
        //diagonal 1
        if(this.tablero[2].length>0 && this.tablero[2] === this.tablero[4] && this.tablero[4] === this.tablero[6]){
            ganador = this.tablero[2];
        }    
        return ganador;
    }
    
    /**
     * Comprueba las posiciones horizontales de las fichas del tablero, para ver si hay 3 símbolos iguales.
     * @return String Devuel null si no hay 3 símbolos iguales en caso contrario devuelve el símbolo.
     */
    victoriaHorizontal(){
        var ganador = null;
         //fila 0
        if(this.tablero[0].length>0 && this.tablero[0] === this.tablero[1] && this.tablero[1] === this.tablero[2]){
            ganador = this.tablero[0];
        }
        //fila 1
        else if(this.tablero[3].length>0 && this.tablero[3] === this.tablero[4] && this.tablero[4] === this.tablero[5]){
            ganador = this.tablero[3];
        }    
        //fila 2
        else if(this.tablero[6].length>0 && this.tablero[6] === this.tablero[7] && this.tablero[7] === this.tablero[8]){
            ganador = this.tablero[6];
        }   
        return ganador;

    }

    /**
     * Comprueba las posiciones verticales de las fichas del tablero, para ver si hay 3 símbolos iguales.
     * @return String Devuel null si no hay 3 símbolos iguales en caso contrario devuelve el símbolo.
     */
    victoriaVertical(){
        var ganador = null;
        //columna 0
        if(this.tablero[0].length>0 && this.tablero[0] === this.tablero[3] && this.tablero[3] === this.tablero[6]){
            ganador = this.tablero[0];
        }
        //columna 1
        if(this.tablero[1].length>0 && this.tablero[1] === this.tablero[4] && this.tablero[4] === this.tablero[7]){
            ganador = this.tablero[1];
        }    
        //columna 2
        if(this.tablero[2].length>0 && this.tablero[2] === this.tablero[5] && this.tablero[5] === this.tablero[8]){
            ganador = this.tablero[2];
        }
        return ganador;
    }
    
    /**
     * El bot mueve a una casilla aleatoria entre las que hay disponibles, en futuras versiones tendŕa una verdadera IA.
     * @return int posicion Devuelve null si ya no hay más posiciones libres en caso contrario devuelve la posición
     */
    bot(){
        if(this.turno<8){
            var random = Math.floor((Math.random() * 9)); 
            while(this.tablero[random]!==''){
                random = Math.floor((Math.random() * 9)); 
            }
            this.tablero[random]='o';
            this.turno++;
            return random;
        }else{
            return null;
        }
    }
};