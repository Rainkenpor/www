<?php
date_default_timezone_set('America/Guatemala');

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

$servername = "localhost";
$username = "id1923973_zaion_user01";
$password = "Zaion1250";
$dbname = "id1923973_01_curso";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {die("Connection failed: " . $conn->connect_error);}
//echo ">>." . PHP_EOL;
$v_opcion=$_POST['opcion'];

$data_fecha=date("Y-m-d");
$data_dia=date("d");
$data_mes=date("M");
$data_hora=date("H:i:s");



  if ($v_opcion=='admin_storageclear'){
      $v_dispositivo=htmlspecialchars($_POST['dispositivo'],ENT_QUOTES);
      $strQuery = "select * from admin_storage_clear where id_usu_disp='$v_dispositivo'";
      if ($conn->multi_query($strQuery)){
        if ($result=$conn->store_result()){
          while($row=$result->fetch_assoc()){
            $data[] = json_encode($row);

            $v_encontrado=1;
          }
          $result->free();
        }
      }
      if ($v_encontrado==0){
        echo 0;
      }else {
        echo json_encode($data);
      }


      $strQuery = "delete from admin_storage_clear where id_usu_disp='$v_dispositivo'";
  	  $conn->multi_query($strQuery);
  }

  // CONFIGURACION
  // -----------------------------------------------------------------------------------------------------------------------------------
  if ($v_opcion=='configuracion_color'){
		$v_color=$_POST['color'];
		$v_usuario=$_POST['usu'];
		$strQuery = "update admin_usu set color='$v_color' where id_usu=$v_usuario";
  	$conn->multi_query($strQuery);
  	echo 1;
	}
// usuario
// -----------------------------------------------------------------------------------------------------------------------------------
	if ($v_opcion=='usuario_entrar'){
		$v_correo=htmlspecialchars($_POST['email'],ENT_QUOTES);
    $v_encontrado=0;

			$strQuery = "select id_usu,usuario,imagen,correo,genero,fecha_cumple,
                  '$data_fecha' date, '$data_hora' time,color,frase,$data_dia dia,
      						'$data_mes' mes
                  from admin_usu
                  where correo='$v_correo'";

			if ($conn->multi_query($strQuery)){
		  	if ($result=$conn->store_result()){
		  		while($row=$result->fetch_assoc()){
		  			echo json_encode($row);
		  			$v_encontrado=1;
		  		}
		  		$result->free();
		  	}
	  	}
			if ($v_encontrado==0){
	  		echo 0;
	  	}
	}

	if ($v_opcion=='registro_google'){
		$v_id=$_POST['id'];
		$v_usuario=$_POST['usu'];
		$v_correo=htmlspecialchars($_POST['email'],ENT_QUOTES);
		$v_imagen=$_POST['imagen'];
		$strQuery = "insert into admin_usu (id_tiplog,id_login,usuario,nombre,correo,imagen,id_est,color) ".
                            " values (1,'$v_id','$v_usuario','$v_usuario','$v_correo','$v_imagen',1,'#2980b9')  ON DUPLICATE KEY UPDATE entrada=entrada+1";
	  	$conn->multi_query($strQuery);
	  	echo 1;
	}
	if ($v_opcion=='registro_facebook'){
		$v_usuario=$_POST['usu'];
		$v_id=$_POST['id'];
		$v_imagen=$_POST['imagen'];
		$strQuery = "insert into admin_usu (usuario,nombre,id_logintip,id_login,imagen) values ('$v_usuario','$v_usuario',2,$v_id,'$v_imagen')  ON DUPLICATE KEY UPDATE entrada=entrada+1";

	  	$conn->multi_query($strQuery);
	  	echo 1;
	}
	if ($v_opcion=='registro_correo'){
		$v_nombre=htmlspecialchars($_POST['nombre'],ENT_QUOTES);
		$v_apellido=htmlspecialchars($_POST['apellido'],ENT_QUOTES);
		$v_correo=htmlspecialchars($_POST['correo'],ENT_QUOTES);
		$v_genero=htmlspecialchars($_POST['genero'],ENT_QUOTES);
		$v_password=htmlspecialchars($_POST['password'],ENT_QUOTES);
		$strQuery = "insert into admin_usu (nombre,apellido,correo,genero,password) ".
								"values ('$v_nombre','$v_apellido','$v_correo','$v_genero','$v_password')  ON DUPLICATE KEY UPDATE entrada=entrada+1";

	  	$conn->multi_query($strQuery);

			$v_encontrado=0;
			$strQuery = "select id,usuario,imagen,correo,genero,fecha_cumple from admin_usu where correo='$v_correo'";
			if ($conn->multi_query($strQuery)){
		  	if ($result=$conn->store_result()){
		  		while($row=$result->fetch_assoc()){
		  			echo json_encode($row);
		  			$v_encontrado=1;
		  		}
		  		$result->free();
		  	}
	  	}
			if ($v_encontrado==0){
	  		echo 0;
	  	}
	}

	if ($v_opcion=='usuario_dispositivo'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_dispositivo=$_POST['dispositivo'];
		$strQuery = "insert into admin_usu_disp (codigo,id_usu) ".
								"values ('$v_dispositivo',$v_usuario)  ON DUPLICATE KEY UPDATE num_entrada=num_entrada+1";
	  	$conn->multi_query($strQuery);

      $strQuery = "	select id from  admin_usu_disp  where codigo='$v_dispositivo'";
      $conn->multi_query($strQuery);
      $result=$conn->store_result();
      $row=$result->fetch_assoc();
      echo $row['id'];
	}

  if ($v_opcion=='inicio_notificacion'){
    $v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
    $v_encontrado=0;
    $strQuery = "select * from admin_notifi where id_usu=$v_usuario order by fecha_creado desc LIMIT 10";
      if ($conn->multi_query($strQuery)){
        if ($result=$conn->store_result()){
          while($row=$result->fetch_assoc()){
            $row['fecha_creado'] =time_elapsed_string($row['fecha_creado']);
            $data[] = json_encode($row);
            $v_encontrado=1;
          }
          $result->free();
        }
      }
      if ($v_encontrado==0){
  			echo 0;
  		}else{
  			echo json_encode($data);
  		}
  }

	if ($v_opcion=='inicio_perfil'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_encontrado=0;

		$strQuery = "select * from	admin_usu	where	id_usu=$v_usuario" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

  // eventos
  // -----------------------------------------------------------------------------------------------------------------------------------
    if ($v_opcion=='evento'){
    $vusuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);

    $strQuery = "select b.id_curs,b.curso,'tar' tipo,a.id_tar codigo, a.tarea titulo,a.descripcion,a.fecha_creacion,a.fecha_finalizacion,
                  DATE_FORMAT(a.fecha_finalizacion,'%d') dia,
                  DATE_FORMAT(a.fecha_finalizacion,'%b') mes
                  from curs_tar a,curs_nom b,curs_asig c
                  where a.id_curs=b.id_curs and b.id_curs=c.id_curs and c.id_usu=$vusuario
                  union all
                  select b.id_curs,b.curso,'tem' tipo,a.id_tem codigo, a.tema titulo,a.descripcion,a.fecha_habilitacion,a.fecha_habilitacion,
                  DATE_FORMAT(a.fecha_habilitacion,'%d') dia,
                  DATE_FORMAT(a.fecha_habilitacion,'%b') mes
                  from curs_tem a,curs_nom b,curs_asig c
                  where a.id_curs=b.id_curs and b.id_curs=c.id_curs and c.id_usu=$vusuario
                  order by 8 desc,2" ;
    if ($conn->multi_query($strQuery)){
      if ($result=$conn->store_result()){
        while($row=$result->fetch_assoc()){
          $data[] = json_encode($row);
          $v_encontrado=1;
        }
        $result->free();
      }
    }
    if ($v_encontrado==0){
      echo 0;
    }else{
      echo json_encode($data);
    }
  }

//curso
// -----------------------------------------------------------------------------------------------------------------------------------
	// administrador de cursos
	if ($v_opcion=='curso_nuevo'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_nombre=htmlspecialchars($_POST['nombre'],ENT_QUOTES);
		$v_descripcion=htmlspecialchars($_POST['descripcion'],ENT_QUOTES);
		$v_carpeta=htmlspecialchars($_POST['carpeta'],ENT_QUOTES);
		$v_tag=htmlspecialchars($_POST['tag'],ENT_QUOTES);

		if (isset($_POST['nombre']) && trim($_POST['nombre'])!=''){
			$strQuery = "	select count(*) as conteo from  curs_nom  where nombre='$v_nombre'";

			$conn->multi_query($strQuery);
			$result=$conn->store_result();
			$row=$result->fetch_assoc();
			$existe=0;
			$existe=$row['conteo'];
		  	$result->free();

			if ($existe==0){
					$strQuery = "insert into curs_nom (nombre,descripcion,id_carp,id_usu) values ('$v_nombre','$v_descripcion',$v_carpeta,$v_usuario)";
			  	$conn->multi_query($strQuery);
					echo 1;
			}else{
				echo 'Existe un curso con esa información';
			}
		}else{
		echo 'Debe de ingresar un nombre del curso valido';
		}
	}

	if ($v_opcion=='curso'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_encontrado=0;

		$strQuery = "
		select a.*,c.*,b.id_rol,
			lpad((select count(*) from curs_tem where curs_tem.id_curs=a.id_curs),2,'0') as conteo_tema,
			lpad((select count(*) from curs_tar where curs_tar.id_curs=a.id_curs),2,'0') as conteo_tarea,
			lpad((select count(*) from curs_adj where curs_adj.id_curs=a.id_curs),2,'0') as conteo_adjunto
		from
			curs_nom a,curs_asig b, admin_usu c
		where
			a.id_curs=b.id_curs
			and a.id_usu=c.id_usu
			and b.id_usu=$v_usuario
		order by
			b.id_rol desc,a.curso" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

	if ($v_opcion=='curso_busqueda'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['asignar'])){
			$v_curso=$_POST['curso'];
			$strQuery = "insert into curs_asig (id_usu,id_curs,id_rol,id_est)
					values
					($v_usuario,$v_curso,1,1)";
			$conn->multi_query($strQuery);
		}

		$strQuery = "
		select a.id_curs,a.codigo,a.curso,c.usuario,count(b.id_usu) asignado
		from curs_nom a left join curs_asig b on a.id_curs=b.id_curs and b.id_est=1 and  b.id_usu=$v_usuario , admin_usu c
		where  a.id_usu=c.id_usu and a.id_est=1 group by 1,2,3,4 order by a.curso" ;

		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

	if ($v_opcion=='curso_detalle'){
			$v_curso=htmlspecialchars($_POST['curso'],ENT_QUOTES);
			$v_rol=htmlspecialchars($_POST['rol'],ENT_QUOTES);

			$strQuery = "select 'tema' as tipo,id_tem,tema,descripcion,fecha_creacion,'' as fecha_finalizacion
					from  curs_tem
					where id_curs=$v_curso
					union
					select 'tarea' as tipo,id_tar,tarea,descripcion,fecha_creacion,fecha_finalizacion
					from curs_tar
					where id_curs=$v_curso
					union
					select 'adjunto' as tipo,id_adj,nombre_archivo,codigo_archivo,fecha_creacion,'' as fecha_finalizacion
					from curs_adj
					where id_curs=$v_curso";

			if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					echo json_encode($row).'--%';
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}
	}

	// tareas
	// -----------------------------------------------------------------------------------------------------------------------------------
	if ($v_opcion=='curso_tarea_nuevo'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_curso=htmlspecialchars($_POST['curso'],ENT_QUOTES);
		$v_descripcion=htmlspecialchars($_POST['descripcion'],ENT_QUOTES);
		$v_tarea=htmlspecialchars($_POST['tarea'],ENT_QUOTES);
		$v_tipo=htmlspecialchars($_POST['tipo'],ENT_QUOTES);
		$v_finaliza=htmlspecialchars($_POST['fecha_finalizacion'],ENT_QUOTES);

		if (isset($_POST['tarea']) && trim($_POST['tarea'])!=''){

			$strQuery = "insert into curs_tar (tarea,descripcion,id_tip,id_curs,id_usu,fecha_finalizacion) values ('$v_tarea','$v_descripcion',$v_tipo,$v_curso,$v_usuario,'$v_finaliza')";
			$conn->multi_query($strQuery);

			if ($v_tipo==2){
				$strQuery = "SELECT max(id_tar) as conteo from curs_tar";
				$conn->multi_query($strQuery);
				$result=$conn->store_result();
				$row=$result->fetch_assoc();
				$existe=0;
				$codigo=$row['conteo'];
			  	$result->free();

				$v_palabra=htmlspecialchars($_POST['palabras'],ENT_QUOTES);
				$data=json_decode($_POST['palabras']);

				foreach ($data as &$valor) {
					echo '>>'.$valor;
					$strQuery = "insert into curs_tar_glos (id_tar,palabra) values ($codigo,'$valor')";
					echo $strQuery;
			    	$conn->multi_query($strQuery);
				}
			}
			echo 1;
		}else{
			echo 'Debe de ingresar el titulo de la tarea';
		}
	}

	if ($v_opcion=='curso_tarea_nuevo_glosario'){
		$v_tarea=htmlspecialchars($_POST['id_tarea'],ENT_QUOTES);
		$v_palabra=htmlspecialchars($_POST['palabra'],ENT_QUOTES);

		if (isset($_POST['palabra']) && trim($_POST['palabra'])!=''){

			$strQuery = "insert into curs_tar (tarea,descripcion,id_curs,id_usu,fecha_finalizacion) values ('$v_tarea','$v_descripcion',$v_curso,$v_usuario,'$_finaliza')";
			  	$conn->multi_query($strQuery);
					echo 1;
		}else{
			echo 'Debe de ingresar el titulo de la tarea';
		}
	}

	if ($v_opcion=='curso_tareas'){
		$v_curso=htmlspecialchars($_POST['id'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['eliminar'])){
			$tarea=$_POST['tarea'];
			$strQuery = "delete from curs_tar_glos where id_tar=$tarea";
			$conn->multi_query($strQuery);
			$strQuery = "delete from curs_tar where id_tar=$tarea";
			$conn->multi_query($strQuery);
		}

		$strQuery = "select *,DATE_FORMAT(fecha_finalizacion,'%d/%m/%Y') finalizacion from curs_tar where id_curs=$v_curso order by fecha_finalizacion desc" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

	if ($v_opcion=='curso_tareasdet'){
		$v_tarea=htmlspecialchars($_POST['id'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['eliminar'])){
			$tarea=$_POST['tarea'];
			$strQuery = "delete from curs_tar_glos where id_tar=$tarea";
			$conn->multi_query($strQuery);
			$strQuery = "delete from curs_tar where id_tar=$tarea";
			$conn->multi_query($strQuery);
		}

		$strQuery = "select * from curs_tar where id_tar=$v_tarea" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}



	// temas
	// -----------------------------------------------------------------------------------------------------------------------------------
	if ($v_opcion=='curso_tema_nuevo'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_curso=htmlspecialchars($_POST['curso'],ENT_QUOTES);
		$v_descripcion=htmlspecialchars($_POST['descripcion'],ENT_QUOTES);
		$v_tema=htmlspecialchars($_POST['tema'],ENT_QUOTES);

		$v_finaliza=htmlspecialchars($_POST['fecha_habilitacion'],ENT_QUOTES);

		if (isset($_POST['tema']) && trim($_POST['tema'])!=''){

			$strQuery = "insert into curs_tem (tema,descripcion,id_curs,id_usu,fecha_habilitacion) values ('$v_tema','$v_descripcion',$v_curso,$v_usuario,'$v_finaliza')";
			$conn->multi_query($strQuery);

			echo $strQuery;
		}else{
			echo 'Debe de ingresar el titulo del tema';
		}
	}

  if ($v_opcion=='curso_tema_comentario'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_comentario=htmlspecialchars($_POST['comentario'],ENT_QUOTES);
		$v_tema=htmlspecialchars($_POST['tema'],ENT_QUOTES);

		if (isset($_POST['tema']) && trim($_POST['tema'])!=''){

			$strQuery = "insert into curs_tem_comment (id_tem,comentario,id_usu) values ('$v_tema','$v_comentario',$v_usuario)";
			$conn->multi_query($strQuery);
      $data['success']=1;
      $data['query']=$strQuery;
			echo json_encode($data);
		}else{
			echo 'Debe de ingresar el titulo del tema';
		}
	}

  if ($v_opcion=='curso_temas'){
		$v_curso=htmlspecialchars($_POST['id'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['eliminar'])){
			$tema=$_POST['tema'];
			$strQuery = "delete from curs_tem where id_tar=$tema";
			$conn->multi_query($strQuery);
		}

		$strQuery = "select *,DATE_FORMAT(fecha_habilitacion,'%d/%m/%Y') habilitacion from curs_tem where id_curs=$v_curso order by fecha_habilitacion desc" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

	if ($v_opcion=='curso_temasdet'){
		$v_tema=htmlspecialchars($_POST['id'],ENT_QUOTES);
    $v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['eliminar'])){
			$tarea=$_POST['tarea'];
			$strQuery = "delete from curs_tar_glos where id_tar=$tarea";
			$conn->multi_query($strQuery);
			$strQuery = "delete from curs_tar where id_tar=$tarea";
			$conn->multi_query($strQuery);
		}

		$strQuery = "select * from curs_tem a left join favorito b on a.id_tem=b.tipo_id and b.tipo='tem' and b.id_usu=$v_usuario where a.id_tem=$v_tema" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

  if ($v_opcion=='curso_temascomment'){
		$v_tema=htmlspecialchars($_POST['id'],ENT_QUOTES);
    $gusuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_encontrado=0;

		$strQuery = " select a.*,d.usuario,d.imagen,c.curso,DATE_FORMAT(a.fecha_creacion,'%d/%m/%Y') creado,$gusuario gusuario from curs_tem_comment a,curs_tem b,curs_nom c,admin_usu d
                  where a.id_tem=b.id_tem and b.id_curs=c.id_curs and a.id_usu=d.id_usu and a.id_tem=$v_tema order by a.fecha_creacion desc" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

	// cronograma
	// -----------------------------------------------------------------------------------------------------------------------------------
		if ($v_opcion=='curso_cronograma'){
		$v_curso=htmlspecialchars($_POST['id'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['eliminar'])){
			$tarea=$_POST['tarea'];
			$strQuery = "delete from curs_tar_glos where id_tar=$tarea";
			$conn->multi_query($strQuery);
			$strQuery = "delete from curs_tar where id_tar=$tarea";
			$conn->multi_query($strQuery);
		}

		$strQuery = "select id_curs,'tar' tipo,id_tar codigo, tarea titulo,descripcion,fecha_finalizacion,
						DATE_FORMAT(fecha_finalizacion,'%d') dia,
						DATE_FORMAT(fecha_finalizacion,'%b') mes
						from curs_tar
						where id_curs=$v_curso
					union all
 					select id_curs, 'tem' tipo,id_tem codigo, tema titulo,descripcion,fecha_habilitacion,
                        DATE_FORMAT(fecha_habilitacion,'%d') dia,
                        DATE_FORMAT(fecha_habilitacion,'%b') mes
                        from curs_tem
                        where id_curs=$v_curso
						order by 6 desc" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}

	// adjuntos
	// -----------------------------------------------------------------------------------------------------------------------------------
	if ($v_opcion=='curso_adjuntos' || $v_opcion=='curso_tareas__adjuntos'){

		$v_curso=htmlspecialchars($_POST['curso'],ENT_QUOTES);
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_encontrado=0;

		if (isset($_POST['eliminar'])){
			$v_adjunto=htmlspecialchars($_POST['adjunto'],ENT_QUOTES);
			$strQuery = "delete from curs_adj where id_adj=$v_adjunto";
			$conn->multi_query($strQuery);
		}
		// agregando registros
		if (isset($_POST['agregar'])){
			$v_codarchivo=htmlspecialchars($_POST['codigo_archivo'],ENT_QUOTES);
			$v_archivo=htmlspecialchars($_POST['archivo'],ENT_QUOTES);
			if (isset($_POST['tarea'])){
				$v_tarea=htmlspecialchars($_POST['tarea'],ENT_QUOTES);
				$strQuery = "insert into curs_adj (codigo_archivo,nombre_archivo,id_curs,id_tar,id_usu)
						values
						('$v_codarchivo','$v_archivo',$v_curso,$v_tarea,$v_usuario)";
				$conn->multi_query($strQuery);
			}else{
				$strQuery = "insert into curs_adj (codigo_archivo,nombre_archivo,id_curs,id_usu)
						values
						('$v_codarchivo','$v_archivo',$v_curso,$v_usuario)";
				$conn->multi_query($strQuery);
			}
		}

	    if (isset($_POST['tarea'])){
	        $v_tarea=htmlspecialchars($_POST['tarea'],ENT_QUOTES);
			    $strQuery = "select a.*,DATE_FORMAT(a.fecha_creacion,'%d/%m/%Y') creacion,b.usuario
	            				from curs_adj a, admin_usu b
	            				where a.id_usu=b.id_usu and a.id_curs=$v_curso and a.id_tar=$v_tarea and a.id_usu=$v_usuario " ;
	    }else{
	      $strQuery = "select a.*,a1.tarea titulo, DATE_FORMAT(if(a.id_tar=0,a.fecha_creacion,a1.fecha_finalizacion),'%d/%m/%Y') fecha,b.usuario
	                  from curs_adj a left join curs_tar a1 on a.id_tar = a1.id_tar, admin_usu b
	                  where a.id_usu=b.id_usu and a.id_curs=$v_curso and a.id_usu=$v_usuario order by titulo,fecha" ;
	    }

		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}


  // favoritos
	// -----------------------------------------------------------------------------------------------------------------------------------
	if ($v_opcion=='favorito'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_tipo=htmlspecialchars($_POST['tipo'],ENT_QUOTES);
		$v_id=htmlspecialchars($_POST['id'],ENT_QUOTES);
    $v_select=htmlspecialchars($_POST['select'],ENT_QUOTES);

      if ($_POST['select']){
  			$strQuery = "insert into favorito (id_usu,tipo,tipo_id) values ($v_usuario,'$v_tipo',$v_id)";
  			$conn->multi_query($strQuery);
  			echo 1;
      }else{
        $strQuery = "delete from favorito where id_usu=$v_usuario and tipo='$v_tipo' and tipo_id=$v_id";
  			$conn->multi_query($strQuery);
  			echo 1;
      }
	}
  if ($v_opcion=='favorito_listado'){
    $v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);

        $strQuery = "select 'tem' tipo,a.id_fav,b.id_tem,b.tema,b.descripcion,b.id_curs,c.curso from favorito a, curs_tem b,curs_nom c where a.tipo_id=b.id_tem and a.tipo='tem' and b.id_curs=c.id_curs and a.id_usu=$v_usuario
                    union all
                    select 'tar' tipo,a.id_fav,b.id_tar,b.tarea,b.descripcion,b.id_curs,c.curso from favorito a, curs_tar b,curs_nom c where a.tipo_id=b.id_tar and a.tipo='tar' and b.id_curs=c.id_curs and a.id_usu=$v_usuario";
        if ($conn->multi_query($strQuery)){
    			if ($result=$conn->store_result()){
    				while($row=$result->fetch_assoc()){
    					$data[] = json_encode($row);
    					$v_encontrado=1;
    				}
    				$result->free();
    			}
    		}
    		if ($v_encontrado==0){
    			echo 0;
    		}else{
    			echo json_encode($data);
    		}

  }

//Comentarios

	if ($v_opcion=='comentario_nuevo'){
		$v_usuario=htmlspecialchars($_POST['usuario'],ENT_QUOTES);
		$v_comentario=htmlspecialchars($_POST['comentario'],ENT_QUOTES);
		$strQuery = "insert into admin_comentario (id_usu,comentario) ".
								"values ($v_usuario,'$v_comentario')";
	  	$conn->multi_query($strQuery);
		echo 1;
	}

	if ($v_opcion=='comentario_lista'){
		$v_encontrado=0;

		$strQuery = "select * from admin_comentario order by  fecha_creado" ;
		if ($conn->multi_query($strQuery)){
			if ($result=$conn->store_result()){
				while($row=$result->fetch_assoc()){
					$data[] = json_encode($row);
					$v_encontrado=1;
				}
				$result->free();
			}
		}
		if ($v_encontrado==0){
			echo 0;
		}else{
			echo json_encode($data);
		}
	}


  function time_elapsed_string($datetime, $full = false) {
      $now = new DateTime;
      $ago = new DateTime($datetime);
      $diff = $now->diff($ago);

      $diff->w = floor($diff->d / 7);
      $diff->d -= $diff->w * 7;

      $string = array(
          'y' => 'año',
          'm' => 'mes',
          'w' => 'semana',
          'd' => 'dia',
          'h' => 'hora',
          'i' => 'minuto',
          's' => 'segundo',
      );
      foreach ($string as $k => &$v) {
          if ($diff->$k) {
              $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
          } else {
              unset($string[$k]);
          }
      }

      if (!$full) $string = array_slice($string, 0, 1);
      return $string ? 'hace '.implode(', ', $string)  : 'justo ahora';
  }


mysqli_close($conn);


 ?>
