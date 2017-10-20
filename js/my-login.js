

   // NOTE: use your firebase info here
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDL9XxChRgOrHGVO7R71HSAkU1g4-sQx6c",
    authDomain: "curso-64550.firebaseapp.com",
    databaseURL: "https://curso-64550.firebaseio.com",
    projectId: "curso-64550",
    storageBucket: "curso-64550.appspot.com",
    messagingSenderId: "82712620086"
  };
  firebase.initializeApp(config);
  // fire base login status listener
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
        var data=script({opcion:"usuario_entrar", email:user.email},1);
        data=JSON.parse(data);
        Gusuario_id=data.id_usu;
        Gusuario_nombre=data.usuario;
        Gusuario_frase=data.frase;
        Gusuario_dia=data.dia;
        Gusuario_mes=data.mes;
        Gusuario_fecha=data.date;
        $$('.login').hide();
        $$('.login .google').hide();
        console.log(data.date);
        console.log(data.time);
        carga_color(data.color);
        notificaciones_push();
    } else {
      $$('.login .google').show();
    }
  });



  function login() {
    window.plugins.googleplus.login(
        {
                 'webClientId' : '82712620086-qdln7okmju9irge1h2sa9cl4nkulp8pg.apps.googleusercontent.com',
                 'offline': true
        },
        function (obj) {
            vconsole('Registrando usuario');
            script({opcion:"registro_google", id:obj.userId,usu:obj.displayName,email:obj.email,imagen:obj.imageUrl},1);
            vconsole('Registro Finalizado');
            var data=script({opcion:"usuario_entrar", email:obj.email},1);
            vconsole('=====================================================================');
            vconsole(data);
            data=JSON.parse(data);
            vconsole('=====================================================================');
            Gusuario_id=data.id_usu;
            Gusuario_nombre=data.usuario;
            Gusuario_frase=data.frase;
            Gusuario_dia=data.dia;
            Gusuario_mes=data.mes;
            Gusuario_fecha=data.date;
            $$('.login').hide();
            $$('.login .google').hide();
            carga_color(data.color);
            notificaciones_push();
            if (!firebase.auth().currentUser) {
                firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(obj.idToken))
                .then((success) => {
                    vconsole("success: " + JSON.stringify(success)); // to long json to put it in #feedback
                })
                .catch((error) => {
                        // document.querySelector("#feedback").innerHTML = "error0: " + JSON.stringify(error);
                      });
            }else{
                // document.querySelector("#feedback").innerHTML ='error1: already sigend in firebase';
            }
        },
        function (msg) {
          // document.querySelector("#feedback").innerHTML = "error2: " + msg;
        }
    );
  }

  function trySilentLogin() {
    window.plugins.googleplus.trySilentLogin(
        {},
        function (obj) {

        },
        function (msg) {
          // document.querySelector("#feedback").innerHTML = "error: " + msg;
        }
    );
  }

  function logout() {
    trySilentLogin() ;
    window.plugins.googleplus.logout(
        function (msg) {
          vconsole(msg);
            vconsole('cerrando sesion');
            for(key in localStorage) {localStorage.removeItem(key);}
            $$('.login').show();
            $$('.login .google').show();
            Gusuario_id=0;
            Gusuario_nombre='';
            Gusuario_frase='';
            Gusuario_dia='';
            Gusuario_mes='';
            Gusuario_fecha='';
            if(firebase.auth().currentUser){firebase.auth().signOut();}
        },
        function (msg) {
          // document.querySelector("#feedback").innerHTML = msg;
        }
    );
  }
  // function disconnect() {
  //   window.plugins.googleplus.disconnect(
  //       function (msg) {
  //         document.querySelector("#image").style.visibility = 'hidden';
  //         document.querySelector("#feedback").innerHTML = msg;

  //           $$(".panel-left .content-block #login .image-temp").show();
  //           $$(".panel-left .content-block #login #imagen #image").hide();
  //           $$(".panel-left .content-block #login .usuario").html('Iniciar Sesión');
  //           Gusuario_id=0;
  //           Gusuario_nombre='';
  //         if(firebase.auth().currentUser){
  //           document.querySelector("#feedback").innerHTML ='signing out from firebase';
  //           firebase.auth().signOut();



  //         }
  //       },
  //       function (msg) {

  //         document.querySelector("#feedback").innerHTML = msg;
  //       }
  //   );
  // }
  window.onerror = function(what, line, file) {
    vconsole(what + '; ' + line + '; ' + file);
  };
  function handleOpenURL (url) {
    vconsole("App was opened by URL: " + url);
  }
