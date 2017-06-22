function Auto(){
  this.carcasa = new CarcasaAuto();
  this.ruedas = [];
  this.movimientos = [];
  this.curva_mov = null;
  this.ubic = null;
  this.step = null;
  this.t = null;
  this.rotacion = null;
  this.traslacion = null;

  this.pos_inicio_mov = null;

  this.create = function(color_carcasa, color_rueda, ancho, alto, largo, r_rueda, ancho_rueda){
    var posiciones_ruedas = [[-1/5*largo, -alto/2, -ancho/2], [1/4*largo, -alto/2, -ancho/2], [-1/5*largo, -alto/2, ancho/2], [1/4*largo, -alto/2, ancho/2]];

    this.ubic = 0;
    this.t = 0;

    this.carcasa.create(largo, alto, ancho, color_carcasa);
    for (var i = 0; i < 4; i++){
      var r = new Rueda();
      r.create(r_rueda, ancho_rueda, color_rueda);
      r.translate(posiciones_ruedas[i]);
      this.ruedas.push(r);
    }

    this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);
  }

  this.draw = function(mvMatrix_scene){
    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    var mvMatrix_auto = mat4.create();
    mat4.identity(mvMatrix_auto);
    mat4.multiply(mvMatrix_auto, this.traslacion, this.rotacion);

    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_auto);

    this.carcasa.draw(mvMatrix_total);

    for (var i = 0; i < 4; i++){
      this.ruedas[i].draw(mvMatrix_total);
    }
  }

  this.setupWebGLBuffers = function(){
    this.carcasa.setupWebGLBuffers();
    for (var i = 0; i < 4; i++){
      this.ruedas[i].setupWebGLBuffers();
    }
  }

  this.translate_acum = function(v){
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.translate = function(v){
		mat4.identity(this.traslacion);
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.rotate_acum = function(eje, grados){
		mat4.rotate(this.rotacion, this.rotacion, grados, vec3.fromValues(eje[0], eje[1], eje[2]));
	}

	this.rotate = function(eje, grados){
		mat4.identity(this.rotacion);
		mat4.rotate(this.rotacion, this.rotacion, grados, vec3.fromValues(eje[0], eje[1], eje[2]));
	}

  this.mover = function(){
    var nivel = (this.curva_mov.valores_u/this.step)*(this.step-this.ubic);
    var punto = this.curva_mov.get_punto(nivel);

    var tan = this.curva_mov.get_tan(nivel);
    var normal = this.curva_mov.get_normal(nivel);
    //La binormal es el producto vectorial entre la normal y la tangente
    //Traslado la curva camino al punto del nivel

    var mat_traslacion = mat4.create();

    var normal_auto = [1,0,0];

    mat4.identity(mat_traslacion);
    mat4.translate(mat_traslacion, mat_traslacion, punto);

    //this.translate_acum(punto);

    //******PARA QUE COINCIDA CON LA TANGENTE*******
    vec3.normalize(tan, tan);
    vec3.normalize(normal_auto, normal_auto);
    var angulo = Math.acos(vec3.dot(tan, normal_auto));

    var eje = vec3.create();
    vec3.cross(eje, tan, normal_auto);

    var mat_rotacion_tan = mat4.create();
    mat4.identity(mat_rotacion_tan);
    mat4.rotate(mat_rotacion_tan, mat_rotacion_tan, -angulo, eje);

    //La forma debe tener la orientacion de la normal, entonces la roto acorde
    this.rotate(eje, -angulo);

    //******PARA QUE COINCIDA CON LA NORMAL*******
    normal_mod = vec3.create();
    vec3.transformMat4(normal_mod, [0,1,0], mat_rotacion_tan);
    vec3.normalize(normal, normal);
    vec3.normalize(normal_mod, normal_mod);
    var angulo_norm = Math.acos(vec3.dot(normal, normal_mod));

    var eje_norm = vec3.create();
    //Para que gire para el otro lado
    vec3.cross(eje_norm, normal_mod, normal); //VERSION BIEN

    var mat_rotacion_norm = mat4.create();
    mat4.identity(mat_rotacion_norm);
    mat4.rotate(mat_rotacion_norm, mat_rotacion_norm, angulo_norm, eje_norm);

    this.rotate_acum(eje_norm, angulo_norm);

    this.translate(punto);
    mat4.multiply(this.traslacion, this.pos_inicio_mov, this.traslacion);

    this.rotacion = mat4.create();
    mat4.multiply(this.rotacion, mat_rotacion_norm, mat_rotacion_tan);

    var pos_act = vec3.fromValues(this.movimientos[this.ubic][0], this.movimientos[this.ubic][1], this.movimientos[this.ubic][2]);
    if (this.ubic == 0){
      var pos_ant = vec3.fromValues(this.movimientos[this.movimientos.length-1][0], this.movimientos[this.movimientos.length-1][1], this.movimientos[this.movimientos.length-1][2]);
    }else{
      var pos_ant = vec3.fromValues(this.movimientos[this.ubic-1][0], this.movimientos[this.ubic-1][1], this.movimientos[this.ubic-1][2]);
    }

    var distancia = vec3.distance(pos_act, pos_ant);

    for (var i = 0; i < 4; i++){
      var angulo = distancia/(Math.PI);
      this.ruedas[i].rotate_acum([0,0,1], angulo);
    }

  }

  this.agregar_movimiento = function(curva, step){
    this.pos_inicio_mov = mat4.create()
    mat4.copy(this.pos_inicio_mov, this.traslacion);
    for (var i = 0; i < step; i++){
      var u = (curva.valores_u/step)*(step-i);
      var punto = curva.get_punto(u);
      this.movimientos.push(punto);
    }
    this.curva_mov = curva;
    this.step = step;
  }

  this.tick = function(t){
    this.ubic += 1;
    if (this.ubic >= this.movimientos.length){
      this.ubic = 0;
    }
    this.mover();
  }
}
