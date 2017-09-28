var Gusuario_id     =0;
var Gusuario_nombre ='';
var Gusuario_disp   ='';
// devolver 2= no devuelve respuesta
function script(datos,devolver){
  // devolver es opcional null = no ; 1 = si; 2 = ejecuta el query sin storage
  vconsole('>INICIANDO SCRIPT<');
  // vconsole( JSON.stringify(datos));
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
      vconsole('......................RESPUESTA OK......................');
      glob_resp=resp;
      vconsole(resp);
      if (devolver!=2){
        // vconsole( JSON.stringify(datos));

        if (resp!=''){
  	    	resp2=JSON.parse(resp);
          // if (datos.opcion=='usuario_entrar') return resp2;
  	    	var info=[];
          try{
          // ====================================================================================================
            for (v_resp in resp2){info.push(JSON.parse(resp2[v_resp]));}
            if (datos.id){
              storage=datos.opcion+'_'+datos.id;
            }else{
              storage=datos.opcion;
            }
            existeCambio=0;

            if (localStorage.getItem(storage)){
              if (localStorage.getItem(storage)==JSON.stringify(info))
              existeCambio=1;
            }
            localStorage.setItem(storage, JSON.stringify(info));

            if (datos.elemento && existeCambio==0){
              vconsole('>>>>>'+datos.elemento);
              elemento=$$(datos.elemento);
              vconsole(datos.include);
              vconsole(storage);
              vconsole(datos.is_cronograma);
              if (!datos.include) datos.include=elemento.attr('include');

              llenado_elemento(elemento,datos.include,storage,datos.is_cronograma);
              if (datos.autoscroll) $(elemento).animate({scrollTop: 9999}, 1000);
            }
          // storage clear
            if (datos.storageclear){
              resp2.forEach(function(valor,indice,array){
                data=JSON.parse(valor);
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
