$("#about").click( function (event) {
    event.preventDefault();
    $("#dialog" ).dialog({
      modal: true,
      draggable: false,
      resizable: false,
      width: 800
    });
});