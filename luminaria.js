function Luminaria(){
	this.poste = new supBarrido();
  this.foco = new Cuadrado();
	this.perfil = {
		forma:null,
		normal:null
	}

  this.camino = function(){
		var camino = new curvaBspline3();
		var puntos_control = [];
		//Quiero que interpole el punto inicial
		puntos_control.push([0,0,0]);
		puntos_control.push([0,0,0]);
		puntos_control.push([0,0,0]);
		puntos_control.push([0,0,0]);

		puntos_control.push([0,25,0]);
		puntos_control.push([0,50,0]);
		puntos_control.push([0,75,0]);
		puntos_control.push([0,100,0]);

		//Quiero que interpole el punto final
		puntos_control.push([-25,100,0]);
		puntos_control.push([-25,100,0]);
		puntos_control.push([-25,100,0]);
		puntos_control.push([-25,100,0]);

		camino.create(puntos_control);
		return camino;
  }

	this.create = function(){
    var puntos_forma = devolver_puntos_circulo(1, 30);
    var camino = this.camino();
    this.poste.create(camino, 40, puntos_forma[0], puntos_forma[1],1);
    this.foco.create(8,3,6);

    var ubic_foco = camino.puntosDeControl[camino.puntosDeControl.length-1];
    this.foco.translate(ubic_foco);
	}

	this.draw = function(){
		this.poste.draw();
		this.foco.draw();
	}

	this.setupWebGLBuffers = function(){
		this.foco.setupWebGLBuffers();
	}
}


function devolver_puntos_circulo(radio, step){
	var normales = [];
	var puntos = [];

	var valores = [];

	normales.push([0,1,0]); //normal al plano dónde está la figura
	normales.push([0,0,1]);

	for (var i = 0; i < step; i++){
		var angulo_nivel = i * Math.PI*2 / (step-1);
		var mat_rotacion = mat4.create();
		mat4.identity(mat_rotacion);
		mat4.rotate(mat_rotacion, mat_rotacion, angulo_nivel, [0,1,0]); //obtengo el círculo en xz
		var punto = vec3.fromValues(radio,0,0);

		vec3.transformMat4(punto, punto, mat_rotacion);
		puntos.push(punto);

		var normal = vec3.fromValues(punto[0],punto[1],punto[2]); //la circunferencia esta en el 0,0,0
		//normales.push(normal);
	};
	valores.push(puntos);
	valores.push(normales);
	return valores;
}
