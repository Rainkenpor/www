var mySwiper_inicio;
var mySwiper_curso;
var mySwiper_curso_det;
var myEscucha=0;

var intervalo_actual;
var intervalos=[]; //array que almacena los intervalos

function start(){
  // recorrido base
  longitud=$$('.swiper-slide').length;
  $$('.swiper-slide[name]').each(function(e){
    var panel=$$(this).attr('name');
    var elemento =$$(this)

      if (e==(longitud-1)){
      	// datos
		  llenado_datos();
      	// llenado de datos
		  llenado_include();
		// escuchas
		if (myEscucha==0){
			escuchas();
			myEscucha=1;
		}
      }
  });

}
// ----------------------------------------------------------------------------------------------------------------------------------------
function llenado_include(){
	contador=0;
  	// llenando datos segun include
	$$('.swiper-slide[include]').each(function(e){
		if ($$(this).html().trim()==''){

		  	include=$$(this).attr('include');
		  	storage=$$(this).attr('storage');

		  	// console.log(JSON.parse(localStorage.getItem(storage)));
		  	elemento=$$(this);
		  	llenado_elemento(elemento,include,storage);
		  contador++;
		 }
	});
	if (contador>0) llenado_include();
}
// ----------------------------------------------------------------------------------------------------------------------------------------
function llenado_elemento(elemento,include,storage,is_cronograma){
	// console.log(localStorage.getItem(storage));
	$$.ajax({url:'include/'+include,async:false,success: function(resp) {
  		var compiledTemplate = Template7.compile(resp);
  		if (is_cronograma){
			elemento.html(compiledTemplate(cronograma(storage)));
  		}else{
  			console.log({"datos":JSON.parse(localStorage.getItem(storage)) });
  			console.log(include);
  			elemento.html(compiledTemplate({"datos":JSON.parse(localStorage.getItem(storage)) }));
  		}
  	}});
}
// ----------------------------------------------------------------------------------------------------------------------------------------
function llenado_peticion(include,storage,elemento){
	contador=0;
	st1=storage.split('_');
	if (!(localStorage.getItem(storage))){
		st1=storage.split('_');
		if (st1.length===3){
			st2=st1[0]+'_'+st1[1]
			datos = {elemento:elemento,opcion:st2,id:st1[2], usuario:Gusuario_id};
			console.log(datos);
			// script(datos,1);
      $$(elemento).html('cargando...');
      script(datos);
		}else{
			datos = {elemento:elemento,opcion:storage,usuario:Gusuario_id};
			console.log(datos);
			// script(datos,1);
      $$(elemento).html('cargando...');
      script(datos);
		}
	}
  	elemento=$$(elemento);
  	// llenado_elemento(elemento,include,storage);
  		if (st1[1]==='cronograma'){
  			llenado_elemento(elemento,include,storage,1);
  		}else{
  			llenado_elemento(elemento,include,storage);
       }
}
// ----------------------------------------------------------------------------------------------------------------------------------------
function llenado_datos(opcion){
	var datos;
	console.log(Gusuario_id);
	if (!(localStorage.getItem('inicio_notificacion')))	{datos = {elemento:'.swiper-slide[storage="inicio_notificacion"]' ,opcion:"inicio_notificacion",usuario:Gusuario_id};script(datos);}
	if (!(localStorage.getItem('inicio_perfil')))		    {datos = {elemento:'.swiper-slide[storage="inicio_perfil"]'       ,opcion:"inicio_perfil",usuario:Gusuario_id};	script(datos);}
	if (!(localStorage.getItem('evento-listado')))		  {datos = {elemento:'.swiper-slide[storage="evento-listado"]'      ,opcion:"evento_listado",usuario:Gusuario_id};	script(datos);}
	if (!(localStorage.getItem('curso_listado')))		    {datos = {elemento:'.swiper-slide[storage="curso_listado"]'       ,opcion:"curso_listado",usuario:Gusuario_id};	script(datos);}
	if (!(localStorage.getItem('favorito_listado')))	  {datos = {elemento:'.swiper-slide[storage="favorito_listado"]'    ,opcion:"favorito_listado",usuario:Gusuario_id};	script(datos);}
	if (!(localStorage.getItem('foro_listado')))		    {datos = {elemento:'.swiper-slide[storage="foro_listado"]'        ,opcion:"foro_listado",usuario:Gusuario_id};		script(datos);}

}
// ----------------------------------------------------------------------------------------------------------------------------------------
function escuchas(){
	//-------------------------------------------------------------------------------------------------------------------------------------
	mySwiper.on('slideChangeStart', function () {
	    $$('.toolbar-inner table tr td').removeClass("activo");
	    if (mySwiper.realIndex === 0) {$$("#btn-home").parents('td').addClass("activo");}
	    if (mySwiper.realIndex === 1) {$$("#btn-tarea").parents('td').addClass("activo");}
	    if (mySwiper.realIndex === 2) {$$("#btn-curso").parents('td').addClass("activo");}
	    if (mySwiper.realIndex === 3) {$$("#btn-destacado").parents('td').addClass("activo");}
	    if (mySwiper.realIndex === 4) {$$("#btn-comentario").parents('td').addClass("activo");}

      if (mySwiper_inicio) {mySwiper_inicio.slideTo(0);$$('.contenedor-inicio .boton').removeClass("activo");$$('.contenedor-inicio .boton[index="0"]').addClass("activo");}
      if (mySwiper_curso){mySwiper_curso.slideTo(0);}
	});
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(mySwiper_inicio).change(function(){
		mySwiper_inicio.on('slideChangeStart', function () {
		    console.log('slide change start '+mySwiper.realIndex);
		    $$('.toolbar-inner table tr td').removeClass("activo");
		    if (mySwiper.realIndex === 0) {$$("#btn-home").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 1) {$$("#btn-tarea").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 2) {$$("#btn-curso").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 3) {$$("#btn-destacado").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 4) {$$("#btn-comentario").parents('td').addClass("activo");}
		});
	});
	//-------------------------------------------------------------------------------------------------------------------------------------

	//-------------------------------------------------------------------------------------------------------------------------------------
	// general
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.boton',function(){
		// menus
		if ($$(this).hasClass('menu')){
		      $$(this).parent().find('.boton').each(function(e){
		        $$(this).removeClass('activo');
		      })
		    	$$(this).addClass('activo');
		}
		// menus inicio
		if ($$(this).hasClass('menu_inicio')){
			if (!mySwiper_inicio) mySwiper_inicio = myApp.swiper('.swiper-container-inicio',{onlyExternal:true,speed:0});
	      	mySwiper_inicio.slideTo($$(this).attr('index'));
		}
		if ($$(this).hasClass('menu_curso')){
			if (!mySwiper_curso_det) mySwiper_curso_det = myApp.swiper('.swiper-container-curso-detalle',{onlyExternal:true,speed:0});
		      id_curso=($$(this).parents('#curso_detalle').attr('id_curso'));
		      if ($$(this).attr('index')==0)
		      	llenado_peticion('base-curso-detalle-cronograma.html','curso_cronograma_'+id_curso,'.swiper-container-curso-detalle #curso_cronograma');
		      if ($$(this).attr('index')==1)
				    llenado_peticion('base-curso-detalle-tareas.html','curso_tareas_'+id_curso,'.swiper-container-curso-detalle #curso_tareas');
			    if ($$(this).attr('index')==2)
				    llenado_peticion('base-curso-detalle-temas.html','curso_temas_'+id_curso,'.swiper-container-curso-detalle #curso_tema');
			// if ($$(this).attr('index')==2)
				// llenado_peticion('base-curso-detalle-tareas.html','curso_tareas_'+id_curso,'.swiper-container-curso-detalle #curso_tareas');
			mySwiper_curso_det.slideTo($$(this).attr('index'));
		}
		// modal
	  if ($$(this).attr('crear')){
	   	tipo=$$(this).attr('tipo');
			modal_ok($$(this),tipo);
		}
		if ($$(this).attr('cerrar')){
      vid=$$(this).parents('.fondo-blur').attr('id');
      vid=vid.toString();
      // $$(this).parents('.fondo-blur').removeClass('jackInTheBox').removeClass('animated').addClass('fadeOutUp animated');
      // si es un submodal de comentario de curso
      if (intervalos[vid]){
          clearInterval(intervalos[vid]);
          storage_clear('curso_temascomment_');
          delete intervalos[vid];
      }
      $$(this).parents('.fondo-blur').remove();
		}
    if ($$(this).attr('enviar')){
      tipo=$$(this).attr('tipo');
			modal_enviar($$(this),tipo);
    }

	});

	//-------------------------------------------------------------------------------------------------------------------------------------
	// menu
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.toolbar-inferior div',function(){
    		if (mySwiper_inicio) {
    			mySwiper_inicio.slideTo(0);
    			$$('.contenedor-inicio .boton').removeClass("activo");
    			$$('.contenedor-inicio .boton[index="0"]').addClass("activo");
    		}
    		if (mySwiper_curso){mySwiper_curso.slideTo(0);}
	      mySwiper.slideTo($$(this).attr('index'));
	      $$('.fondo-blur').remove();
	});

	//-------------------------------------------------------------------------------------------------------------------------------------
	// inicio > notificacion
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.checkbox',function(){
		if ($$(this).find('.icon-circle-empty').length>0){
			$$(this).find('.icon-circle-empty').addClass('icon-ok-circled').removeClass('icon-circle-empty').css({'color':'#4CAF50'});
		}else{
			$$(this).find('.icon-ok-circled').addClass('icon-circle-empty').removeClass('icon-ok-circled').css({'color':'#757575'});
		}
	});

	//-------------------------------------------------------------------------------------------------------------------------------------
  	// elementos vpanel, vpanel2(sin diseño) - seleccion de cursos y seleccion de tareas
  	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.vpanel, .vpanel2',function(){
		if ($$(this).hasClass('panel-curso')){
			id_curso=($$(this).attr('id_curso'));
			curso=($$(this).attr('curso'));
			rol=($$(this).attr('rol'));
			// swiper de cursos
			if (!mySwiper_curso) mySwiper_curso = myApp.swiper('.swiper-container-curso',{onlyExternal:true,speed:300});
			if (!mySwiper_curso_det) mySwiper_curso_det = myApp.swiper('.swiper-container-curso-detalle',{onlyExternal:true,speed:0});

			// llenando las pantallas del detalle
			if (rol==1){
				llenado_peticion('base-curso-detalle-cronograma.html','curso_cronograma_'+id_curso,'.swiper-container-curso-detalle #curso_cronograma');
				// llenado_peticion('base-curso-detalle-tareas.html'    ,'curso_tareas_'+id_curso,    '.swiper-container-curso-detalle #curso_tareas');
			}else{
				datos = '[{ "id_curs":"'+id_curso+'", "curso":"'+curso+'", "rol":"'+rol+'"}]'; localStorage.setItem('varios', datos);
				llenado_elemento($$('.swiper-container-curso-detalle #curso_nuevo') ,'base-curso-detalle-nuevo.html','varios');
			}


			if (rol==1) {$$('.contenedor-curso .boton[index="4"]').css({'display':'none'});}
			if (rol==2) {$$('.contenedor-curso .boton[index="4"]').css({'display':'inline'});}

			$$(".swiper-slide[name='curso'] .titulo").html('Curso<small style="display:block;margin-top:-12px;font-size:13px">'+curso+'</small>');
			$$('.swiper-container-curso #curso_detalle').attr('id_curso',id_curso);
			mySwiper_curso.slideTo(1);
			$$('.contenedor-curso .boton').removeClass('activo');

		    	if (rol==1) {mySwiper_curso_det.slideTo(0);$$('.contenedor-curso .boton[index="0"]').addClass('activo'); }
		    	if (rol==2) {mySwiper_curso_det.slideTo(4);$$('.contenedor-curso .boton[index="4"]').addClass('activo'); }
	    }
	    if ($$(this).hasClass('panel-curso-nuevo')){
			id_curso=$$(this).attr('id_curso');
			curso=$$(this).attr('curso');
			datos = '[{"id_curso":"'+id_curso+'", "curso":"'+curso+'"}]';localStorage.setItem('varios', datos);

			if ($$(this).attr('name')=='Nuevo Tema'){
				modal($$(this).attr('name'),null,null,'nuevo_tema');
				llenado_elemento($$(".fondo-blur #contenedor #data"),'base-curso-detalle-nuevotem.html','varios');
			}
			if ($$(this).attr('name')=='Nueva Tarea'){
				modal($$(this).attr('name'),null,null,'nuevo_tarea');
				llenado_elemento($$(".fondo-blur #contenedor #data"),'base-curso-detalle-nuevotar.html','varios');
			}

			calendario('modal_fecha');
	    }
	    if ($$(this).hasClass('panel-curso-tarea') || ($$(this).hasClass('timeline-item-inner') && $$(this).attr('id_tarea')>0)) {
	    	id_tarea=($$(this).attr('id_tarea'));
		    vconsole('TAREA SELECCIONADA: '+id_tarea);
		    modal($$(".swiper-slide[name='curso'] .titulo small").html(),id_tarea,'tarea');
		    llenado_peticion('base-curso-detalle-tareasdet.html','curso_tareasdet_'+id_tarea,'.fondo-blur #contenedor #data');
	    }
	    if ($$(this).hasClass('panel-curso-tema') || ($$(this).hasClass('timeline-item-inner') && $$(this).attr('id_tema')>0)) {
	    	id_tema=($$(this).attr('id_tema'));
		    vconsole('TEMA SELECCIONADO: '+id_tema);
		    modal($$(".swiper-slide[name='curso'] .titulo small").html(),id_tema,'tema',null,10);
		    llenado_peticion('base-curso-detalle-temasdet.html','curso_temasdet_'+id_tema,'.fondo-blur #contenedor #data');

	    }

	});
	//-------------------------------------------------------------------------------------------------------------------------------------
	// submodal
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.submodal',function(){
		if ($$(this).attr('tipo')=="tema"){
      if ($$(this).attr('opcion')=="comentario"){
				modal($$(".swiper-slide[name='curso'] .titulo small").html()+ ' - comentario',null,null,null,11);
        id_tem=$$(this).attr('id');
				datos = '[{"id_tem":"'+$$(this).attr('id')+'"}]';localStorage.setItem('varios', datos);
				llenado_elemento($$(".fondo-blur[id='11'] #contenedor #data"),'base-curso-detalle-temasdet_comentario.html','varios');
        datos = {elemento:".fondo-blur[id='11'] #contenedor #data #tema_comentario_listado",include:'base-curso-detalle-temasdet_comentario_listado.html',nopreload:0,opcion:'curso_temascomment',id:id_tem,usuario:Gusuario_id};
        script(datos);
        intervalo_actual=setInterval(function () {
          // localStorage.removeItem('curso_temascomment_'+id_tem);
          datos = {elemento:".fondo-blur[id='11'] #contenedor #data #tema_comentario_listado",include:'base-curso-detalle-temasdet_comentario_listado.html',nopreload:0,opcion:'curso_temascomment',id:id_tem,usuario:Gusuario_id};
          script(datos);
        }, 5000);
        intervalos['11']=intervalo_actual;
        intervalo_actual=null;
			}
			if ($$(this).attr('opcion')=="nota"){
				modal($$(".swiper-slide[name='curso'] .titulo small").html()+ ' nota',null,null,null,11);
				datos = '[{"id_tem":"'+$$(this).attr('id')+'"}]';localStorage.setItem('varios', datos);
				llenado_elemento($$(".fondo-blur[id='11'] #contenedor #data"),'base-curso-detalle-temasdet_nota.html','varios');
				editor('txt_tema');
			}
		}
	});
  //
  // keyup
  //
  $$(document).on('keyup','.fondo-blur #data input[type="text"]',function(event){
    if (event.keyCode==13){
      tipo='tema_comentario';
      modal_enviar($$(this),tipo);
    }
  });
  // seleccion de favorito
	// ----------------------------------------------------------------------------------------------------------
	$$(document).on('click','.fondo-blur #contenedor .favorito',function(){
		$$(this).removeClass('icon-star-empty').addClass('icon-star');
	})
};

function modal(titulo,id,tipo,tipo_crear,nivel){
	// nivel indica el z-index
	if (!nivel) nivel=10;
	txt='<div class="fondo-blur" id="'+nivel+'" style="z-index:'+nivel+'">';
	txt+='<div id="contenedor">';
	txt+='<div style="background-color:#2196F3;padding:6px;height:26px;color:white;font-size:18px;border-radius:5px 5px 0px 0px;">'+titulo;

	if (tipo){
		txt+=	'<span class="favorito icon-star-7" id="'+id+'" tipo="'+tipo+'" style="float:right"></span>';
	}

	txt+=	'</div>';
	txt+=	'<div id="data"></div>';
	txt+=	'<div id="opciones">';
	txt+=	'<span class="boton" cerrar="true">Cerrar</span>';
	if (tipo_crear)	txt+=	'<span class="boton" crear="true" tipo="'+tipo_crear+'" style="background-color: #2196F3;color:white; padding:10px 50px;margin-left:5px">Crear</span>';
	txt+=	'</div>';

	txt+=	'</div>';
	txt+=	'</div>';

	$$('body').prepend(txt);
  verificar_alto();
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

function editor(id){
    CKEDITOR.replace( id );
}


function cronograma(storage){
      var array=JSON.parse(localStorage.getItem(storage));
      console.log(array);
      var elementos=[];
      var t_mes=0;var t_dia=0;var pos_ant=0;
      for (a in array){
        console.log(array[a].dia +'-'+ array[a].mes);
        vconteo=elementos.length;
        if (array[a].mes!=t_mes || array[a].dia != t_dia){
          elementos[vconteo]=[];
          elementos[vconteo]['datos']=[];
          datos_crono=[];
          elementos[vconteo]['mes']=array[a].mes;
          elementos[vconteo]['dia']=array[a].dia;
          pos_ant=vconteo;
          datos_crono['codigo']=array[a].codigo;
          datos_crono['tarea']=array[a].tipo;
          datos_crono['titulo']=array[a].titulo;
          datos_crono['descripcion']=array[a].descripcion;
          elementos[pos_ant]['datos'].push(datos_crono);
        }else{
          datos_crono=[];
          datos_crono['codigo']=array[a].codigo;
          datos_crono['tarea']=array[a].tipo;
          datos_crono['titulo']=array[a].titulo;
          datos_crono['descripcion']=array[a].descripcion;
          elementos[pos_ant]['datos'].push(datos_crono);
        }

        t_mes=array[a].mes;
        t_dia=array[a].dia;
      }
      console.log(elementos);
      var context_curso = {"elementos":elementos};

      // $$('.cursos.detalle .contenido').html(compiledTemplate(context_curso));
      return context_curso;

}

function storage_clear(search,value){
  for(key in localStorage) {
    vconsole(key);
    if (key.search(search)>=0){
        vconsole('Eliminando storage:' + key);
        localStorage.removeItem(key);
    }
  }
}
