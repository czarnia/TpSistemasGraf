function CarcasaAuto(){
  this.superficie = new supBarrido();
	this.perfil = {
		forma:[],
		normal:[],
    normales:[]
	}
  this.normales_tapa1 = [];
  this.normales_tapa2 = [];
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
    this.superficie.create(camino, 40, this.perfil, color);

    this.perfil.normales = this.normales_tapa1;
    this.tapa1.create(this.perfil, color_tapa);
    
    this.perfil.normales = this.normales_tapa2;
    this.tapa2.create(this.perfil, color_tapa);

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

  this.crear_perfil = function(step){
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

    for (var i = 0; i < step; i++){
      var u = (camino.valores_u/step)*i;
      var punto = camino.get_punto(u);
      this.perfil.forma.push(punto);
      this.perfil.normales.push([0.0, 1.0, 0.0]);
      this.normales_tapa1.push([0.0, 0.0, 1.0]);
      this.normales_tapa2.push([0.0, 0.0, -1.0]);
    }

    this.perfil.normal.push([0,0,1]);
    this.perfil.normal.push([0,1,0]);
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

}
