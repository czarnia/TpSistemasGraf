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

		this.perfil.forma.push([0.0, 0.0, this.radio]);
    this.perfil.forma.push([0.0, 0.0, 0.0]);
    this.perfil.forma.push([0.0, this.profundidad, 0.0]);
		this.perfil.forma.push([0.0, this.profundidad, this.radio]);
    this.perfil.forma.push([0.0, 0.0, this.radio]);
	}

	this.create = function(radio, profundidad){
    this.radio = radio;
    this.profundidad = profundidad;
		this.crear_perfil();
		this.superficie.create([0,1,0], this.perfil, Math.PI*2, 40.0);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}
