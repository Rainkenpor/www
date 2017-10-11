var mySwiper_inicio;
var mySwiper_curso;
var mySwiper_curso_det;
var myEscucha=0;

var intervalo_actual;
var intervalos=[]; //array que almacena los intervalos

function carga_datetime(){
  datos = {opcion:'admin_datetime'};
  console.log(script(datos,2));
}

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
function llenado_elemento(elemento,include,storage,is_cronograma){
  vconsole(storage);
    if (localStorage.getItem(storage) || storage==null)	{

        vconsole('utilizado');
        if(!localStorage.getItem(include))$$.ajax({url:'include/'+include,async:false,success: function(resp) {localStorage.setItem(include,resp);}});
        resp=localStorage.getItem(include);
    		var compiledTemplate = Template7.compile(resp);
    		if (is_cronograma){
  			elemento.html(compiledTemplate(cronograma(storage)));
    		}else{
    			elemento.html(compiledTemplate({"datos":JSON.parse(localStorage.getItem(storage)) }));
    		}
        elemento.attr({storage:storage});
        elemento.attr({vinclude:include});
        if (is_cronograma)
          elemento.attr({is_cronograma:1});


    }else{
      vconsole(1);
      if (is_cronograma){
        datos = {elemento:elemento ,storage:storage,include:include, usuario:Gusuario_id,is_cronograma};
      }else{
        datos = {elemento:elemento ,storage:storage,include:include, usuario:Gusuario_id};
      }
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
    // vconsole($$(this).attr('storage'));
    storage_clear(vstorage);
    vconsole(vinclude);
    llenado_elemento($$(this),vinclude,vstorage,vcronograma);
    myApp.pullToRefreshDone();
  });
//-------------------------------------------------------------------------------------------------------------------------------------
	mySwiper.on('slideChangeStart', function () {
    vconsole('listen > slideChangeStart');
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
      vconsole('listen > slideChangeStart');
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
	$$(document).on('click','.toolbar-inferior div',function(event){
    event.preventDefault();
    vconsole('listen > toolbar-inferior div');
    		if (mySwiper_inicio) {
    			mySwiper_inicio.slideTo(0);
    			$$('.contenedor-inicio .boton').removeClass("activo");
    			$$('.contenedor-inicio .boton[index="0"]').addClass("activo");
    		}
    		if (mySwiper_curso){mySwiper_curso.slideTo(0);}
	      mySwiper.slideTo($$(this).attr('index'));
	      $$('.fondo-blur').remove();
        if (!(localStorage.getItem('favorito_listado'))) {datos = {elemento:'.swiper-slide[storage="favorito_listado"]',opcion:"favorito_listado",usuario:Gusuario_id};	script(datos);}
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
			if (rol==1){
        llenado_elemento($$('.swiper-container-curso-detalle #curso_cronograma'),'base-cronograma.html','curso_'+id_curso+'_cronograma',1);
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
				modal({titulo:$$(this).attr('name'),boton_ok:1, boton_ok_tipo:'nuevo_tema', boton_ok_titulo: 'Crear'});
				llenado_elemento($$(".fondo-blur #contenedor #data"),'base-curso-detalle-nuevotem.html','varios');
			}
			if ($$(this).attr('name')=='Nueva Tarea'){
				modal({titulo:$$(this).attr('name'),boton_ok:1, boton_ok_tipo:'nuevo_tarea', boton_ok_titulo: 'Crear'});
				llenado_elemento($$(".fondo-blur #contenedor #data"),'base-curso-detalle-nuevotar.html','varios');
			}
	    }
	    if ($$(this).hasClass('panel-curso-tarea') || ($$(this).hasClass('timeline-item-inner') && $$(this).attr('id_tarea')>0)) {
	    	id_tarea=($$(this).attr('id_tarea'));
		    vconsole('TAREA SELECCIONADA: '+id_tarea);
        // favorito:1, fav_tipo:'###', fav_id:###, fav_select=1 < si se ha seleccionado como favorito previamente
		    modal({titulo:$$(".swiper-slide[name='curso'] .titulo small").html(),favorito:1,fav_tipo:'tar',fav_id:id_tarea});
		    llenado_elemento($$('.fondo-blur #contenedor #data'),'base-curso-detalle-tareasdet.html','curso_'+id_tarea+'_tareasdet',);
	    }
	    if ($$(this).hasClass('panel-curso-tema') || ($$(this).hasClass('timeline-item-inner') && $$(this).attr('id_tema')>0)) {
	    	id_tema=($$(this).attr('id_tema'));
		    vconsole('TEMA SELECCIONADO: '+id_tema);
		    // modal($$(".swiper-slide[name='curso'] .titulo small").html(),id_tema,'tem',null,10);
        modal({titulo:$$(".swiper-slide[name='curso'] .titulo small").html(),favorito:1,fav_tipo:'tem',fav_id:id_tema,nivel:10});
        llenado_elemento($$('.fondo-blur #contenedor #data'),'base-curso-detalle-temasdet.html','curso_'+id_tema+'_temasdet',);
	    }

	});
	//-------------------------------------------------------------------------------------------------------------------------------------
	// submodal
	//-------------------------------------------------------------------------------------------------------------------------------------
	$$(document).on('click','.submodal',function(){
    vconsole('listen > submodal');
		if ($$(this).attr('tipo')=="tema"){
      if ($$(this).attr('opcion')=="comentario"){
				// modal($$(".swiper-slide[name='curso'] .titulo small").html()+ ' - comentario',null,null,null,11);
        modal({titulo:$$(".swiper-slide[name='curso'] .titulo small").html()+' - Comentario',nivel:11});
        id_tem=$$(this).attr('id');
				datos = '[{"id_tem":"'+$$(this).attr('id')+'"}]';localStorage.setItem('varios', datos);
				llenado_elemento($$(".fondo-blur[id='11'] #contenedor #data"),'base-curso-detalle-temasdet_comentario.html','varios');
        // datos = {autoscroll:1,elemento:".fondo-blur[id='11'] #contenedor #data #tema_comentario_listado",include:'base-curso-detalle-temasdet_comentario_listado.html',nopreload:0,opcion:'curso_temascomment',id:id_tem,usuario:Gusuario_id};
        // script(datos);
        intervalo_actual=setInterval(function () {
          // localStorage.removeItem('curso_temascomment_'+id_tem);
          datos = {autoscroll:1,elemento:".fondo-blur[id='11'] #contenedor #data #tema_comentario_listado",include:'base-curso-detalle-temasdet_comentario_listado.html',nopreload:0,opcion:'curso_temascomment',id:id_tem,usuario:Gusuario_id};
          script(datos);
        }, 5000);
        intervalos['11']=intervalo_actual;
        intervalo_actual=null;
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

function modal(datos){
  // titulo,id,tipo,tipo_crear,nivel	// nivel indica el z-index
	if (!datos.nivel) datos.nivel=10;
	txt='<div class="fondo-blur" id="'+datos.nivel+'" style="z-index:'+datos.nivel+'">';
	txt+='<div id="contenedor">';
	txt+='<div style="background-color:#2196F3;padding:20px 6px;height:26px;color:white;font-size:18px;border-radius:5px 5px 0px 0px;">'+datos.titulo;
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
	txt+=	'<span class="boton" cerrar="true">Cerrar</span>';
  //  para indicar el boton
  //  boton_ok:1, boton_ok_tipo:"####", boton_ok_titulo: "######"
	if (datos.boton_ok)	txt+=	'<span class="boton" crear="true" tipo="'+datos.boton_ok_tipo+'" style="background-color: #2196F3;color:white; padding:10px 50px;margin-left:5px">'+datos.boton_ok_titulo+'</span>';
	txt+=	'</div>';
	txt+=	'</div>';
	txt+=	'</div>';
	$$('body').prepend(txt);
  // verificar_alto();
}

function cronograma(storage){
      var conteo_temas=0;
      var conteo_tareas=0;
      var array=JSON.parse(localStorage.getItem(storage));
      var elementos=[];
      var t_mes=0;var t_dia=0;var pos_ant=0;
      for (a in array){
        console.log(array[a].dia +'-'+ array[a].mes);
        vconteo=elementos.length;
        if (array[a].mes!=t_mes || array[a].dia != t_dia){
          elementos[vconteo]=[];
          elementos[vconteo]['datos']=[];
          elementos[vconteo]['conteo_tem']=0;
          elementos[vconteo]['conteo_tar']=0;
          datos_crono=[];
          elementos[vconteo]['mes']=array[a].mes;
          elementos[vconteo]['dia']=array[a].dia;

          if (array[a].tipo=='tar'){ elementos[vconteo]['conteo_tar']++;}else{elementos[vconteo]['conteo_tem']++;}

          pos_ant=vconteo;
          datos_crono['codigo']=array[a].codigo;
          datos_crono['tarea']=array[a].tipo;
          datos_crono['titulo']=array[a].titulo;
          datos_crono['descripcion']=array[a].descripcion;
          datos_crono['curso']=array[a].curso;
          elementos[pos_ant]['datos'].push(datos_crono);
        }else{
          datos_crono=[];
          datos_crono['codigo']=array[a].codigo;
          datos_crono['tarea']=array[a].tipo;
          datos_crono['titulo']=array[a].titulo;
          datos_crono['descripcion']=array[a].descripcion;
          datos_crono['curso']=array[a].curso;
          if (array[a].tipo=='tar'){ elementos[pos_ant]['conteo_tar']++;}else{elementos[pos_ant]['conteo_tem']++;}
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

function cronograma_expandir(element){
  array=JSON.parse(localStorage.getItem('evento'));
  dia=$$(element).attr('dia');
  mes=$$(element).attr('mes');

  id_curs=$$(element).attr('id_curs');
  var arr=[];
  var conteo=0;
  if (id_curs==null){
      for (arr in array){
        if (array[arr].mes==mes){
          if (array[arr].dia==dia){
            conteo++;
            arr[conteo]['datos'].push(array[arr]);
          }
        }
      }
  }
  // console.log(id_curs);
  datos = '[{ "elementos":"'+arr+'"}]';
  console.log(arr);
  localStorage.setItem('cronograma-detalle', datos);
  $$(element).append('<div class="subpanel"></div>');
  llenado_elemento($$(element).find('.subpanel') ,'base-cronograma-detalle.html','cronograma-detalle');
}

function storage_clear(search){
  for(key in localStorage) {
    if (key.search(search)>=0){
        vconsole('Eliminando storage:' + key);
        localStorage.removeItem(key);
    }
  }
}
