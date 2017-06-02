function Autopista(){
	this.calle_ida = new Calle();
	this.borde_ida = new Borde();
	this.calle_vuelta = new Calle();
	this.borde_vuelta = new Borde();

	this.create = function(curva_camino){
		this.calle_ida.create_perfil(6, 0.5);
		this.calle_ida.mover_perfil([-6, 0.75, 0]);
		this.calle_ida.create(curva_camino);

		this.borde_ida.create_perfil();
		this.borde_ida.mover_perfil(-6);
		this.borde_ida.create(curva_camino);

		this.calle_vuelta.create_perfil(6, 0.5);
		this.calle_vuelta.mover_perfil([6, 0.75, 0]);
		this.calle_vuelta.create(curva_camino);

		this.borde_vuelta.create_perfil();
		this.borde_vuelta.mover_perfil(6);
		this.borde_vuelta.create(curva_camino);
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
	}
}
