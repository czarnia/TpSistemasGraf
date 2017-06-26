function Borde(){
	this.superficie = new supBarrido();
	this.camino = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}

	this.traslacion = null;
	this.rotacion = null;

	//Hardcodeo todo para probar despues vamos a valores reales
	this.create_perfil = function(){
		this.perfil.forma = [];
		this.perfil.normal = [];

		//COMIENZA CONCRETO
		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		this.perfil.forma.push([-4.0, 1.5, 0.0]);
		this.perfil.forma.push([-5.0, 1.5, 0.0]);
		this.perfil.forma.push([-5.0, -1.5, 0.0]);
		this.perfil.forma.push([5.0, -1.5, 0.0]);
		this.perfil.forma.push([5.0, 1.5, 0.0]);
		this.perfil.forma.push([4.0, 1.5, 0.0]);
		this.perfil.forma.push([3.0, 0.5, 0.0]);

		this.perfil.forma.push([-3.0, 0.5, 0.0]);

		//Segunda autopista
/*		this.perfil.forma.push([9.0, 0.5, 0.0]);
		this.perfil.forma.push([8.0, 1.5, 0.0]);
		this.perfil.forma.push([7.0, 1.5, 0.0]);
		this.perfil.forma.push([7.0, -1.5, 0.0]);
		this.perfil.forma.push([17.0, -1.5, 0.0]);
		this.perfil.forma.push([17.0, 1.5, 0.0]);
		this.perfil.forma.push([16.0, 1.5, 0.0]);
		this.perfil.forma.push([15.0, 0.5, 0.0]);

		this.perfil.forma.push([9.0, 0.5, 0.0]);*/

		//Para que matchee con la tangente de la curva
		this.perfil.normal.push([0.0, 0.0, 1.0]);
		//Para que matchee con la normal de la curva
		this.perfil.normal.push([1.0, 0.0, 0.0]);
	}

	this.mover_perfil = function(mov){
		var v_mov = vec3.fromValues(mov, 0, 0);
		for (var i = 0; i < this.perfil.forma.length; i++) {
	        vec3.add(this.perfil.forma[i], v_mov, this.perfil.forma[i]);
		}
	}

	this.create = function(curva_camino){
		this.rotacion = mat4.create();
		mat4.identity(this.rotacion);

		this.traslacion = mat4.create();
		mat4.identity(this.traslacion);

		this.escalado = mat4.create();
		mat4.identity(this.escalado);

		this.camino = curva_camino;

		this.superficie.create(this.camino, 100.0, this.perfil.forma, this.perfil.normal, [0.66, 0.66, 0.66]);
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

	this.scale = function(_x, _y, _z){
		this.superficie.scale(_x, _y, _z);
	}

	this.draw = function(mvMatrix_scene){
		var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    var mvMatrix_calle = mat4.create();
    mat4.identity(mvMatrix_calle);
    mat4.multiply(mvMatrix_calle, this.traslacion, this.rotacion);

    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_calle);
		mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

		this.superficie.draw(mvMatrix_total);
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

		for (var i = 0; i < 100; i++){
			for (var j = 0; j < this.perfil.forma.length; j++){
				var punto = this.perfil.forma[j];
				texture_buffer.push(punto[0]+punto[1]+6.5);
				texture_buffer.push(i*0.3);
			}
		}
		return texture_buffer;
	}
}
