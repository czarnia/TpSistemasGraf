function Autopista(){
	this.calle_ida = new Calle();
	this.borde_ida = new Borde();
	this.calle_vuelta = new Calle();
	this.borde_vuelta = new Borde();
	this.pilares = [];
	this.faroles = [];
	this.punto_medio = null;
	this.comienzo = null;
	this.curva_camino = null;

	this.traslacion = null;
	this.rotacion = null;

	this.escalado = null;

	this.initTexture = function(texture_file_calle, texture_file_estructura){
		this.calle_ida.initTexture(texture_file_calle);
		this.calle_vuelta.initTexture(texture_file_calle);

		for (var i = 0; i < this.pilares.length; i++){
			this.pilares[i].initTexture(texture_file_estructura);
		}

		this.borde_ida.initTexture(texture_file_estructura);
		this.borde_vuelta.initTexture(texture_file_estructura);
	}

	this.create = function(curva_camino, dist_pilares, dist_faroles){
		this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);

		this.escalado = mat4.create();
    mat4.identity(this.escalado);

		this.curva_camino = curva_camino;

		var aux = vec3.create();
		var sube = -9.75;

		curva_camino.discretizar();


		this.calle_ida.create_perfil(7, 0.5);
		this.calle_ida.mover_perfil([-6, 0.75, 0]);
		this.calle_ida.create(curva_camino, true);
		this.calle_ida.translate([0.0, 0.0, sube + -0.5]);

		this.borde_ida.create_perfil();
		this.borde_ida.mover_perfil(-6);
		this.borde_ida.create(curva_camino);
		this.borde_ida.translate([0.0, 0.0, sube]);

		this.calle_vuelta.create_perfil(7, 0.5);
		this.calle_vuelta.mover_perfil([6, 0.75, 0]);
		this.calle_vuelta.create(curva_camino, true);
		this.calle_vuelta.translate([0.0, 0.0, sube + -0.5]);


		this.borde_vuelta.create_perfil();
		this.borde_vuelta.mover_perfil(6);
		this.borde_vuelta.create(curva_camino);
		this.borde_vuelta.translate([0.0, 0.0, sube]);

		var medio = curva_camino.discretizaciones[curva_camino.discretizaciones.length / 2];
		this.punto_medio = curva_camino.get_punto(medio);
		this.comienzo = curva_camino.get_punto(curva_camino.discretizaciones[0]);

		var dist_p = 0, dist_f = 0;
		var i = 0, signo = 1;

		while((i < curva_camino.discretizaciones.length)){
			//AGREGO PILARES
			if(curva_camino.distancias_discret[i] >= dist_p){
				if(curva_camino.distancias_discret[i] > dist_p){
					var u = (curva_camino.discretizaciones[i - 1] + curva_camino.discretizaciones[i]) / 2;
					var punto = curva_camino.get_punto(u);
				}

				if(curva_camino.distancias_discret[i] == dist_p){
					var punto = curva_camino.get_punto(curva_camino.discretizaciones[i]);
				}

				var pilar = new PilarAutopista();
				pilar.create();
				pilar.scale(0.1, 0.1, 0.1);
				pilar.rotate([1.0, 0.0, 0.0], -Math.PI/2);
				pilar.translate(punto);
				this.pilares.push(pilar);
				dist_p += dist_pilares;
			}
			//AGREGO FAROLES
			if(curva_camino.distancias_discret[i] >= dist_f){
				if(curva_camino.distancias_discret[i] > dist_f){
					var u = (curva_camino.discretizaciones[i - 1] + curva_camino.discretizaciones[i]) / 2;
					var punto = curva_camino.get_punto(u);
					var tan = curva_camino.get_tan(u);
				}

				if(curva_camino.distancias_discret[i] == dist_f){
					var punto = curva_camino.get_punto(curva_camino.discretizaciones[i]);
					var tan = curva_camino.get_tan(curva_camino.discretizaciones[i]);
				}

				tan_l = [1.0, 0.0, 0.0];
				var farol = new Luminaria();
				farol.create(0.65, 20.0, 10.0, 5.0, 2.0, 1.5);
				farol.scale(0.5, 0.5, 0.5);

				vec3.normalize(tan, tan);
				vec3.normalize(tan_l, tan_l);
				var angulo = Math.acos(vec3.dot(tan, tan_l));

				var eje = vec3.create();
				vec3.cross(eje, tan, tan_l);
				farol.rotate(eje, -angulo);
				farol.rotate_acum([0.0, 0.0, signo * 1.0], -Math.PI/2);
				farol.rotate_acum([1.0, 0.0, 0.0], -Math.PI/2);

				// farol.translate([0.0, 0.0, sube + -1]);
				vec3.add(punto, punto, [0.0, 0.0, sube + -1]);
				farol.translate(punto);
				this.faroles.push(farol);
				dist_f += dist_faroles;
				signo *= (-1); //Una luminaria para cada lado
			}
			i++;
		}
	}

	this.get_comienzo = function(){
		var mvMatrix_autopista = mat4.create();
		mat4.identity(mvMatrix_autopista);
		mat4.multiply(mvMatrix_autopista, this.traslacion, this.rotacion);
		mat4.multiply(mvMatrix_autopista, mvMatrix_autopista, this.escalado);

		var comienzo_ida = this.calle_ida.get_comienzo();
		var comienzo_vuelta = this.calle_ida.get_comienzo();

		var vec_comienzo_ida = vec3.fromValues(comienzo_ida[0], comienzo_ida[1], comienzo_ida[2]);
		var vec_comienzo_vuelta = vec3.fromValues(comienzo_ida[0], comienzo_ida[1], comienzo_ida[2]);

		vec3.transformMat4(vec_comienzo_ida, vec_comienzo_ida, mvMatrix_autopista);
		vec3.transformMat4(vec_comienzo_vuelta, vec_comienzo_vuelta, mvMatrix_autopista);

		return [(vec_comienzo_ida[0]+vec_comienzo_vuelta[0])/2, (vec_comienzo_ida[1]+vec_comienzo_vuelta[1])/2, (vec_comienzo_ida[2]+vec_comienzo_vuelta[2])/2];
	}


	this.coincide = function(xcomienzo, ancho, zcomienzo, largo){
		var pos_buffer_ida = this.devolver_rotado_transladado_escalado(this.borde_ida.superficie.grilla.position_buffer);
		var pos_buffer_vuelta = this.devolver_rotado_transladado_escalado(this.borde_vuelta.superficie.grilla.position_buffer);
		for (var i = 0; i < pos_buffer_ida.length; i += 3) {
			var coincide = true;
			//Una de las rutas
			// if (this.borde_ida.superficie.grilla.position_buffer[i] < xcomienzo)
				// coincide = false;
			if ((pos_buffer_ida[i] >= (xcomienzo + ancho)) || (pos_buffer_ida[i] <= xcomienzo)){
				coincide = false;
			}
			if ((pos_buffer_ida[i + 2] >= (zcomienzo + largo)) || (pos_buffer_ida[i + 2] <= zcomienzo)){
				coincide = false;
			}
			// if (this.borde_ida.superficie.grilla.position_buffer[i + 2] > (zcomienzo + largo))
				// coincide = false;

			if (coincide == true){
				return coincide;
			}

			coincide = true;
			//La otra ruta
			// if (this.borde_vuelta.superficie.grilla.position_buffer[i] < xcomienzo)
				// coincide = false;
			if ((pos_buffer_vuelta[i] >= (xcomienzo + ancho)) || (pos_buffer_vuelta[i] <= xcomienzo)){
				coincide = false;
			}
			if ((pos_buffer_vuelta[i + 2] >= (zcomienzo + largo)) || (pos_buffer_vuelta[i + 2] <= zcomienzo)){
				coincide = false;
			}
			// if (this.borde_vuelta.superficie.grilla.position_buffer[i + 2] > (zcomienzo + largo))
				// coincide = false;

			if (coincide == true){
				return coincide;
			}
		}
	}

	this.devolver_rotado_transladado_escalado = function(pos_buffer){
		var mvMatrix_autopista = mat4.create();
		mat4.identity(mvMatrix_autopista);
		mat4.multiply(mvMatrix_autopista, this.traslacion, this.rotacion);
		mat4.multiply(mvMatrix_autopista, mvMatrix_autopista, this.escalado);

		var pos_buffer_real = [];
		var pos_aux = [];

		for (var i = 0; i < pos_buffer.length; i++){
			pos_aux[i%3] = pos_buffer[i];
			if ((i+1)%3 == 0){
				var vec_aux = vec3.fromValues(pos_aux[0], pos_aux[1], pos_aux[2]);
				vec3.transformMat4(vec_aux, vec_aux, mvMatrix_autopista);
				pos_buffer_real.push(vec_aux[0]);
				pos_buffer_real.push(vec_aux[1]);
				pos_buffer_real.push(vec_aux[2]);
			}
		}

		return pos_buffer_real;
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

	this.scale = function(_x, _y, _z){
		mat4.scale(this.escalado, this.escalado, vec3.fromValues(_x,_y,_z));
	}

	this.draw = function(mvMatrix_scene){
		var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

	    var mvMatrix_autopista = mat4.create();
	    mat4.identity(mvMatrix_autopista);
	    mat4.multiply(mvMatrix_autopista, this.traslacion, this.rotacion);

	    var mvMatrix_total = mat4.create();
	    mat4.identity(mvMatrix_total);
	    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_autopista);
		mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

		this.calle_ida.draw(mvMatrix_total);
		this.borde_ida.draw(mvMatrix_total);
		this.calle_vuelta.draw(mvMatrix_total);
		this.borde_vuelta.draw(mvMatrix_total);
		for (var i = 0; i < this.pilares.length; i++) {
			this.pilares[i].draw(mvMatrix_total);
		}
		for (var i = 0; i < this.faroles.length; i++) {
			this.faroles[i].draw(mvMatrix_total);
		}
	}

	this.setupWebGLBuffers = function(){
		for (var i = 0; i < this.pilares.length; i++) {
			this.pilares[i].setupWebGLBuffers();
		}
		for (var i = 0; i < this.faroles.length; i++) {
			this.faroles[i].setupWebGLBuffers();
		}
		this.calle_ida.setupWebGLBuffers();
		this.calle_vuelta.setupWebGLBuffers();
		this.borde_ida.setupWebGLBuffers();
		this.borde_vuelta.setupWebGLBuffers();
	}
}
