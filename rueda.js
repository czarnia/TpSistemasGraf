function Rueda(){
	this.superficie = new supRevolucion();
	this.perfil = {
		forma:null,
		normal:null
	}
  this.radio = null;
  this.profundidad = null;
	this.rotacion = null;
	this.traslacion = null;

	this.crear_perfil = function(){
		this.perfil.forma = [];
		this.perfil.normal = [];

		this.perfil.forma.push([this.radio, 0.0, -this.profundidad/2]);
    this.perfil.forma.push([0.0, 0.0, -this.profundidad/2]);
    this.perfil.forma.push([0.0, 0.0, this.profundidad/2]);
		this.perfil.forma.push([this.radio, 0.0, this.profundidad/2]);
    this.perfil.forma.push([this.radio, 0.0, -this.profundidad/2]);
	}

	this.create = function(radio, profundidad, color){
    this.radio = radio;
    this.profundidad = profundidad;
		this.crear_perfil();
		this.superficie.create([0,0,1], this.perfil.forma, Math.PI*2, 40.0, color);

		this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);
	}

	this.draw = function(mvMatrix_scene){
		var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

		var mvMatrix_rueda = mat4.create();
		mat4.identity(mvMatrix_rueda);
		mat4.multiply(mvMatrix_rueda, this.traslacion, this.rotacion);
    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_rueda);
		gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);

		this.superficie.draw();
	}

	this.translate = function(v){
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.rotate = function(grados, eje){
		this.superficie.rotate(grados, eje);
	}

	this.setupWebGLBuffers = function(){
		this.superficie.setupWebGLBuffers();
	}
}
