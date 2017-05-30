function PilarAutopista(){
	this.superficie = new supRevolucion();
	this.perfil = {
		forma:null,
		normal:null
	}

	//Hardcodeo todo para probar despues vamos a valores reales
	this.crear_perfil = function(){
		this.perfil.forma = [];
		this.perfil.normal = [];

		this.perfil.forma.push([3.0, 0.0, 0.0]);
		this.perfil.forma.push([5.0, 1.0, 0.0]);
		this.perfil.forma.push([5.0, 2.0, 0.0]);
		this.perfil.forma.push([3.0, 3.0, 0.0]);


		//De vuelta primer punto para cerrar
		this.perfil.forma.push([3.0, 0.0, 0.0]);
	}

	this.create = function(){
		this.crear_perfil();
		this.superficie.create([0,1,0], this.perfil, Math.PI*2, 10.0);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}
