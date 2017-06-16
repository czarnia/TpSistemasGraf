function Escena(){
	this.lado = null;
	this.cant_manzanas = null;
	this.ancho_calle = null;
	this.lado_manzana = null;
	this.calles = null;
	// this.plano = new Plano();
	this.plazas = null;
	this.manzanas = null;
	this.autopista = null;

	this.esc_autopista = null;

	this.autos = null;

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
			this.calles.push(calle);
		}
	}

	this.create_autos = function(){
		this.autos = [];

		var auto1 = new Auto();
		auto1.create([0.6,0,0.4], [0.6,0.6,0.7], 0.9, 1, 1.5, 0.1, 0.07);
		auto1.translate([0,5.5,3]);

		var curva_auto1 = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
		auto1.agregar_movimiento(curva_auto1, 40);
		auto1.setupWebGLBuffers();


		var auto2 = new Auto();
		auto2.create([0,0.5,0.4], [0.6,0.6,0.7], 0.9, 1, 1.5, 0.1, 0.07);
		auto2.translate([0,5.5,4]);

		var curva_auto2 = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
		curva_auto2.dar_vuelta_curva();
		auto2.agregar_movimiento(curva_auto2, 60);
		auto2.setupWebGLBuffers();

		this.autos.push(auto1);
		this.autos.push(auto2);
	}

	this.create_mapa = function(){
/*		this.plano.create(this.lado, this.lado, [0.5, 0.0, 0.0]);
		this.plano.createIndexBuffer();
		this.plano.rotate(Math.PI/2, [1.0, 0.0, 0.0]);
		this.plano.translate([this.lado/2, 0.0, this.lado/2]);
		this.plano.setupWebGLBuffers();*/

		this.plazas = [];
		this.manzanas = [];

		for (var i = 0; i < this.cant_manzanas; i++) {
			for (var j = 0; j < this.cant_manzanas; j++) {
				if(this.autopista.coincide(j*(this.lado_manzana + this.ancho_calle), this.lado_manzana,
					 i * (this.lado_manzana + this.ancho_calle), this.lado_manzana) == true){
					//Crear plaza
					var plaza = new Plaza();
					plaza.create(this.lado_manzana, 0.5);
					//PREGUNTAR ANA CUANTO TRASLADAR
					plaza.translate([this.lado_manzana/2 - (this.lado_manzana/10) + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 - (this.lado_manzana/10) + i * (this.lado_manzana + this.ancho_calle)]);

					plaza.setupWebGLBuffers();
					this.plazas.push(plaza);
				}else{
					var manzana = new Manzana();
					manzana.create(this.lado_manzana, 0.5, 200.0, j * 100);
					manzana.translate([this.lado_manzana/2 - (this.lado_manzana/10) + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 - (this.lado_manzana/10) + i * (this.lado_manzana + this.ancho_calle)]);
					manzana.setupWebGLBuffers();
					this.manzanas.push(manzana);
					//Crear manzana
				}
				if(i == 0 && (j < this.cant_manzanas - 1)){
					this.calles[j].superficie.grilla.rotate(Math.PI/2, [0.0, 1.0, 0.0]);
					this.calles[j].superficie.grilla.translate([0.0, 0.0, (j + 1) * this.lado_manzana + j * this.ancho_calle]);
					this.calles[j].superficie.grilla.setupWebGLBuffers();
				}
			}
			if(i < this.cant_manzanas - 1){
				this.calles[(this.cant_manzanas-1) + i].superficie.grilla.translate([(i + 1) * this.lado_manzana + i * this.ancho_calle, 0.0, 0.0]);
				this.calles[(this.cant_manzanas-1) + i].superficie.grilla.setupWebGLBuffers();
			}
		}


	}

	this.ubicar_autopista = function(puntos, dist_pilares, dist_pilares){
		var final = puntos[puntos.length - 1][0];

		camino = new curvaBspline3();
		camino.create(puntos);
		camino.setupWebGLBuffers();

		this.autopista = new Autopista();
		this.autopista.create(camino, dist_pilares, dist_pilares);
		this.autopista.scale(this.lado/final, this.lado/final, this.lado/final);
		this.autopista.rotate(Math.PI / 2, [1.0, 0.0, 0.0]);

		this.esc_autopista = [this.lado/final, this.lado/final, this.lado/final];
	}

	this.draw = function(mvScene){
		// this.plano.draw();

		for (var i = 0; i < this.calles.length; i++) {
			this.calles[i].draw();
		}

		for (var i = 0; i < this.plazas.length; i++) {
			this.plazas[i].draw();
		}

		for (var i = 0; i < this.manzanas.length; i++) {
			this.manzanas[i].draw();
		}

		for (var i = 0; i < this.autos.length; i++) {
			this.autos[i].draw(mvScene);
		}

		this.autopista.draw();

	}

	this.tick = function(t){
		for (var i = 0; i < this.autos.length; i++) {
			this.autos[i].tick(t);
			this.autos[i].setupWebGLBuffers();
		}
	}
}
