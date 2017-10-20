var mySwiper_inicio;
var mySwiper_curso;
var mySwiper_curso_det;
var mySwiper_curso_temdet;
var myEscucha=0;

var curso_seleccion=[];

var intervalo_actual;
var intervalos=[]; //array que almacena los intervalos

function start(elemento){
  if (!elemento){
    $$('[include]').each(function(e){
      var name=$$(this).attr('name');
      var storage=$$(this).attr('storage');
      var include=$$(this).attr('include');
      var is_cronograma=$$(this).attr('is_cronograma');
      if (include)
        llenado_elemento($$(this),include,storage,is_cronograma);
      if ($$(this).find('[include]').length>0)
        start($$(this));
    });
    if (myEscucha==0){
      escuchas();
      myEscucha=1;
    }
  }else{
    // sub elementos
    elemento.find('[include]').each(function(e){
      var name=$$(this).attr('name');
      var storage=$$(this).attr('storage');
      var include=$$(this).attr('include');
      var is_cronograma=$$(this).attr('is_cronograma');
      if (include)
        llenado_elemento($$(this),include,storage,is_cronograma);
      if ($$(this).find('[include]').length>0)
        start($$(this));
    });
  }
}
// ----------------------------------------------------------------------------------------------------------------------------------------
function llenado_elemento(elemento,include,storage,is_cronograma,handleData){
    if (localStorage.getItem(storage) || storage==null)	{
        if (elemento.attr('storage')!=storage || elemento.attr('vinclude')!=include){
          if(!localStorage.getItem(include))$$.ajax({url:'include/'+include,async:false,success: function(resp) {localStorage.setItem(include,resp);}});
      		var compiledTemplate = Template7.compile(localStorage.getItem(include));
          if (is_cronograma){
            elemento.html(compiledTemplate(cronograma(storage)));
      		}else{
            elemento.html(compiledTemplate({"datos":JSON.parse(localStorage.getItem(storage)) }));
      		}
          elemento.attr({storage:storage});
          elemento.attr({vinclude:include});
          if (is_cronograma) elemento.attr({is_cronograma:1});
          if (handleData) handleData(1);
        }
    }else{
      elemento.removeAttr('storage');
      elemento.removeAttr('vinclude');
      elemento.html('');
      datos = {elemento:elemento ,storage:storage,include:include, usuario:Gusuario_id,is_cronograma,handleData};
      script(datos);
    }
}
// ----------------------------------------------------------------------------------------------------------------------------------------
function escuchas(){
  vconsole('iniciando escuchas');
  var ptrContent = $$('.pull-to-refresh-content');
  myApp.initPullToRefresh(ptrContent);
  ptrContent.on('ptr:refresh', function (e) {
    vconsole('listen > refresh');
    vstorage=$$(this).attr('storage');
    vinclude=$$(this).attr('vinclude');
    vcronograma=$$(this).attr('is_cronograma');
    storage_clear(vstorage);
    vconsole(vinclude);
    llenado_elemento($$(this),vinclude,vstorage,vcronograma);
    myApp.pullToRefreshDone();
  });
//-------------------------------------------------------------------------------------------------------------------------------------
	mySwiper.on('slideChangeStart', function () {
    vconsole('listen > slideChangeStart');
	    $$('.toolbar-inner table tr td').removeClass("activo");
      $$(".swiper-slide[name='curso'] .titulo").html('Curso');
      curso_seleccion=[];
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
      vconsole('listen > slideChangeStart');
      curso_seleccion=[];
		    $$('.toolbar-inner table tr td').removeClass("activo");
		    if (mySwiper.realIndex === 0) {$$("#btn-home").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 1) {$$("#btn-tarea").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 2) {$$("#btn-curso").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 3) {$$("#btn-destacado").parents('td').addClass("activo");}
		    if (mySwiper.realIndex === 4) {$$("#btn-comentario").parents('td').addClass("activo");}
		});
	});
//-------------------------------------------------------------------------------------------------------------------------------------
// general
//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.boton',function(event){
    vconsole('listen > boton');
    event.preventDefault();
    event.stopImmediatePropagation();
		// menus
		if ($$(this).hasClass('menu')){
		      $$(this).parent().find('.boton').removeClass('activo');
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
            llenado_elemento($$('.swiper-container-curso-detalle #curso_cronograma'),'base-cronograma.html','curso_'+id_curso+'_cronograma',1);
		      if ($$(this).attr('index')==1)
				    llenado_elemento($$('.swiper-container-curso-detalle #curso_tareas'),'base-curso-detalle-tareas.html','curso_'+id_curso+'_tareas');
			    if ($$(this).attr('index')==2)
            llenado_elemento($$('.swiper-container-curso-detalle #curso_tema'),'base-curso-detalle-temas.html','curso_'+id_curso+'_temas');
			   //if ($$(this).attr('index')==3)
				 // llenado_peticion('base-curso-detalle-tareas.html','curso_tareas_'+id_curso,'.swiper-container-curso-detalle #curso_tareas');
			mySwiper_curso_det.slideTo($$(this).attr('index'));
		}
    if ($$(this).attr('enviar')){
      tipo=$$(this).attr('tipo');
			modal_enviar($$(this),tipo);
    }
	});

	//-------------------------------------------------------------------------------------------------------------------------------------
	// menu
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.toolbar-inferior div',function(event){
    event.preventDefault();
    $$(".swiper-slide[name='curso'] .titulo").html('Curso');
    curso_seleccion=[];

    vconsole('listen > toolbar-inferior div');
    		if (mySwiper_inicio) {
    			mySwiper_inicio.slideTo(0);
    			$$('.contenedor-inicio .boton').removeClass("activo");
    			$$('.contenedor-inicio .boton[index="0"]').addClass("activo");
    		}
    		if (mySwiper_curso){mySwiper_curso.slideTo(0);}
	      mySwiper.slideTo($$(this).attr('index'));
	      $$('.fondo-blur').remove();
        // if (!(localStorage.getItem('favorito_listado'))) {datos = {elemento:'.swiper-slide[storage="favorito_listado"]',opcion:"favorito_listado",usuario:Gusuario_id};	script(datos);}
	});

	//-------------------------------------------------------------------------------------------------------------------------------------
	// inicio > notificacion
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.checkbox',function(event){
    event.preventDefault();
    vconsole('listen > checkbox');
		if ($$(this).find('.icon-circle-empty').length>0){
			$$(this).find('.icon-circle-empty').addClass('icon-ok-circled').removeClass('icon-circle-empty').css({'color':'#4CAF50'});
		}else{
			$$(this).find('.icon-ok-circled').addClass('icon-circle-empty').removeClass('icon-ok-circled').css({'color':'#757575'});
		}
	});

	//-------------------------------------------------------------------------------------------------------------------------------------
  	// elementos vpanel, vpanel2(sin diseño) - seleccion de cursos y seleccion de tareas
  	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.vpanel, .vpanel2',function(event){
    event.preventDefault();
    vconsole('listen > vpanel1-2');
		if ($$(this).hasClass('panel-curso')){
			id_curso=($$(this).attr('id_curso'));
			curso=($$(this).attr('curso'));
			rol=($$(this).attr('rol'));
			// swiper de cursos
			if (!mySwiper_curso) mySwiper_curso = myApp.swiper('.swiper-container-curso',{onlyExternal:true,speed:300});
			if (!mySwiper_curso_det) mySwiper_curso_det = myApp.swiper('.swiper-container-curso-detalle',{onlyExternal:true,speed:0});
			// llenando las pantallas del detalle
      curso_seleccion={curso:curso,rol:rol,id_curso:id_curso};
			if (rol==1){
        llenado_elemento($$('.swiper-container-curso-detalle #curso_cronograma'),'base-cronograma.html','curso_'+id_curso+'_cronograma',1);
			}else{
				datos = '[{ "id_curs":"'+id_curso+'", "curso":"'+curso+'", "rol":"'+rol+'"}]'; localStorage.setItem('varios', datos);
				llenado_elemento($$('.swiper-container-curso-detalle #curso_nuevo') ,'base-curso-detalle-nuevo.html','varios');
			}

			if (rol==1) {$$('.contenedor-curso .boton[index="4"]').css({'display':'none'});}
			if (rol==2) {$$('.contenedor-curso .boton[index="4"]').css({'display':'inline'});}

			$$(".swiper-slide[name='curso'] .titulo").html(curso);
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
				modal({titulo:$$(this).attr('name'),boton_ok:1, boton_ok_tipo:'nuevo_tema', boton_ok_titulo: 'Crear'});
				llenado_elemento($$(".fondo-blur #contenedor #data"),'base-curso-detalle-nuevotem.html','varios');
			}
			if ($$(this).attr('name')=='Nueva Tarea'){
				modal({titulo:$$(this).attr('name'),boton_ok:1, boton_ok_tipo:'nuevo_tarea', boton_ok_titulo: 'Crear'});
				llenado_elemento($$(".fondo-blur #contenedor #data"),'base-curso-detalle-nuevotar.html','varios');
			}

	    }
	});
	//-------------------------------------------------------------------------------------------------------------------------------------
	// submodal
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.submodal',function(){
    vconsole('listen > submodal');
		if ($$(this).attr('tipo')=="tema"){
      if ($$(this).attr('opcion')=="comentario"){
        modal({titulo:$$(".swiper-slide[name='curso'] .titulo small").html()+' - Comentario',nivel:11});


			}
			if ($$(this).attr('opcion')=="nota"){
				// modal($$(".swiper-slide[name='curso'] .titulo small").html()+ ' nota',null,null,null,11);
        modal({titulo:$$(".swiper-slide[name='curso'] .titulo small").html()+' - Nota',nivel:11});
				datos = '[{"id_tem":"'+$$(this).attr('id')+'"}]';localStorage.setItem('varios', datos);
				llenado_elemento($$(".fondo-blur[id='11'] #contenedor #data"),'base-curso-detalle-temasdet_nota.html','varios');
				// editor('txt_tema');
			}
		}
	});
  //
  // keyup
  //
  $$(document).on('keyup','.fondo-blur #data input[type="text"]',function(event){
    vconsole('listen > fondo-blur input');
    if (event.keyCode==13){
      tipo='tema_comentario';
      modal_enviar($$(this),tipo);
    }
  });
  // seleccion de favorito
	// ----------------------------------------------------------------------------------------------------------
	$$(document).on('click','.favorito',function(){
    vconsole('listen > favorito');
    if ($$(this).hasClass('icon-star-empty')){
		    $$(this).removeClass('icon-star-empty').addClass('icon-star');
        vtipo=$$(this).attr('tipo');
        vid=$$(this).attr('id');
        datos = {opcion:'favorito',select:1,usuario:Gusuario_id,tipo:vtipo,id:vid};
        script(datos);

    }else{
      $$(this).removeClass('icon-star').addClass('icon-star-empty');
      datos = {opcion:'favorito',usuario:Gusuario_id,tipo:vtipo,id:vid};
      script(datos);
    }
	})
};

// opciones
      function opcion_cambiocolor(elemento){
        modal({titulo:'Cambio de Color',nivel:10});
        llenado_elemento($$('.fondo-blur #contenedor #data'),'base-inicio-opcion-color.html');
      }
      function opcion_cambiocolor_select(color){
        var data=script({opcion:"configuracion_color", color:color, usu:Gusuario_id},1);
        carga_color(color);
        $$('#configuracion-color').css('background-color', color);
      }

// curso
      function curso_seleccion_cronograma(elemento){
        id_curs=$$(elemento).attr('id_curs');
        curso=$$(elemento).attr('curso');
        modal({titulo:curso,favorito:1,fav_tipo:'curs',fav_id:id_curs,nivel:9});
        llenado_elemento($$('.fondo-blur[id="9"] #contenedor #data'),'base-cronograma.html','curso_'+id_curs+'_cronograma',1);
        calendario('modal_fecha');
      }

      function curso_seleccion_opcion(elemento){
        // favorito:1, fav_tipo:'###', fav_id:###, fav_select=1 < si se ha seleccionado como favorito previamente
        id_tipo=$$(elemento).attr('tipo');
        id_codigo=$$(elemento).attr('codigo');
        curso=(curso_seleccion.curso)?curso_seleccion.curso:$$(elemento).attr('curso');

        if (id_tipo=="tar"){
          modal({titulo:curso,favorito:1,fav_tipo:'tar',fav_id:id_codigo});
          llenado_elemento($$('.fondo-blur[id="10"] #contenedor #data'),'base-curso-detalle-tareasdet.html','curso_'+id_codigo+'_tareasdet',);
        }
        if (id_tipo=="tem"){
          modal({titulo:curso,favorito:1,fav_tipo:'tem',fav_id:id_codigo,nivel:10});
          llenado_elemento($$('.fondo-blur[id="10"] #contenedor #data'),'base-curso-detalle-temasdet.html','curso_'+id_codigo+'_temasdet',null,function(e){
            mySwiper_curso_temdet = myApp.swiper('.swiper-container-curso-temedet',{onlyExternal:false,speed:300});
            mySwiper_curso_temdet.slideTo(0);

    				// datos = '[{"id_tem":"'+id_codigo+'"}]';localStorage.setItem('varios', datos);
    				// llenado_elemento($$(".fondo-blur[id='10'] #contenedor #tema_comentario_listado"),'base-curso-detalle-temasdet_comentario.html','varios');
            datos = {autoscroll:1,elemento:$$(".fondo-blur[id='10'] #contenedor #data #tema_comentario_listado"),include:'base-curso-detalle-temasdet_comentario_listado.html',nopreload:0,opcion:'curso_temascomment',id:id_codigo,usuario:Gusuario_id};
            script(datos);
            intervalo_actual=setInterval(function () {
              datos = {autoscroll:1,elemento:$$(".fondo-blur[id='10'] #contenedor #data #tema_comentario_listado"),include:'base-curso-detalle-temasdet_comentario_listado.html',nopreload:0,opcion:'curso_temascomment',id:id_codigo,usuario:Gusuario_id};
               script(datos);
            }, 5000);
            intervalos['10']=intervalo_actual;
            intervalo_actual=null;
          });

        }
        calendario('modal_fecha');
      }



function storage_clear(search){
  for(key in localStorage) {
    if (key.search(search)>=0){
        vconsole('Eliminando storage:' + key);
        localStorage.removeItem(key);
    }
  }
}
