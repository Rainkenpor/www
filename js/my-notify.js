 // document.addEventListener("deviceready", deviceReady, false);
    function notificaciones_push() {
        var push = PushNotification.init({
            android: {
                senderID: "82712620086"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        });

        push.on('registration', function(data) {
            vconsole(data.registrationId);
            Gusuario_disp=script({opcion:"usuario_dispositivo", usuario:Gusuario_id,dispositivo: data.registrationId },1);
            vconsole('Dispositivo -> '+ Gusuario_disp);
            start();
        });
        push.on('notification', function(data) {
            vconsole('<li>'+data.title+"</li>");
            vconsole('<li>'+data.message+'</li>');
        });
    }
