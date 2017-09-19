var glob_alto=$$(window).height();
vconsole(glob_alto);
$$('body').css({'height':glob_alto+'px'});

$$(window).resize(function() {
	// verificar_alto();
});

function verificar_alto(){
	vconsole('alto actual:'+$$(window).height());
	modal_activo=0;
	if ($$(".fondo-blur[id='10']").length >0 ){
			modal_activo=1;
	}
	// vconsole('modal activo: '+ modal_activo);
	// if (glob_alto>$$(window).height() || modal_activo==1){
	// 	$$('.toolbar-inferior').hide();
	// 	$$('.page-content').css({height:'100%'});
	// 	$$('.fondo-blur > #contenedor').css({height:'calc(100% - 35px)'});
	// }else{
	// 	$$('.toolbar-inferior').show("fast");
	// 	$$('.page-content').css({height:'calc(100% - 50px)'});
	// 	$$('.fondo-blur > #contenedor').css({height:'calc(100% - 95px)'});
	// }
}
