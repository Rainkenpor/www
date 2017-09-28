setInterval(function () {
  // verificando storage a limpiar
  localStorage.removeItem('admin_storageclear');
  script({opcion:"admin_storageclear", dispositivo:Gusuario_disp,nopreload:1,storageclear:1});
  console.log(localStorage.getItem('admin_storageclear'));
}, 5000);
