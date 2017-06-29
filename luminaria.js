function Luminaria(){
	this.radio = null;
	this.poste = new supBarrido();
  	this.foco = new Cuadrado();
	this.perfil = {
		forma:null,
		normal:null,
		normales:[]
	}
	this.rotacion = null;
	this.traslacion = null;
	this.escalado = null;
	this.mat_ubicacion = null;

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
		this.radio = radio;
	    var puntos_forma = devolver_puntos_circulo(radio, 30, this.perfil);
	    var camino = this.camino(alto, largo);
		var color = [1,0.843,0];
	    // this.poste.create(camino, 40, puntos_forma[0], puntos_forma[1], color);
	    this.poste.create(camino, 40, this.perfil, color);
			// this.perfil.forma = puntos_forma[0];

	  //   this.poste.create(camino, 40, puntos_forma[0], puntos_forma[1], color);

	    this.foco.create(_z, _y, _x, color); //8,3,6

	    var ubic_foco = camino.puntosDeControl[camino.puntosDeControl.length-1];
	    // this.ubic_foco = ubic_foco;
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
		this.poste.setupWebGLBuffers();
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

		//Para determinar ubicacion del foco
		mat4.multiply(this.modelMatrix, this.modelMatrix, mvMatrix_luminaria);
		mat4.multiply(this.modelMatrix, this.modelMatrix, this.escalado);

		this.poste.draw(mvMatrix_total);
		this.foco.determinar_pos(mvMatrix_total);
		this.foco.draw(mvMatrix_total);
	}

	this.initTexture = function(texture){
		var texture_buffer_poste = this.create_text_buffer_poste();
		var texture_buffer_foco = this.create_text_buffer_foco();

		this.poste.asign_text_buffer(texture_buffer_poste);
		this.foco.asign_text_buffer(texture_buffer_foco);

		this.poste.initTexture(texture);
		this.foco.addTexture(texture);
	}

	this.create_text_buffer_foco = function(){
		var texture_buffer = [
          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1,
          0.0, 1,

          // Back face
          1.0, 0.0,
          1.0, 1,
          0.0, 1,
          0.0, 0.0,

          // Top face
          0.0, 1,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1,

          // Bottom face
          1.0, 1,
          0.0, 1,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1,
          0.0, 1,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1,
          0.0, 1,
        ];

		return texture_buffer;
	}

	this.create_text_buffer_poste = function(){
		var texture_buffer = []

		for (var i = 0; i < 40; i++){
			for (var j = 0; j < this.perfil.forma.length; j++){
				var punto = this.perfil.forma[j];
				var u = (punto[1]+punto[2])/this.radio;
				var v = i*0.5;

				texture_buffer.push(u);
				texture_buffer.push(v);
			}
		}

		return texture_buffer;
	}

	this.obtener_matriz_foco = function(){
		/*var mvMatrix_luminaria = mat4.create();
	    mat4.identity(mvMatrix_luminaria);
	    mat4.multiply(mvMatrix_luminaria, this.traslacion, this.rotacion);
		mat4.rotate(mvMatrix_luminaria, mvMatrix_luminaria, Math.PI/2, vec3.fromValues(0, 1, 0));

		var mvMatrix_foco = mat4.create();
		mat4.identity(mvMatrix_foco);
		mat4.multiply(mvMatrix_foco, this.traslacion, this.rotacion);

		var mvMatrix_total = mat4.create();
		mat4.identity(mvMatrix_total);
		// mat4.multiply(mvMatrix_total, mvMatrix_luminaria, mvMatrix_cuadrado);
		mat4.multiply(mvMatrix_total, mvMatrix_luminaria, mvMatrix_foco);
		mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);*/

		// return mvMatrix_total;
		return this.foco.mat_ubicacion;
	}

	this.determinar_pos_final_foco = function(mvFinal){
		this.foco.determinar_pos(mvFinal);
	}
}


function devolver_puntos_circulo(radio, step, perfil){
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

		var aux = vec3.create();
		// vec3.negate(aux, punto);
		vec3.normalize(aux, punto);
		perfil.normales.push(aux);
	};
	valores.push(puntos);
	valores.push(normales);
	perfil.forma = puntos;
	perfil.normal = normales;
	return valores;
}
