function Autopista(){
	this.superficie = new supBarrido();
	this.camino = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}

	//Hardcodeo todo para probar despues vamos a valores reales
	this.crear_perfil = function(){
		this.perfil.forma = [];
		this.perfil.normal = [];

		this.perfil.forma.push([0.0, 0.0, 0.0]);
		this.perfil.forma.push([5.0, 0.0, 0.0]);
		this.perfil.forma.push([0.0, 3.0, 0.0]);
		this.perfil.forma.push([5.0, 3.0, 0.0]);

		//De vuelta primer punto para cerrar
		this.perfil.forma.push([0.0, 0.0, 0.0]);
	}

	this.create = function(curva_camino){
		this.crear_perfil();
		this.camino = camino;

		this.superficie.create(this.camino, 2.0, this.perfil.forma);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}