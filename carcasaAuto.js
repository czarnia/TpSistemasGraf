function CarcasaAuto(){
  this.superficie = new supBarrido();
	this.perfil = {
		forma:[],
		normal:[]
	}
  this.perfil_curva = null;
  this.perfil_completo = null;
  this.tapa1 = new SupFan();
  this.tapa2 = new SupFan();
	this.largo = null; //x
	this.alto = null; //y
  this.ancho = null; //z

  this.traslacion_tapa1 = null; //las rotaciones y traslaciones de la superficie son las mismas que las del auto.
  this.traslacion_tapa2 = null;

  this.create = function(largo, alto, ancho, color){
    this.largo = largo;
  	this.alto = alto;
    this.ancho = ancho;
    var camino = this.camino();
    var color_tapa = [color[0]+02, color[1]+0.2, color[2]+0.5];
    this.crear_perfil(100);
    this.crear_perfil_completo(100);
    this.superficie.create(camino, 40, this.perfil.forma, this.perfil.normal, color);
    this.tapa1.create(this.perfil_completo, color_tapa);
    this.tapa2.create(this.perfil_completo, color_tapa);

    this.traslacion_tapa1 = mat4.create();
    mat4.identity(this.traslacion_tapa1);
    mat4.translate(this.traslacion_tapa1, this.traslacion_tapa1, [0,0,-ancho/2]);

    this.traslacion_tapa2 = mat4.create();
    mat4.identity(this.traslacion_tapa2);
    mat4.translate(this.traslacion_tapa2, this.traslacion_tapa2, [0,0,ancho/2]);
  }

  this.camino = function(){
		var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([0,0,-this.ancho/2]);
    puntos_control.push([0,0,-this.ancho/2]);
    puntos_control.push([0,0,-this.ancho/2]);
    puntos_control.push([0,0,-this.ancho/2]);

    puntos_control.push([0,0,this.ancho/2]);
    puntos_control.push([0,0,this.ancho/2]);
    puntos_control.push([0,0,this.ancho/2]);
    puntos_control.push([0,0,this.ancho/2]);

		camino.create(puntos_control);
		return camino;
  }

  this.crear_perfil_completo = function(step){
    var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);

    puntos_control.push([-(this.largo/2), -(this.alto/2), 0]);

    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);

    puntos_control.push([-(this.largo/2), 0, 0]);

    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);

    puntos_control.push([-(this.largo/8), this.alto/2, 0]);

    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);

    puntos_control.push([this.largo*0.30, this.alto/2, 0]);

    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);

    puntos_control.push([(this.largo/2), 0, 0]);

    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);

    puntos_control.push([(this.largo/2), -(this.alto/2), 0]);

    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);


    camino.create(puntos_control);

    this.perfil_completo = [];

    for (var i = 0; i < step; i++){
      var u = (camino.valores_u/step)*i;
      var punto = camino.get_punto(u);
      this.perfil_completo.push(punto);
    }
  }

  this.crear_perfil = function(step){
    var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([0, -(this.alto/2), 0]);

    puntos_control.push([-(this.largo/2), -(this.alto/2), 0]);

    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);

    puntos_control.push([-(this.largo/2), 0, 0]);

    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);

    puntos_control.push([-(this.largo/8), this.alto/2, 0]);

    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);

    puntos_control.push([this.largo*0.30, this.alto/2, 0]);

    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);

    puntos_control.push([(this.largo/2), 0, 0]);

    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);

    puntos_control.push([(this.largo/2), -(this.alto/2), 0]);

    puntos_control.push([0, -(this.alto/2), 0]);


    camino.create(puntos_control);

    for (var i = 0; i < step; i++){
      var u = (camino.valores_u/step)*i;
      var punto = camino.get_punto(u);
      this.perfil.forma.push(punto);
    }

    this.perfil.normal.push([0,0,1]);
    this.perfil.normal.push([0,1,0]);
    this.perfil_curva = camino;
  }

  this.setupWebGLBuffers = function(){
    this.tapa1.setupWebGLBuffers();
    this.tapa2.setupWebGLBuffers();
    this.superficie.setupWebGLBuffers();
  }

  this.draw = function(mvMatrix_scene){
    var mvMatrix_tapa1 = mat4.create();
    var mvMatrix_tapa2 = mat4.create();

    mat4.multiply(mvMatrix_tapa1, mvMatrix_scene, this.traslacion_tapa1);
    mat4.multiply(mvMatrix_tapa2, mvMatrix_scene, this.traslacion_tapa2);

    this.superficie.draw(mvMatrix_scene);
    this.tapa1.draw(mvMatrix_tapa1);
    this.tapa2.draw(mvMatrix_tapa2);
  }

  this.translate = function(v){
    /*this.superficie.translate(v);
    this.tapa1.translate_acum(v);
    this.tapa2.translate_acum(v);*/
  }

  this.rotate = function(eje, angulo){
    /*this.superficie.rotate(angulo,eje);
    this.tapa1.rotate(angulo,eje);
    this.tapa2.rotate(angulo,eje);*/
  }

  this.translate_acum = function(v){
    /*this.superficie.translate_acum(v);
    this.tapa1.translate_acum(v);
    this.tapa2.translate_acum(v);*/
  }

  this.rotate_acum = function(eje, angulo){
    /*this.superficie.rotate_acum(angulo,eje);
    this.tapa1.rotate_acum(angulo,eje);
    this.tapa2.rotate_acum(angulo,eje);*/
  }

  this.initTexture = function(texture_file){
		this.tapa1.initTexture(texture_file);
		this.tapa2.initTexture(texture_file);
		this.superficie.initTexture(texture_file);
		this.create_text_buffer();
	}

  this.create_text_buffer = function(){
    var texture_buffer_tapas = [];
    var texture_buffer_superfice = [];

		this.perfil_curva.discretizar_step(this.perfil.forma.length);

    var longitudes_sup = this.obtener_longitud_curva_superior();

		var long_curva = this.perfil_curva.distancias_discret[this.perfil_curva.distancias_discret.length-1];

    for (var j = 0; j < 40; j++){
      for (var i = 0; i < this.perfil.forma.length; i++){
        var u = 0.035+0.90*this.perfil_curva.distancias_discret[i]/long_curva;
        var v = 1.2-((j/40)*(2.5/3));

        texture_buffer_superfice.push(u);
        texture_buffer_superfice.push(v);
      }
    }

    texture_buffer_tapas.push(0.5);
    texture_buffer_tapas.push(0.5);

    for (var i = 0; i < this.perfil_completo.length; i++){
      var punto = this.perfil_completo[i];
      var u = 0.9*(punto[0]+this.largo/2)/this.largo+0.05;
      var v = 0.9/3*((punto[1]+this.alto/2)/this.alto)+1/3;

      texture_buffer_tapas.push(u);
      texture_buffer_tapas.push(v);
    }



    this.tapa1.asign_text_buffer(texture_buffer_tapas);
    this.tapa2.asign_text_buffer(texture_buffer_tapas);
    this.superficie.asign_text_buffer(texture_buffer_superfice);
  }

  this.obtener_longitud_curva_superior = function(){
    var longitudes = [];
    var long = 0;
    var ant = [0,0,0];
    for (var i = 0; i < this.perfil.forma.length; i++){
      var punto = this.perfil.forma[i];
      if (punto[2] != -this.alto/2){
        var dist = vec3.distance(vec3.fromValues(ant[0], ant[1], ant[2]), vec3.fromValues(punto[0], punto[1], punto[2]));
        long += dist;
        ant = punto;
      }if (dist == 0){
        longitudes.push(0);
      }else{
          longitudes.push(long);
      }
    }
    return longitudes;
  }

}
