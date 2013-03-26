$("#about").click(function(event) {
    event.preventDefault();
    $("#dialog").dialog({
        modal : true,
        draggable : false,
        resizable : false,
        width : 800,
        open : function() {
            $(this).parent().css("top", "200px");
        }
    });
});

function checkLength(o, n, min, max) 
{
    if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");
        o.html("Length of " + n + " must be between " + min + " and " + max + ".");
        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) 
{
    if (!( regexp.test(o.val()) )) {
        o.addClass("ui-state-error");
        o.html(n);
        return false;
    } else {
        return true;
    }
}

var $name = $("#name");
var $email = $( "#email" );
var $formContent = $("#form_content");

var allFields = $( [] ).add( $name ).add( $email ).add( $formContent );

$("#dialog-contact").dialog({
    autoOpen : false,
    width : 500,
    modal : true,
    buttons : {
        "Submit" : function() {
            var bValid = true;
            
            bValid = bValid && checkLength(email, "email", 6, 80);
            // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
            bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com");

            if (bValid) {
                $(this).dialog("close");
            }
        },
        Cancel : function() {
            $(this).dialog("close");
        }
    },
    close : function() {
        allFields.val("").removeClass("ui-state-error");
    }
});

$("#report").click(function(event) {
    event.preventDefault();
    $("#dialog-contact").dialog("open");
});
