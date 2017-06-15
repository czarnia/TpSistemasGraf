function Rueda(){
	this.superficie = new supRevolucion();
	this.perfil = {
		forma:null,
		normal:null
	}
  this.radio = null;
  this.profundidad = null;

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
	}

	this.draw = function(){
		this.superficie.draw();
	}

	this.translate = function(v){
		this.superficie.translate(v);
	}

	this.rotate = function(grados, eje){
		this.superficie.rotate(grados, eje);
	}

	this.setupWebGLBuffers = function(){
		this.superficie.setupWebGLBuffers();
	}
}
