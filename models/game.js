'use strict';

module.exports = class Game {
    constructor(users) {
        this.users = users;
        this.tablero = ['', '', '', '', '', '', '', '', ''];
        this.turno = 0;
    };
    
    getUser(){
        return this.users[0];
    }
    
    getRival(){
        return this.users[1];
    }
    
    getTurno(){
        return this.turno;
    }
    
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
    
    next(position, symbol){
        //poner la ficha
        this.tablero[position]=symbol;
        this.turno++;
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
    };

    //a partir del turno 5 es cuando se empieza a llamar a la función
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
    
    bot(){
        if(this.turno<8){
            //hasta que no se cree el script, que te genere un número aleatorio
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