var socket = io();
var end = false;

$( document ).ready(function() {
    socket.emit('newGame');
    
    $('div.square').click(function(){
        //comprobar que no le hayamos añadido nada anteriormente
        if($(this).children().length === 0 && !end){
            //obtener la posición
            var row = $(this).parent().parent().index();
            var column = $(this).index();
            var index = 0;
            switch(row){
                case 0:
                    index = column;
                break;
                case 1:
                    index = column + 3;
                break;
                case 2:
                    index = column + 6;
                break;
            }

            $(this).append("<div class='cross'> </div>");
            $(this).children().hide().fadeIn('slow');
            //mandar al servidor el movimiento
            socket.emit( 'next', { position : index, symbol: 'x' } );
        }
    });
    
    socket.on('next', function(pos){
        var selector = "";
        switch(pos){
            case 0: case 1: case 2:
                selector = $('.row:eq(0) .square:eq('+pos+')');
            break;
            case 3: case 4: case 5:
                 selector = $('.row:eq(1) .square:eq('+(pos-3)+')');
            break;
            case 6: case 7: case 8:
                 selector = $('.row:eq(2) .square:eq('+(pos-6)+')');
            break;
        };
        $(selector).append("<div class='circle'> </div>");
        $(selector).children().hide().fadeIn('slow');
    });
    
    socket.on('end', function(ending){
        console.log();
        end=true;
        switch(ending){
            case 'x':
                $('body').append("<div class='alert alert-success' role='alert'> Felicidades! Has vencido al bot!</div>");
            break;
            case 'o':
                $('body').append("<div class='alert alert-danger' role='alert'> Has sido derrotado por mi bot!</div>");
            break;
            case 'tables':
                $('body').append("<div class='alert alert-info' role='alert'> Empate!</div>");
            break;
        }
    });
});