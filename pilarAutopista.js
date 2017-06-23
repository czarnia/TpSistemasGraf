function PilarAutopista(){
	this.superficie = new supRevolucion();
	this.perfil = [];

	this.traslacion = null;
	this.rotacion = null;

	this.escalado = null;

	this.create = function(){
		this.crear_perfil();
		var puntos_perfil = [];
		puntos_perfil.push([-20,83,0]);
		for (var j = 0; j < this.perfil.length; j++){
			for (var i = 0; i < 40; i++){
				var u = (this.perfil[j].valores_u/40)*i;
				var punto = this.perfil[j].get_punto(u);
				puntos_perfil.push(punto);
			}
		}

		this.superficie.create([0,1,0], puntos_perfil, Math.PI*2, 60.0, [0.66, 0.66, 0.66]);

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
}
