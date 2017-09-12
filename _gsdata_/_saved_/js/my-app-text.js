var glob_alto=$$(window).height();

$$(window).resize(function() {
	vconsole('alto actual:'+$$(window).height());
	if (glob_alto>$$(window).height()){
		$$('.toolbar-inferior').hide();
		$$('.page-content > .content-block').css({height:'100%'});
		$$('.fondo-blur > #contenedor').css({height:'calc(100% - 35px)'});
	}else{
		$$('.toolbar-inferior').show();
		$$('.page-content > .content-block').css({height:'calc(100% - 50px)'});
		$$('.fondo-blur > #contenedor').css({height:'calc(100% - 95px)'});
	}
});
