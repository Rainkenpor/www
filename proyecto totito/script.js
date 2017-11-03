var turno=1
$(document).ready(function() {
  // posiciones de ubicacion
  $('.table-totito td').click(function(event) {
    if (!$(this).hasClass('bloqueo')){
      $(this).attr({turno:turno});
      if (turno==1){
        $(this).html('<span class=" icon-cancel" ></span>');
        turno=2;
      }else{
        $(this).html('<span class="icon-circle-empty"></span>');
        turno=1;
      }
      $(this).addClass('bloqueo');

      validando_ganador();
    }
  });
});



function validando_ganador(){
  $('.table-totito tr').each(function(index, el) {
    $(this).children('td').each(function(index, el) {
      console.log($(el).attr('turno'));
    });
  });
}
