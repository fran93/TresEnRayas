function loginUp(){
    $(document).ready( function(){
        $('#email').attr( "type", "email" ).attr("placeholder", "Email");
        $('#middleName').attr( "type", "text" ).attr("placeholder", "Middle name");
        $('#familyName').attr( "type", "text" ).attr("placeholder", "Family name");
        $('button:eq(0)').text('Register');
        $('button:eq(1)').text('Sign in').attr("onClick", "loginDown()");;
        $('form').attr("action", "/users/login/register");
        $('form h2').text('Please register in');
     });
};

function loginDown(){
    $(document).ready( function(){
        $('#email').attr( "type", "hidden" ).removeAttr("placeholder");
        $('#middleName').attr( "type", "hidden" ).removeAttr("placeholder");
        $('#familyName').attr( "type", "hidden" ).removeAttr("placeholder");
        $('button:eq(0)').text('Sign in');
        $('button:eq(1)').text('Register').attr("onClick", "loginUp()");
        $('form').attr("action", "/users/login/send");
        $('form h2').text('Please login in');
    });
};
    