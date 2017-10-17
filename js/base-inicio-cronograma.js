
function cronograma(storage){
      var conteo_temas=0;
      var conteo_tareas=0;
      var array=JSON.parse(localStorage.getItem(storage));
      var elementos=[];
      var t_mes=0;var t_dia=0;var pos_ant=0;
      for (a in array){
        vconteo=elementos.length;
        if (array[a].mes!=t_mes || array[a].dia != t_dia){
          elementos[vconteo]=[];
          elementos[vconteo]['datos']=[];
          elementos[vconteo]['conteo_tem']=0;
          elementos[vconteo]['conteo_tar']=0;
          datos_crono=[];
          elementos[vconteo]['mes']=array[a].mes;
          elementos[vconteo]['dia']=array[a].dia;
          elementos[vconteo]['id_curs']=array[a].id_curs;
          elementos[vconteo]['storage']=storage;

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
      var context_curso = {"elementos":elementos};
      return context_curso;
}

function cronograma_expandir(element){
  elements=$$(element).parents('.vpanel');
  if ($$(elements).find('.subpanel').length>0){
    $$(elements).find('.subpanel').remove();
    return false;
  }
  dia=$$(elements).attr('dia');
  mes=$$(elements).attr('mes');
  id_curs=$$(elements).attr('id_curs');
  storage=$$(elements).attr('storage');

  array=JSON.parse(localStorage.getItem(storage));
  var vdata=[];
  var conteo=-1;
  if (id_curs==null){
    prev_curs=''
      for (arr in array){
        if (array[arr].mes==mes){
          if (array[arr].dia==dia){
            conteo_tar=0;conteo_tem=0;
            if (array[arr].tipo=='tar'){conteo_tar=1;}else{conteo_tem=1;}
            if (array[arr].id_curs!=prev_curs){
              conteo++;
              vdata[conteo]=[];
              vdata[conteo]={id_curs:array[arr].id_curs,curso:array[arr].curso,conteo_tar:conteo_tar,conteo_tem:conteo_tem,data:[array[arr]]};
            }else{
              vdata[conteo]['data'].push(array[arr]);
              vdata[conteo]['conteo_tar']=vdata[conteo]['conteo_tar']+conteo_tar;
              vdata[conteo]['conteo_tem']=vdata[conteo]['conteo_tem']+conteo_tem;
            }
            prev_curs=array[arr].id_curs;
          }
        }
      }
  }else{
      for (arr in array){
        if (array[arr].mes==mes){
          if (array[arr].dia==dia){
            if (array[arr].id_curs==id_curs){
              conteo_tar=0;conteo_tem=0;
              if (array[arr].tipo=='tar'){conteo_tar=1;}else{conteo_tem=1;}
              conteo++;
              vdata[conteo]=[];
              vdata[conteo]={seleccion_curso:1, id_curs:array[arr].id_curs,curso:'',conteo_tar:conteo_tar,conteo_tem:conteo_tem,data:[array[arr]]};
            }
          }
        }
      }
  }

  localStorage.setItem('cronograma-detalle', JSON.stringify(vdata));
  $$(elements).append('<div class="subpanel"></div>');
  llenado_elemento($$(elements).find('.subpanel') ,'base-cronograma-detalle.html','cronograma-detalle');
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
