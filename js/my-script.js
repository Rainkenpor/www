var Gusuario_id     =0;
var Gusuario_nombre ='';
var Gusuario_disp   ='';
// devolver 2= no devuelve respuesta
function script(datos,devolver){
  // devolver es opcional null = no ; 1 = si; 2 = ejecuta el query sin storage

  // convirtiendo tipo de datos
  if (!datos.opcion)
    datos.opcion=datos.storage;

  var subelementos=datos.opcion;
  if (subelementos){
    vconsole(subelementos);
    var subelementos2=subelementos.split('_');
    if ((subelementos2.length)==3){
      codigo1=subelementos2[1];
      if (codigo1>0){
        datos.opcion=subelementos2[0]+'_'+subelementos2[2];
        datos.id=codigo1;
      }
      vconsole('>>>>>>>'+datos.opcion);
      vconsole(datos);
    }
    if (subelementos2.length==5){
      codigo1=subelementos2[1];
      codigo2=subelementos2[3];
      if (codigo1>0 && codigo2>0){
        datos.opcion=subelementos2[0]+'_'+subelementos2[2]+'_'+subelementos2[4];
        datos.id=codigo1;
        datos.id2=codigo2;
      }
      vconsole('>>>>>>>'+datos.opcion);
    }
  }


  if (datos.nopreload == undefined) {myApp.showIndicator();}
  var v_async=true;
  var glob_resp;

  if (devolver){ v_async=false; vconsole('EN ESPERA');}

  $$.ajax({
    dataType: 'jsonp',
    data: datos,
    jsonp: "callback",
    async:v_async,
    processData: true,
    url: 'https://zaionnet.000webhostapp.com/funcion.php',
    method:'POST',
    success: function respuesta(resp) {
      // vconsole('......................RESPUESTA OK......................');
      glob_resp=resp;
      // vconsole(resp);
      if (devolver!=2){
        // vconsole( JSON.stringify(datos));

        if (resp!=''){
  	    	resp2=JSON.parse(resp);
          // if (datos.opcion=='usuario_entrar') return resp2;
  	    	var info=[];
          try{
          // ====================================================================================================
            for (v_resp in resp2){info.push(JSON.parse(resp2[v_resp]));}
            storage=subelementos;
            existeCambio=0;

            if (localStorage.getItem(storage)){
              if (localStorage.getItem(storage)==JSON.stringify(info))
              existeCambio=1;
            }
            localStorage.setItem(storage, JSON.stringify(info));

            if (datos.elemento && existeCambio==0){
              elemento=datos.elemento;
              elemento.attr({storage:''});
              elemento.attr({vinclude:''});
              llenado_elemento(elemento,datos.include,storage,datos.is_cronograma);
              if (datos.autoscroll) $(elemento).animate({scrollTop: 9999}, 1000);
            }
          // storage clear
            if (datos.storageclear){
              resp2.forEach(function(valor,indice,array){
                data=JSON.parse(valor);
                vconsole('limpiando->'+data.storage);
                storage_clear(data.storage)
              });

            }
          // ====================================================================================================
          }catch(e){

          }
          myApp.hideIndicator();
  	    }
        // si no existen valore
        // script_carga(datos.opcion);
    }
    myApp.hideIndicator();

    },
    error: function searchError(xhr, err) {
      vconsole("Error on ajax call: " + err);
      vconsole(JSON.stringify(xhr));
      if (devolver){ return err;}
        // script_carga(datos.opcion);
       myApp.hideIndicator();
    }
  });

  if (devolver){
    vconsole('respuesta');
    vconsole(glob_resp);
    return glob_resp;
  }
}
