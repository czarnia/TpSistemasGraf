function Calle(){
	this.superficie = new supBarrido();
	this.path = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}
	this.final_curva = null;

	this.rotacion = null;
	this.traslacion = null;

	//Hardcodeo todo para probar despues vamos a valores reales
	this.create_perfil = function(ancho, alto){
		this.perfil.forma = [];
		this.perfil.normal = [];

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

	this.create = function(curva_camino){
		this.rotacion = mat4.create();
		mat4.identity(this.rotacion);

		this.traslacion = mat4.create();
		mat4.identity(this.traslacion);

		this.escalado = mat4.create();
		mat4.identity(this.escalado);

		this.path = curva_camino;

		this.superficie.create(this.path, 100.0, this.perfil.forma, this.perfil.normal,
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

		this.path.create(puntos);
		this.path.setupWebGLBuffers();
		this.create(this.path);
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
}
