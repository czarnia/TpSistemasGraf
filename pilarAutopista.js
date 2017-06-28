function PilarAutopista(){
	this.superficie = new supRevolucion();
	this.perfil = [];
	this.perfil_normales = [];

	this.traslacion = null;
	this.rotacion = null;

	this.escalado = null;

	this.create = function(){
		this.crear_perfil();
		var puntos_perfil = [];
		var normales_perfil = [];
		puntos_perfil.push([-20,83,0]);
		normales_perfil.push([-1.0, 0.0, 0.0]);
		for (var j = 0; j < this.perfil.length; j++){
			for (var i = 0; i < 40; i++){
				var u = (this.perfil[j].valores_u/40)*i;
				var punto = this.perfil[j].get_punto(u);
				puntos_perfil.push(punto);
				normales_perfil.push([-1.0, 0.0, 0.0]);
			}
		}

		this.superficie.create([0,1,0], puntos_perfil, normales_perfil, Math.PI*2, 60.0, [0.66, 0.66, 0.66]);

		this.rotacion = mat4.create();
	    mat4.identity(this.rotacion);

	    this.traslacion = mat4.create();
	    mat4.identity(this.traslacion);

		this.escalado = mat4.create();
	    mat4.identity(this.escalado);
	}

	this.crear_perfil = function(){
		var copa = new curvaBesier();
		var pilar = new curvaBesier();
		var base = new curvaBesier();

		var p_copa = [];
		var p_pilar = [];
		var p_base = [];

		var n_copa = [];
		var n_pilar = [];
		var n_base = [];

		p_copa.push([-20,80,0]);
		p_copa.push([-20,80,0]);
		p_copa.push([-7,70,0]);
		p_copa.push([-7,70,0]);

		p_pilar.push([-7,70,0]);
		p_pilar.push([-7,70,0]);
		p_pilar.push([-7,20,0]);
		p_pilar.push([-7,20,0]);		

		p_base.push([-7,20,0]);
		p_base.push([-15,15,0]);
		p_base.push([-15,10,0]);
		p_base.push([-20,0,0]);	

		copa.create(p_copa);
		pilar.create(p_pilar);
		base.create(p_base);

		this.perfil.push(copa);
		this.perfil.push(pilar);
		this.perfil.push(base);
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

    var mvMatrix_pilar = mat4.create();
    mat4.identity(mvMatrix_pilar);
    mat4.multiply(mvMatrix_pilar, this.traslacion, this.rotacion);

    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_pilar);
		mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

		this.superficie.draw(mvMatrix_total);
	}

	this.scale = function(_x, _y, _z){
		mat4.scale(this.escalado, this.escalado, vec3.fromValues(_x,_y,_z));
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

		for (var i = 0; i < this.perfil.length; i++){
			this.perfil[i].discretizar_step(40);
		}

		var repeticion = 500;
		var long_curva = 0;

		for (var j = 0; j < this.perfil.length; j++){
			long_curva += this.perfil[j].distancias_discret[this.perfil[j].distancias_discret.length-1];
		}

		var distancias_discret_tramos = [];
		var dist_tramo = 0;
		distancias_discret_tramos.push(dist_tramo);

		for (var j = 1; j < this.perfil.length; j++){
			dist_tramo += this.perfil[j-1].distancias_discret[this.perfil[j-1].distancias_discret.length-1];
			distancias_discret_tramos.push(dist_tramo);
		}

		var p2 = this.perfil[0].get_punto(0);
		var v1 = vec3.fromValues(-20,83,0.0);
		var v2 = vec3.fromValues(p2[0], p2[1], p2[2]);
		var dist_ini = vec3.distance(v1, v2);

		long_curva += dist_ini;

		for (var i = 0; i < 60; i++){
			for (var j = 0; j < this.perfil.length+1; j++){
				if (j == 0){
					var v = 2*dist_ini/long_curva;
					var u = i/60;
					texture_buffer.push(u);
					texture_buffer.push(v);
				}else{
					for (var k = 0; k < 40; k++){
						var v = 2*(this.perfil[j-1].distancias_discret[k]+dist_ini+distancias_discret_tramos[j-1])/long_curva;
						var u = i/60;

						texture_buffer.push(u);
						texture_buffer.push(v);
					}
				}
			}
		}
		return texture_buffer;
	}
}
