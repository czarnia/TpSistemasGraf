function Autopista(){
	this.calle_ida = new Calle();
	this.borde_ida = new Borde();
	this.calle_vuelta = new Calle();
	this.borde_vuelta = new Borde();
	this.pilares = [];
	this.faroles = [];

	this.create = function(curva_camino, dist_pilares, dist_faroles){
		var aux = vec3.create();
		var sube = -9.75;

		this.calle_ida.create_perfil(6, 0.5);
		this.calle_ida.mover_perfil([-6, 0.75, 0]);
		this.calle_ida.create(curva_camino);
		this.calle_ida.translate([0.0, 0.0, sube + -0.5]);

		this.borde_ida.create_perfil();
		this.borde_ida.mover_perfil(-6);
		this.borde_ida.create(curva_camino);
		this.borde_ida.translate([0.0, 0.0, sube]);

		this.calle_vuelta.create_perfil(6, 0.5);
		this.calle_vuelta.mover_perfil([6, 0.75, 0]);
		this.calle_vuelta.create(curva_camino);
		this.calle_vuelta.translate([0.0, 0.0, sube + -0.5]);

		this.borde_vuelta.create_perfil();
		this.borde_vuelta.mover_perfil(6);
		this.borde_vuelta.create(curva_camino);
		this.borde_vuelta.translate([0.0, 0.0, sube]);

		curva_camino.discretizar();

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
				pilar.rotate(-Math.PI/2, [1.0, 0.0, 0.0]);
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
				farol.create(1.0, 20.0, 10.0, 5.0, 4.0, 3.0);
				farol.setupWebGLBuffers();
				farol.scale(0.5, 0.5, 0.5);
				farol.rotate(-Math.PI/2, [1.0, 0.0, 0.0]);
				farol.rotate(-Math.PI/2, [0.0, 0.0, signo * 1.0]);

				vec3.normalize(tan, tan);
				vec3.normalize(tan_l, tan_l);
				var angulo = Math.acos(vec3.dot(tan, tan_l));

				var eje = vec3.create();
				vec3.cross(eje, tan, tan_l);
				farol.rotate(-angulo, eje);

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

	this.coincide = function(xcomienzo, ancho, zcomienzo, largo){
		for (var i = 0; i < this.borde_ida.superficie.grilla.position_buffer.length; i += 3) {
			var coincide = true;
			//Una de las rutas
			// if (this.borde_ida.superficie.grilla.position_buffer[i] < xcomienzo)
				// coincide = false;
			if (this.borde_ida.superficie.grilla.position_buffer[i] > (xcomienzo + ancho))
				coincide = false;
			if (this.borde_ida.superficie.grilla.position_buffer[i + 2] < zcomienzo)
				coincide = false;
			// if (this.borde_ida.superficie.grilla.position_buffer[i + 2] > (zcomienzo + largo))
				// coincide = false;

			if (coincide == true){
				console.log("Estoy en x: ", xcomienzo, " z: ", zcomienzo);
				console.log("Coincide en ", this.borde_ida.superficie.grilla.position_buffer[i],
				 " z: ", this.borde_ida.superficie.grilla.position_buffer[i + 2]);
				return coincide;
			}

			coincide = true;
			//La otra ruta
			// if (this.borde_vuelta.superficie.grilla.position_buffer[i] < xcomienzo)
				// coincide = false;
			if (this.borde_vuelta.superficie.grilla.position_buffer[i] > (xcomienzo + ancho))
				coincide = false;
			if (this.borde_vuelta.superficie.grilla.position_buffer[i + 2] < zcomienzo)
				coincide = false;
			// if (this.borde_vuelta.superficie.grilla.position_buffer[i + 2] > (zcomienzo + largo))
				// coincide = false;

			if (coincide == true){
				console.log("Estoy en x: ", xcomienzo, " z: ", zcomienzo);
				console.log("Coincide en ", this.borde_ida.superficie.grilla.position_buffer[i],
				 " z: ", this.borde_ida.superficie.grilla.position_buffer[i + 2]);
				return coincide;
			}

/*			console.log("Estoy en x: ", xcomienzo, " z: ", zcomienzo);
			console.log("NO Coincide en ", this.borde_ida.superficie.grilla.position_buffer[i],
			 " z: ", this.borde_ida.superficie.grilla.position_buffer[i + 2]);		*/
		}
	}

	this.rotate = function(p, plano){
		this.calle_ida.rotate(p, plano);
		this.borde_ida.rotate(p, plano);
		this.calle_vuelta.rotate(p, plano);
		this.borde_vuelta.rotate(p, plano);
		for (var i = 0; i < this.pilares.length; i++) {
			this.pilares[i].rotate(p, plano);
		}
		for (var i = 0; i < this.faroles.length; i++) {
			this.faroles[i].rotate(p, plano);
		}
	}

	this.scale = function(_x, _y, _z){
		this.calle_ida.scale(_x, _y, _z);
		this.borde_ida.scale(_x, _y, _z);
		this.calle_vuelta.scale(_x, _y, _z);
		this.borde_vuelta.scale(_x, _y, _z);
		for (var i = 0; i < this.pilares.length; i++) {
			this.pilares[i].scale(_x, _y, _z);
		}
		for (var i = 0; i < this.faroles.length; i++) {
			this.faroles[i].scale(_x, _y, _z);
		}
	}

	this.draw = function(){
		this.calle_ida.draw();
		this.borde_ida.draw();
		this.calle_vuelta.draw();
		this.borde_vuelta.draw();
		for (var i = 0; i < this.pilares.length; i++) {
			this.pilares[i].draw();
		}
		for (var i = 0; i < this.faroles.length; i++) {
			this.faroles[i].draw();
		}
	}
}
