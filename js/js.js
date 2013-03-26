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

function checkRegexp(o, regexp, n) 
{
    if (!( regexp.test(o.val()) )) {
        o.addClass("ui-state-error");
        updateTips(n);
        return false;
    } else {
        return true;
    }
}

var allFields = $( [] ).add( $( "#name" ) ).add( $( "#email" ) ).add( $( "#form_content" ) );

function updateTips(msg)
{
    var $tips = $( ".validateTips" );
    $tips.text(msg).addClass("ui-state-highlight");
    setTimeout(function() {
        $tips.removeClass("ui-state-highlight", 1500);
    }, 500);
}

function clearDialogContactElems()
{
    $(".validateTips").html("");
    allFields.val("").removeClass("ui-state-error");    
}

$("#dialog-contact").dialog({
    autoOpen : false,
    width : 500,
    modal : true,
    buttons : {
        "Submit" : function() {
            var $email = $( "#email" );
            var $formContent = $("#form_content");
            
            // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
            var bValid = true;
            bValid = bValid && checkRegexp($email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "Not valid email (eg. j.smith@abc.com)");
      
            if (bValid && $formContent.val().length === 0 ) {
                updateTips("Please enter your comments.");
                $formContent.addClass("ui-state-error");
                bValid = false;
            }
            
            if (bValid) {
                clearDialogContactElems();
                sendComments($("#name").val(), $email.val(), $formContent.val());               
            }
        },
        Cancel : function() {
            clearDialogContactElems();
            $(this).dialog("close");
        }
    },
    close : function() {
        clearDialogContactElems();
    }
});

$("#report").click(function(event) {
    event.preventDefault();
    $("#dialog-contact").dialog("open");
});

function sendComments(name, email, comments)
{
    
}
