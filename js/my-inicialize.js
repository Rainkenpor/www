var isMaterial = Framework7.prototype.device.ios === false;
var isIos = Framework7.prototype.device.ios === true;


Template7.global = {
  material: isMaterial,
  ios: isIos,
};

// for(key in localStorage) {localStorage.removeItem(key);}
Template7.registerHelper('if_compare', function (a, operator, b, options) {
    var match = false;

    if (
        (operator === '==' && (a == b)) ||
        (operator === '===' && (a === b)) ||
        (operator === '!=' && (a != b)) ||
        (operator === '>' && (a > b)) ||
        (operator === '<' && (a < b)) ||
        (operator === '>=' && (a >= b)) ||
        (operator === '<=' && (a <= b))||
        (operator === '||' && (a || b)) ||
        (operator === '&&' && (a && b))
        ) {
        match = true;
    }
    if (match) return options.fn(this);
    else return options.inverse(this);
});


if (!isIos) {
// vconsole("android");
  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
  $$('.view .navbar').prependTo('.view .page');
}

// Initialize app
var myApp = new Framework7({
  // tapHold: true,
  material: isIos? false : true,
template7Pages: true,
precompileTemplates: true,
swipePanel: 'left',
swipePanelActiveArea: '30',
swipeBackPage: true,
animateNavBackIcon: true,
tapHoldPreventClicks:false,
activeState:false,
pushState: !!Framework7.prototype.device.os,
});

function vconsole(txt){
  $$('#login_console').append('<br>'+txt)
  $$('.swiper-slide[name="inicio-log"]').append('<br>'+txt);
  console.log(txt);
  $$("#app-status-ul").append('<br>'+txt);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function carga_color(color){
var vcolor=hexToRgb(color);
// porcentajes de color
// StatusBar.backgroundColorByHexString(color);
p1=(vcolor.r-40<0)?0:vcolor.r-40;
p2=(vcolor.g-40<0)?0:vcolor.g-40;
p3=(vcolor.b-40<0)?0:vcolor.b-40;
var color2=rgbToHex(p1,p2,p3);
$$('head style').remove();
 $$('head').append(
'<style>'+
'    .perfil_background{'+
'      background-color:'+color+' !important;'+
'      color:white !important;'+
'    }'+
'    .fondo{'+
'      background-color:'+color+';'+
'      color:white;'+
'    }'+
'    .toolbar-inferior td.activo{'+
'      background-color: '+color+';'+
'      color:white;'+
'    }'+
'    .swiper-slide .swpanel .boton.activo{'+
'      background-color: white;'+
'      color:'+color+';'+
'    }'+
'    .swiper-slide .swpanel .boton{'+
'      color:'+color2+';'+
'    }'+
'    .chip-media{'+
'      background-color: '+color+';'+
'      color:white;'+
'    }'+
'</style>');
try {
StatusBar.backgroundColorByHexString(color);
} catch (e) {

} finally {

}

}

function extension_archivo(archivo){
    var ext=archivo.split('.').pop();
    var extension='';
    var icono='';

    if (ext=='jpg' || ext=='jpeg'){  extension='image/jpeg'; icono='img'}
    if (ext=='png' || ext=='gif' || ext=='bmp'){  extension='image/'+ext; icono="img";}
    if (ext=='docx'){  extension='application/vnd.openxmlformats-officedocument.wordprocessingml.document'; icono="icon-file-word";}
    if (ext=='xlsx'){  extension='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';icono="icon-file-excel";}
    if (ext=='ppsx'){  extension='application/vnd.openxmlformats-officedocument.presentationml.slideshow';icono="icon-file-powerpoint";}
    if (ext=='doc') { extension='application/msword';icono="icon-file-word";}
    if (ext=='xls') { extension='application/vnd.ms-excel';icono="icon-file-excel";}
    if (ext=='ppt') { extension='application/vnd.ms-powerpoint';icono="icon-file-powerpoint";}
    if (ext=='pdf') { extension='application/pdf';icono="icon-file-pdf";}
    if (ext=='aac') { extension='audio/x-aac';icono="icon-file-audio";}
    if (ext=='mpga' || ext=='mp2' || ext=='mp2a' || ext=='mp3' || ext=='m2a' || ext=='m3a') { extension='audio/mpeg';icono="icon-file-audio";}

    var devolver=({"ext":ext,"mdi":extension,"icono":icono});
    return devolver;
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

$$(document).on('deviceready', function() {
    vconsole("Device is ready!");
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);
    function error() {
      vconsole('Permiso de escritura erroneo');
    }
    function success( status ) {
        if( !status.hasPermission ) error();
        vconsole('Permiso de escritura success'+status);
    }
    document.addEventListener("backbutton", function (e) {
      alert('back');
      e.preventDefault();
    }, false );
    vconsole(FileTransfer);
});


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true,
});


 // Init slider and store its instance in mySwiper variable
  var mySwiper = myApp.swiper('.swiper-container-menu', {
    pagination:'.swiper-pagination'
  });
