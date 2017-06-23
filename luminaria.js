function Luminaria(){
	this.poste = new supBarrido();
  this.foco = new Cuadrado();
	this.perfil = {
		forma:null,
		normal:null
	}
	this.rotacion = null;
	this.traslacion = null;
	this.escalado = null;

	this.traslacion_foco = null;

  this.camino = function(alto, largo){
		var camino = new curvaBspline3();
		var puntos_control = [];
		//Quiero que interpole el punto inicial
		puntos_control.push([0,0,0]);
		puntos_control.push([0,0,0]);
		puntos_control.push([0,0,0]);
		puntos_control.push([0,0,0]);

		puntos_control.push([0,alto/4,0]);
		puntos_control.push([0,(alto/4)*2,0]);
		puntos_control.push([0,(alto/4)*3,0]);
		puntos_control.push([0,alto,0]);

		//Quiero que interpole el punto final
		puntos_control.push([0,alto,-largo]);
		puntos_control.push([0,alto,-largo]);
		puntos_control.push([0,alto,-largo]);
		puntos_control.push([0,alto,-largo]);

		camino.create(puntos_control);
		return camino;
  }

	this.create = function(radio, alto, largo, _x, _y, _z){
	    var puntos_forma = devolver_puntos_circulo(radio, 30);
	    var camino = this.camino(alto, largo);
			var color = [1,0.843,0];
	    this.poste.create(camino, 40, puntos_forma[0], puntos_forma[1], color);
	    this.foco.create(_z, _y, _x, color); //8,3,6

	    var ubic_foco = camino.puntosDeControl[camino.puntosDeControl.length-1];
	    this.foco.translate(ubic_foco);

			this.rotacion = mat4.create();
	    mat4.identity(this.rotacion);

	    this.traslacion = mat4.create();
	    mat4.identity(this.traslacion);

			this.escalado = mat4.create();
	    mat4.identity(this.escalado);
	}

	this.setupWebGLBuffers = function(){
		this.foco.setupWebGLBuffers();
	}

	this.scale = function(_x, _y, _z){
		mat4.scale(this.escalado, this.escalado, vec3.fromValues(_x,_y,_z));
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

	this.draw = function(mvMatrix_scene){
		var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    var mvMatrix_luminaria = mat4.create();
    mat4.identity(mvMatrix_luminaria);
    mat4.multiply(mvMatrix_luminaria, this.traslacion, this.rotacion);

		mat4.rotate(mvMatrix_luminaria, mvMatrix_luminaria, Math.PI/2, vec3.fromValues(0, 1, 0));

    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_luminaria);
		mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

		this.poste.draw(mvMatrix_total);
		this.foco.draw(mvMatrix_total);
	}
}


function devolver_puntos_circulo(radio, step){
	var normales = [];
	var puntos = [];

	var valores = [];

	normales.push([1,0,0]); //normal al plano dónde está la figura
	normales.push([0,0,1]);

	for (var i = 0; i < step; i++){
		var angulo_nivel = i * Math.PI*2 / (step-1);
		var mat_rotacion = mat4.create();
		mat4.identity(mat_rotacion);
		mat4.rotate(mat_rotacion, mat_rotacion, angulo_nivel, [1,0,0]); //obtengo el círculo en zy
		var punto = vec3.fromValues(0,0,radio);

		vec3.transformMat4(punto, punto, mat_rotacion);
		puntos.push(punto);

	};
	valores.push(puntos);
	valores.push(normales);
	return valores;
}
