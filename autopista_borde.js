function Borde(){
	this.superficie = new supBarrido();
	this.camino = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}

	//Hardcodeo todo para probar despues vamos a valores reales
	this.create_perfil = function(){
		this.perfil.forma = [];
		this.perfil.normal = [];

		//COMIENZA CONCRETO
		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		this.perfil.forma.push([-4.0, 1.5, 0.0]);
		this.perfil.forma.push([-5.0, 1.5, 0.0]);
		this.perfil.forma.push([-5.0, -1.5, 0.0]);
		this.perfil.forma.push([5.0, -1.5, 0.0]);
		this.perfil.forma.push([5.0, 1.5, 0.0]);
		this.perfil.forma.push([4.0, 1.5, 0.0]);
		this.perfil.forma.push([3.0, 0.5, 0.0]);

		this.perfil.forma.push([-3.0, 0.5, 0.0]);

		//Segunda autopista
/*		this.perfil.forma.push([9.0, 0.5, 0.0]);
		this.perfil.forma.push([8.0, 1.5, 0.0]);
		this.perfil.forma.push([7.0, 1.5, 0.0]);
		this.perfil.forma.push([7.0, -1.5, 0.0]);
		this.perfil.forma.push([17.0, -1.5, 0.0]);
		this.perfil.forma.push([17.0, 1.5, 0.0]);
		this.perfil.forma.push([16.0, 1.5, 0.0]);
		this.perfil.forma.push([15.0, 0.5, 0.0]);

		this.perfil.forma.push([9.0, 0.5, 0.0]);*/

		//Para que matchee con la tangente de la curva
		this.perfil.normal.push([0.0, 0.0, 1.0]);
		//Para que matchee con la normal de la curva
		this.perfil.normal.push([1.0, 0.0, 0.0]);
	}

	this.mover_perfil = function(mov){
		var v_mov = vec3.fromValues(mov, 0, 0);
		for (var i = 0; i < this.perfil.forma.length; i++) {        
	        vec3.add(this.perfil.forma[i], v_mov, this.perfil.forma[i]);	        
		}
	}

	this.create = function(curva_camino){
		this.camino = curva_camino;

		this.superficie.create(this.camino, 100.0, this.perfil.forma, this.perfil.normal, 0.66);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}
