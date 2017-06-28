function Rueda(){
	this.superficie = new supRevolucion();
	this.perfil = {
		forma:null,
		normal:null,
		normales:null
	}
  this.radio = null;
  this.profundidad = null;

	this.rotacion = null;
	this.traslacion = null;

	this.crear_perfil = function(){
		this.perfil.forma = [];
		this.perfil.normal = [];
		this.perfil.normales = [];

		this.perfil.forma.push([this.radio, 0.0, -this.profundidad/2]);
		this.perfil.forma.push([0.0, 0.0, -this.profundidad/2]);
		this.perfil.forma.push([0.0, 0.0, this.profundidad/2]);
		this.perfil.forma.push([this.radio, 0.0, this.profundidad/2]);
		this.perfil.forma.push([this.radio, 0.0, -this.profundidad/2]);

		//Chequear si bien
		this.perfil.normales.push([0.0, 0.0, 1.0]);
		this.perfil.normales.push([0.0, 0.0, 1.0]);
		this.perfil.normales.push([0.0, 0.0, 1.0]);
		this.perfil.normales.push([0.0, 0.0, 1.0]);
		this.perfil.normales.push([0.0, 0.0, 1.0]);
	}

	this.create = function(radio, profundidad, color){
		this.radio = radio;
		this.profundidad = profundidad;
		this.crear_perfil();
		this.superficie.create([0,0,1], this.perfil.forma, this.perfil.normales, Math.PI*2, 40.0, color);

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

		this.superficie.draw(mvMatrix_total);
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

	this.setupWebGLBuffers = function(){
		this.superficie.setupWebGLBuffers();
	}

	this.initTexture = function(texture_file){
		var texture_buffer = this.create_text_buffer();
		this.superficie.initTexture(texture_file);
		this.superficie.asign_text_buffer(texture_buffer);
	}

	this.create_text_buffer = function(){
		var texture_buffer = [];

		for (var i = 0; i < 40; i++){
			var punto = [0,0.45,0];
			var angulo_nivel = i * Math.PI*2 / (40-1);
			var mat_rotacion = mat4.create();
			mat4.identity(mat_rotacion);
			mat4.rotate(mat_rotacion, mat_rotacion, angulo_nivel, [0,0,1]);

			vec3.transformMat4(punto, punto, mat_rotacion);

			var u_borde = punto[0];
			var v_borde = punto[1];

			texture_buffer.push(u_borde+0.5);
			texture_buffer.push(v_borde+0.5);

			texture_buffer.push(0.5);
			texture_buffer.push(0.5);

			texture_buffer.push(0.5);
			texture_buffer.push(0.5);

			texture_buffer.push(u_borde+0.5);
			texture_buffer.push(v_borde+0.5);

			texture_buffer.push(u_borde+0.5);
			texture_buffer.push(v_borde+0.5);
		}

		return texture_buffer;
	}
}
