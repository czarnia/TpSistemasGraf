function Autopista(){
	this.calle_ida = new Calle();
	this.borde_ida = new Borde();
	this.calle_vuelta = new Calle();
	this.borde_vuelta = new Borde();
	this.pilares = [];

	this.create = function(curva_camino, dist_pilares, cant_pilares){
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

		var dist = 0;
		var i = 0, j = 0;

		while((i < curva_camino.discretizaciones.length) && (j < cant_pilares)){
			if(curva_camino.distancias_discret[i] >= dist){	
				if(curva_camino.distancias_discret[i] > dist){
					var u = (curva_camino.discretizaciones[i - 1] + curva_camino.discretizaciones[i]) / 2;
					var punto = curva_camino.get_punto(u);
				}

				if(curva_camino.distancias_discret[i] == dist){
					var punto = curva_camino.get_punto(curva_camino.discretizaciones[i]);
				}

				var pilar = new PilarAutopista();
				pilar.create();
				pilar.scale(0.1, 0.1, 0.1);
				pilar.rotate(-Math.PI/2, [1.0, 0.0, 0.0]);
				pilar.translate(punto);
				this.pilares.push(pilar);
				j++;
				dist += dist_pilares;
			}
			i++;
		}

/*		var final_curva = this.calle_ida.final_curva;
		var dist = 1;



		for (var i = 0.0; i < (cant_pilares*dist_pilares); i += dist_pilares) {
			// var step = i * curva_camino.length() / (cant_pilares - 1);
			var pilar = new PilarAutopista();
			pilar.create();
			var punto = curva_camino.get_punto(i);
			pilar.scale(0.1, 0.1, 0.1);
			pilar.rotate(-Math.PI/2, [1.0, 0.0, 0.0]);
			pilar.translate(punto);
			// var tan = curva_camino.get_tan(i);
			//Hacer lo mismo q cuando hice sup de barrido
			//Rotar para que coincidan normales y tangentes
			//Ver si alcanza con implementar una fc de rotate
			//que use la de la grilla
			
			// pilar.rotate(,);
			this.pilares.push(pilar);
			// vec3.min(aux, final_curva, punto);
			// dist = vec3.squaredDistance(aux, final_curva);
		}*/

/*		var ant = vec3.fromValues(0.0, 0.0, 0.0);
		var dist = 0;
		var i = 0;
		var j = 0;

		while((i < cant_pilares) && (j < this.calle_ida.superficie.puntos_curva.length)){
			dist = vec3.distance(ant, this.calle_ida.superficie.puntos_curva[j]);
			dist = Math.floor(dist);
			if(dist == dist_pilares){
				var pilar = new PilarAutopista();
				pilar.create();
				pilar.scale(0.1, 0.1, 0.1);
				pilar.rotate(-Math.PI/2, [1.0, 0.0, 0.0]);
				pilar.translate(this.calle_ida.superficie.puntos_curva[j]);
				this.pilares.push(pilar);
				i++;
				ant = this.calle_ida.superficie.puntos_curva[j];
			}
			j++;
		}*/
	}

	this.coincide = function(xcomienzo, ancho, zcomienzo, largo){
		for (var i = 0; i < this.borde_ida.superficie.grilla.position_buffer.length; i += 3) {
			var coincide = true;
			//Una de las rutas
			if (this.borde_ida.superficie.grilla.position_buffer[i] < xcomienzo)
				coincide = false;
			if (this.borde_ida.superficie.grilla.position_buffer[i] > (xcomienzo + ancho))
				coincide = false;
			if (this.borde_ida.superficie.grilla.position_buffer[i + 2] < zcomienzo)
				coincide = false;
			if (this.borde_ida.superficie.grilla.position_buffer[i + 2] > (zcomienzo + largo))
				coincide = false;

			if (coincide == true){
				console.log("Estoy en x: ", xcomienzo, " z: ", zcomienzo);
				console.log("Coincide en ", this.borde_ida.superficie.grilla.position_buffer[i],
				 " z: ", this.borde_ida.superficie.grilla.position_buffer[i + 2]);
				return coincide;
			}

			//La otra ruta
			if (this.borde_vuelta.superficie.grilla.position_buffer[i] < xcomienzo)
				coincide = false;
			if (this.borde_vuelta.superficie.grilla.position_buffer[i] > (xcomienzo + ancho))
				coincide = false;
			if (this.borde_vuelta.superficie.grilla.position_buffer[i + 2] < zcomienzo)
				coincide = false;
			if (this.borde_vuelta.superficie.grilla.position_buffer[i + 2] > (zcomienzo + largo))
				coincide = false;

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

	this.draw = function(){
		this.calle_ida.draw();
		this.borde_ida.draw();
		this.calle_vuelta.draw();
		this.borde_vuelta.draw();
		for (var i = 0; i < this.pilares.length; i++) {
			this.pilares[i].draw();
		}
	}
}
