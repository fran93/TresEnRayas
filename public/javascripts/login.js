//Mostrar el formulario de registro
function loginUp(){
    $(document).ready( function(){
        $('#email').attr( "type", "email" ).attr("placeholder", "Email");
        $('#middleName').attr( "type", "text" ).attr("placeholder", "Segundo nombre");
        $('#familyName').attr( "type", "text" ).attr("placeholder", "Apellidos");
        $('button:eq(0)').text('Registrarse');
        $('button:eq(1)').text('Loguearse').attr("onClick", "loginDown()");;
        $('form').attr("action", "/users/login/register");
        $('form h2').text('Registrate');
     });
};

//Mostrar el formulario de login
function loginDown(){
    $(document).ready( function(){
        $('#email').attr( "type", "hidden" ).removeAttr("placeholder");
        $('#middleName').attr( "type", "hidden" ).removeAttr("placeholder");
        $('#familyName').attr( "type", "hidden" ).removeAttr("placeholder");
        $('button:eq(0)').text('Logueate');
        $('button:eq(1)').text('Registrate').attr("onClick", "loginUp()");
        $('form').attr("action", "/users/login/send");
        $('form h2').text('Logueate');
    });
};
    