function Escena(){
	this.lado = [];
	this.cant_manzanas = [];
	this.ancho_calle = [];
	this.lado_manzana = [];
	this.calles = [];
	// this.plano = new Plano();
	this.plazas = [];
	this.manzanas = [];
	this.autopista = [];

	this.esc_autopista = [];

	this.autos = [];

	this.create_manzanas = function(cant_manzanas, lado_manzana,
							ancho_calle){
		this.lado = cant_manzanas * lado_manzana + ancho_calle * (cant_manzanas - 1);
		this.cant_manzanas = cant_manzanas;
		this.ancho_calle = ancho_calle;
		this.lado_manzana = lado_manzana;
	}

	this.create_calles = function(){
		this.calles = [];

		//Asumo valores enteros
		for (var i = 0; i < 2 * (this.lado - this.cant_manzanas * this.lado_manzana) / this.ancho_calle; i++) {
			var calle = new Calle();

			calle.create_perfil(this.ancho_calle, 0.5);
			calle.create_calle_escena(this.lado, [0.0, 0.0, this.lado]);
			calle.initTexture("Texturas/tramo-dobleamarilla.jpg");
			this.calles.push(calle);
		}
	}

	this.create_autos = function(){
		this.autos = [];

		var auto1 = new Auto();
		auto1.create([0.6,0,0.4], [0.6,0.6,0.7], 0.9, 0.8, 1.7, 0.1, 0.07);
		auto1.translate([0,5.5,3]);

		var curva_auto1 = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
		auto1.agregar_movimiento(curva_auto1, 200);


		var auto2 = new Auto();
		auto2.create([0,0.5,0.4], [0.6,0.6,0.7], 0.9, 1, 1.5, 0.1, 0.07);
		auto2.translate([0,5.5,2]);

		var curva_auto2 = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
		curva_auto2.dar_vuelta_curva();
		auto2.agregar_movimiento(curva_auto2, 150);

		this.autos.push(auto1);
		this.autos.push(auto2);
	}

	this.create_mapa = function(){
/*		this.plano.create(this.lado, this.lado, [0.5, 0.0, 0.0]);
		this.plano.createIndexBuffer();
		this.plano.rotate(Math.PI/2, [1.0, 0.0, 0.0]);
		this.plano.translate([this.lado/2, 0.0, this.lado/2]);*/

		this.plazas = [];
		this.manzanas = [];

		for (var i = 0; i < this.cant_manzanas; i++) {
			for (var j = 0; j < this.cant_manzanas; j++) {
				if(this.autopista.coincide(j*(this.lado_manzana + this.ancho_calle), this.lado_manzana,
					 i * (this.lado_manzana + this.ancho_calle), this.lado_manzana) == true){
					//Crear plaza
					var plaza = new Plaza();
					plaza.create(this.lado_manzana, 0.5);
					plaza.translate([this.lado_manzana/2 - (this.lado_manzana/10) + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 - (this.lado_manzana/10) + i * (this.lado_manzana + this.ancho_calle)]);
					plaza.initTexture("Texturas/plaza.jpg");
					this.plazas.push(plaza);
				}else{
					var manzana = new Manzana();
					manzana.create(this.lado_manzana, 0.5, 325.0, this.manzanas.length * 400);
					manzana.translate([this.lado_manzana/2 - (this.lado_manzana/10) + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 - (this.lado_manzana/10) + i * (this.lado_manzana + this.ancho_calle)]);

					this.manzanas.push(manzana);
					//Crear manzana
				}
				if(i == 0 && (j < this.cant_manzanas - 1)){
					this.calles[j].rotate([0.0, 1.0, 0.0], Math.PI/2);
					this.calles[j].translate([0.0, 0.0, (j + 1) * this.lado_manzana + j * this.ancho_calle]);
				}
			}
			if(i < this.cant_manzanas - 1){
				this.calles[(this.cant_manzanas-1) + i].translate([(i + 1) * this.lado_manzana + i * this.ancho_calle, 0.0, 0.0]);
			}
		}


	}

	this.ubicar_autopista = function(puntos, dist_pilares, dist_faroles){
		var final = puntos[puntos.length - 1][0];

		camino = new curvaBspline3();
		camino.create(puntos);
		camino.setupWebGLBuffers();

		this.autopista = new Autopista();
		this.autopista.create(camino, dist_pilares, dist_faroles);
		this.autopista.scale(this.lado/final, this.lado/final, this.lado/final);
		this.autopista.rotate([1.0, 0.0, 0.0], Math.PI / 2);
		this.autopista.initTexture("Texturas/autopista.jpg");

		this.esc_autopista = [this.lado/final, this.lado/final, this.lado/final];
	}

	this.draw = function(mvScene){
		// this.plano.draw();

		for (var i = 0; i < this.calles.length; i++) {
			this.calles[i].draw(mvScene);
		}

		for (var i = 0; i < this.plazas.length; i++) {
			this.plazas[i].draw(mvScene);
		}

		for (var i = 0; i < this.manzanas.length; i++) {
			this.manzanas[i].draw(mvScene);
		}

		for (var i = 0; i < this.autos.length; i++) {
			this.autos[i].draw(mvScene);
		}

		this.autopista.draw(mvScene);

	}

	this.tick = function(t){
		for (var i = 0; i < this.autos.length; i++) {
			this.autos[i].tick(t);
		}

    for (var i = 0; i < this.manzanas.length; i++) {
			//this.manzanas[i].tick(t);
		}
	}

	this.setupWebGLBuffers = function(){
		for (var i = 0; i < this.calles.length; i++) {
			this.calles[i].setupWebGLBuffers();
		}

		for (var i = 0; i < this.plazas.length; i++) {
			this.plazas[i].setupWebGLBuffers();
		}

		for (var i = 0; i < this.manzanas.length; i++) {
			this.manzanas[i].setupWebGLBuffers();
		}

		for (var i = 0; i < this.autos.length; i++) {
			this.autos[i].setupWebGLBuffers();
		}

		this.autopista.setupWebGLBuffers();
	}
}
