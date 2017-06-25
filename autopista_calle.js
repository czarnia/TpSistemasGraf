function Calle(){
	this.superficie = new supBarrido();
	this.path = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}
	this.final_curva = null;
	this.niveles = null;

	this.rotacion = null;
	this.traslacion = null;

	this.es_autopista = false;

	//Hardcodeo todo para probar despues vamos a valores reales
	this.create_perfil = function(ancho, alto){
		this.perfil.forma = [];
		this.perfil.normal = [];
		this.niveles = 100;

		this.perfil.forma.push([-ancho / 2, -alto / 2, 0.0]);
		this.perfil.forma.push([-(ancho / 2) + (ancho / 6), alto / 2, 0.0]);
		this.perfil.forma.push([(ancho / 2) - (ancho / 6), alto / 2, 0.0]);
		this.perfil.forma.push([ancho / 2, -alto / 2, 0.0]);
		this.perfil.forma.push([-ancho / 2, -alto / 2, 0.0]);

/*		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		this.perfil.forma.push([-2.5, 1.0, 0.0]);
		this.perfil.forma.push([2.5, 1.0, 0.0]);
		this.perfil.forma.push([3.0, 0.5, 0.0]);
		this.perfil.forma.push([-3.0, 0.5, 0.0]);*/

		//Para que matchee con la tangente de la curva
		this.perfil.normal.push([0.0, 0.0, 1.0]);
		//Para que matchee con la normal de la curva
		this.perfil.normal.push([1.0, 0.0, 0.0]);
	}

	this.mover_perfil = function(mov){
		//var v_mov = vec3.fromValues(mov, 0, 0);
		for (var i = 0; i < this.perfil.forma.length; i++) {
            vec3.add(this.perfil.forma[i], mov, this.perfil.forma[i]);
		}
	}

	this.create = function(curva_camino, es_autopista){
		this.rotacion = mat4.create();
		mat4.identity(this.rotacion);

		this.traslacion = mat4.create();
		mat4.identity(this.traslacion);

		this.escalado = mat4.create();
		mat4.identity(this.escalado);

		this.path = curva_camino;

		this.superficie.create(this.path, this.niveles, this.perfil.forma, this.perfil.normal,
				 [0.0, 0.0, 0.0]);

		this.final_curva = this.superficie.final;
	}

	this.create_calle_escena = function(dimension, final){
		var puntos = [];

		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);

		if(final[0] != 0)
			for (var i = 0.0; i < dimension; i += 1.0) {
				puntos.push([i, 0.0, 0.0]);
			}
		else
			for (var i = 0.0; i < dimension; i += 1.0) {
				puntos.push([0.0, 0.0, i]);
			}
		puntos.push(final);
		puntos.push(final);
		puntos.push(final);
		puntos.push(final);

		//MEJORAR, TRATAR DE NO CREAR CURVA CADA VEZ O NO DISCRETIZAR CADA VEZ
		this.path.create(puntos);
		this.path.setupWebGLBuffers();
		this.create(this.path, false);
	}

	this.initTexture = function(texture_file){
		var texture_buffer = this.create_text_buffer_au();
		this.superficie.initTexture(texture_file);
		this.superficie.asign_text_buffer(texture_buffer);
	}

	//Crea el texture buffer para la calle de la autopista
	this.create_text_buffer_au = function(){
		var texture_buffer = [];
		this.path.discretizar_step(this.niveles);

		var long_curva = this.path.distancias_discret[this.path.distancias_discret.length-1];

		var repeticion = 80;

		if (!this.es_autopista){
			repeticion += 70;
		}

		for(var i = 0; i < this.niveles; i++){
			for (var j = 0; j < this.perfil.forma.length; j++) {
				var v = repeticion*(this.path.distancias_discret[i]/long_curva);
				switch(j){
					case 0:
						var u = 0;
						break;
					case 1:
						var u = 0.125;
						break;
					case 2:
						var u = 0.125 * 7;
						break;
					case 3:
						var u = 0.125 * 8;
						break;
					case 4:
						var u = 0;
						break;
				}

				texture_buffer.push(u);
				texture_buffer.push(v);
			}
		}
		return texture_buffer;
	}

	//Crea el texture buffer para la calle entre los edificios
	this.create_text_buffer_st = function(){
		return this.create_text_buffer_au();
	}

	this.translate_acum = function(v){
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.translate = function(v){
		mat4.identity(this.traslacion);
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.get_comienzo = function(){
		return this.superficie.get_comienzo();
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
}
