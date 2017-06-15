function Auto(){
  this.carcasa = new CarcasaAuto();
  this.ruedas = [];
  this.movimientos = [];
  this.curva_mov = null;
  this.ubic = null;
  this.velocidad = null;
  this.step = null;
  this.t = null;
  this.rotacion = null;
  this.traslacion = null;

  this.create = function(color_carcasa, color_rueda, ancho, alto, largo, r_rueda, ancho_rueda, velocidad){
    var posiciones_ruedas = [[-1/5*largo, -alto/2, -ancho/2], [1/4*largo, -alto/2, -ancho/2], [-1/5*largo, -alto/2, ancho/2], [1/4*largo, -alto/2, ancho/2]];

    this.velocidad = velocidad;
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

    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);

    this.carcasa.draw();
    /*for (var i = 0; i < 4; i++){
      var mvMatrix_rueda = mvMatrix_scene * mvMatrix_rueda[i];
      gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_rueda);

      this.ruedas[i].draw();
    }*/
    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_scene);
  }

  this.setupWebGLBuffers = function(){
    this.carcasa.setupWebGLBuffers();
    for (var i = 0; i < 4; i++){
      this.ruedas[i].setupWebGLBuffers();
    }
  }

  this.translate = function(v){
    this.carcasa.translate(v);
    for (var i = 0; i < 4; i++){
      this.ruedas[i].translate(v);
    }
  }

  this.rotate = function(eje, angulo){
    this.carcasa.rotate(eje, angulo);
    for (var i = 0; i < 4; i++){
      //this.ruedas[i].rotate(eje, angulo);
    }
  }

  this.mover = function(v){
    var punto = this.movimientos[this.ubic];
    var nivel = (this.curva_mov.valores_u/this.step)*this.ubic;

    var tan = this.curva_mov.get_tan(nivel);
    var normal = this.curva_mov.get_normal(nivel);
    //La binormal es el producto vectorial entre la normal y la tangente
    //Traslado la curva camino al punto del nivel
    var mat_traslacion = mat4.create();

    var normal_auto = [0,0,1];
    mat4.identity(mat_traslacion);
    mat4.translate(mat_traslacion, mat_traslacion, punto);

    //******PARA QUE COINCIDA CON LA TANGENTE*******
    vec3.normalize(tan, tan);
    vec3.normalize(normal_auto, normal_auto);
    var angulo = Math.acos(vec3.dot(tan, normal_auto));

    var eje = vec3.create();
    vec3.cross(eje, tan, normal_auto);
    var mat_rotacion_tan = mat4.create();
    mat4.identity(mat_rotacion_tan);
    mat4.rotate(mat_rotacion_tan, mat_rotacion_tan, angulo, eje);

    //La forma debe tener la orientacion de la normal, entonces la roto acorde
    //this.rotate(eje, angulo);

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

    this.traslacion = mat_traslacion;
    this.rotacion = mat4.create();
    mat4.multiply(this.rotacion, mat_rotacion_norm, mat_rotacion_tan);

  }

  this.agregar_movimiento = function(curva, step){
    for (var i = 0; i < step; i++){
      var u = (curva.valores_u/step)*i;
      var punto = curva.get_punto(u);
      this.movimientos.push(punto);
    }
    this.curva_mov = curva;
    this.step = step;
  }

  this.tick = function(t){
    //this.t += t;
    //if (!(this.t >= 1/this.velocidad)){
      //return;
    //}
    //this.t = 0;
    this.ubic += 1;
    if (this.ubic >= this.movimientos.length){
      this.ubic = 0;
    }
    this.mover(this.movimientos[this.ubic]);
  }
}
