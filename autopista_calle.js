function Calle(){
	this.superficie = new supBarrido();
	this.path = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}

	//Hardcodeo todo para probar despues vamos a valores reales
	this.create_perfil = function(ancho, alto){
		this.perfil.forma = [];
		this.perfil.normal = [];

		this.perfil.forma.push([-ancho / 2, -alto / 2, 0.0]);
		this.perfil.forma.push([-(ancho / 2) - (ancho / 6), alto / 2, 0.0]);
		this.perfil.forma.push([(ancho / 2) - (ancho / 6), alto / 2, 0.0]);
		this.perfil.forma.push([ancho / 2, -alto / 2, 0.0]);
		this.perfil.forma.push([-ancho / 2, -alto / 2, 0.0]);

/*		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		this.perfil.forma.push([-2.5, 1.0, 0.0]);
		this.perfil.forma.push([2.5, 1.0, 0.0]);
		this.perfil.forma.push([3.0, 0.5, 0.0]);
		this.perfil.forma.push([-3.0, 0.5, 0.0]);*/

		//Para que matchee con la tangente de la curva
		this.perfil.normal.push([0.0, 0.0, 1.0]);
		//Para que matchee con la normal de la curva
		this.perfil.normal.push([1.0, 0.0, 0.0]);
	}

	this.mover_perfil = function(mov){
		//var v_mov = vec3.fromValues(mov, 0, 0);
		for (var i = 0; i < this.perfil.forma.length; i++) {        
            vec3.add(this.perfil.forma[i], mov, this.perfil.forma[i]);            
		}
	}

	this.create = function(curva_camino){
		this.path = curva_camino;

		this.superficie.create(this.path, 100.0, this.perfil.forma, this.perfil.normal, 0.0);
	}

	this.create_calle_escena = function(dimension, final){
		var puntos = [];

		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);

		if(final[0] != 0)
			for (var i = 0.0; i < dimension; i += 1.0) {
				puntos.push([i, 0.0, 0.0]);
			}
		else
			for (var i = 0.0; i < dimension; i += 1.0) {
				puntos.push([0.0, 0.0, i]);
			}
		puntos.push(final);
		puntos.push(final);
		puntos.push(final);
		puntos.push(final);

		this.path.create(puntos);
		this.path.setupWebGLBuffers();
		this.create(this.path);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}