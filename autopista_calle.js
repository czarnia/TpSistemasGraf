function Calle(){
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

		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		this.perfil.forma.push([-2.5, 1.0, 0.0]);
		this.perfil.forma.push([2.5, 1.0, 0.0]);
		this.perfil.forma.push([3.0, 0.5, 0.0]);
		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		//FIN PAVIMENTO

		//Para que matchee con la tangente de la curva
		this.perfil.normal.push([0.0, 0.0, 1.0]);
		//Para que matchee con la normal de la curva
		this.perfil.normal.push([0.0, 1.0, 0.0]);
	}

	this.create = function(curva_camino){
		this.crear_perfil();
		this.camino = camino;

		this.superficie.create(this.camino, 100.0, this.perfil.forma, this.perfil.normal, 0.0);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}