function modal(datos){
	if (!datos.nivel) datos.nivel=10;// titulo,id,tipo,tipo_crear,nivel	// nivel indica el z-index
	txt='<div class="fondo-blur" id="'+datos.nivel+'" style="z-index:'+datos.nivel+'">';
	txt+='<div id="contenedor" style="height:'+(glob_alto-100)+'px">';
	txt+='<div class="fondo" style="padding:20px 6px;height:26px;font-size:18px;border-radius:5px 5px 0px 0px;">'+datos.titulo;
  // para indicar favoritos los requisitos son
  //  favorito:1, fav_tipo:'###', fav_id:###, fav_select=1 < si se ha seleccionado como favorito previamente
	if (datos.favorito){
    if (datos.fav_select){
      txt+=	'<span class="favorito icon-star" id="'+datos.fav_id+'" tipo="'+datos.fav_tipo+'" style="float:right"></span>';
    }else{
      txt+=	'<span class="favorito icon-star-empty" id="'+datos.fav_id+'" tipo="'+datos.fav_tipo+'" style="float:right"></span>';
    }
	}
	txt+=	'</div>';
	txt+=	'<div id="data"></div>';
	txt+=	'<div id="opciones">';

  //  para indicar el boton  //  boton_ok:1, boton_ok_tipo:"####", boton_ok_titulo: "######"
	if (datos.boton_ok){
    txt+='<table width="100%" style="border-spacing:0px"><tr><td width="50%">';
    txt+=	'<div class="boton" onclick="modal_cerrar(this);" cerrar="true" style="color:#555">Cerrar</div>';
    txt+='</td><td>';
    txt+=	'<div class="boton" crear="true" onclick="modal_ok(this,'+datos.boton_ok_tipo+');"  style="background-color: #2196F3;color:white; margin-left:5px">'+datos.boton_ok_titulo+'</div>';
    txt+='</td></tr></table>';
  }	else{
    txt+=	'<div class="boton" onclick="modal_cerrar(this);" cerrar="true" style="color:#2196F3">Cerrar</div>';
  }
	txt+=	'</div>';
	txt+=	'</div>';

	txt+=	'</div>';
	$$('body').prepend(txt);
}

function modal_cerrar(elemento){
  vid=$$(elemento).parents('.fondo-blur').attr('id');
  vid=vid.toString();
  // $$(this).parents('.fondo-blur').removeClass('jackInTheBox').removeClass('animated').addClass('fadeOutUp animated');
  // si es un submodal de comentario de curso
  if (intervalos[vid]){
      clearTimeout(intervalos[vid]);
      storage_clear('curso_temascomment_');
      delete intervalos[vid];
  }

  $$(elemento).parents('.fondo-blur').remove();
}


function modal_ok(elemento,tipo){
	if (tipo=='nuevo_tarea'){
		var arr=localStorage.getItem('varios');
		vtitulo=$$('.fondo-blur #contenedor #titulo').val();
		vdescripcion=$$('.fondo-blur #contenedor #descripcion').val();
		vfecha=$$('.fondo-blur #contenedor #modal_fecha').val();
		vfecha= new Date(vfecha);
		vfecha=vfecha.getFullYear() +"-"+(vfecha.getMonth() + 1) + '-' + vfecha.getDate() + '- 00:00:00' ;
		vcurso=JSON.parse(arr)[0].id_curso;

		datos = {opcion:"curso_tarea_nuevo",usuario:Gusuario_id,curso:vcurso,tarea:vtitulo,descripcion:vdescripcion,fecha_finalizacion:vfecha,tipo:2};
		script(datos,function (e){
				$$('.fondo-blur').removeClass('jackInTheBox').removeClass('animated').addClass('fadeOutUp animated');
		});

	}
	if (tipo=='nuevo_tema'){
		var arr=localStorage.getItem('varios');
		vtitulo=$$('.fondo-blur #contenedor #titulo').val();
		vdescripcion=$$('.fondo-blur #contenedor #descripcion').val();
		vfecha=$$('.fondo-blur #contenedor #modal_fecha').val();
		vfecha= new Date(vfecha);
		vfecha=vfecha.getFullYear() +"-"+(vfecha.getMonth() + 1) + '-' + vfecha.getDate() + '- 00:00:00' ;
		vcurso=JSON.parse(arr)[0].id_curso;

		datos = {opcion:"curso_tema_nuevo",usuario:Gusuario_id,curso:vcurso,tema:vtitulo,descripcion:vdescripcion,fecha_habilitacion:vfecha};
		vconsole(datos);
		script(datos,function(e){
			$$('.fondo-blur').removeClass('jackInTheBox').removeClass('animated').addClass('fadeOutUp animated');
		});

	}

}

function modal_enviar(elemento,tipo){
	if (tipo=='tema_comentario'){
		texto=$$(elemento).parent().find('#txt_comentario').val();
		vtema=$$(elemento).attr('id_tema');
		datos = {opcion:"curso_tema_comentario",usuario:Gusuario_id,tema:vtema,comentario:texto};
		script(datos,function(e){
			$$(elemento).parent().find('#txt_comentario').val('');
		});
	}
}

function calendario(id){
	var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto' , 'Septiembre' , 'Octubre', 'Noviembre', 'Diciembre'];
	var dayNames =  ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
	var dayNamesShort1=['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];

	var calendarInline = myApp.calendar({
	    // container: '#curso_include_tareas_normal_calendario',
	    input: '#'+id,
	    value: [new Date()],
	    weekHeader: true,
	     dateFormat: 'dd/MM/yyyy',
	    dayNamesShort:dayNamesShort1,
	    toolbarTemplate:
	        '<div class="toolbar calendar-custom-toolbar">' +
	            '<div class="toolbar-inner" style="background-color:#2196F3;color:white">' +
	                '<div class="left">' +
	                    '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
	                '</div>' +
	                '<div class="center"></div>' +
	                '<div class="right">' +
	                    '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
	                '</div>' +
	            '</div>' +
	        '</div>',
	    onOpen: function (p) {
	        $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
	        $$('.calendar-custom-toolbar .left .link').on('click', function () {
	            calendarInline.prevMonth();
	        });
	        $$('.calendar-custom-toolbar .right .link').on('click', function () {
	            calendarInline.nextMonth();
	        });
	    },
	    onMonthYearChangeStart: function (p) {
	        $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
	    }
	});

}
