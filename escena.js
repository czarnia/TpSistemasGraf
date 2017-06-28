function Escena(){
	this.lado = [];
	this.cant_manzanas = [];
	this.ancho_calle = [];
	this.lado_manzana = [];
	this.calles = [];
	// this.plano = new Plano();

	this.cielo = new SkyBox();

	this.plazas = [];
	this.manzanas = [];
	this.autopista = [];

	this.esc_autopista = [];

	this.autos = [];

  //uv_grid2: 0, trama-doble: 1, cruce: 2, rueda: 3, plaza: 4, vereda: 5, autopista: 6, concreto: 7, cielo: 8, auto: 9, farol: 10.
	this.texturas_nombres = ["Texturas/uv_grid2.jpg", "Texturas/tramo-dobleamarilla.jpg", "Texturas/cruce.jpg", "Texturas/rueda.jpg", "Texturas/plaza.jpg", "Texturas/vereda.jpg", "Texturas/autopista.jpg", "Texturas/concreto.jpg", "Texturas/Day_Skybox.jpg", "Texturas/auto.jpg", "Texturas/farol3.jpg"];
	this.texturas = [];


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
			calle.create_calle_escena(this.lado, [0.0, 0.0, this.lado], this.lado_manzana);
			calle.initTexture(this.texturas[1]);
			calle.initTexture(this.texturas[0]);
			this.calles.push(calle);
		}
	}

	this.create_autos = function(){
		this.autos = [];
		this.posiciones_autos = [1.7, 2.7, 3.7, 1.7, 2.7, 3.7];
		this.velocidades_auto = [600, 450, 550, 600, 700, 400];

		for (var i = 0; i < 6; i++){
			var auto = new Auto();
			auto.create([0.6,0,0.4], [0.6,0.6,0.7], 0.5, 0.6, 1.3, 0.11, 0.07);
			auto.initTexture(this.texturas[9],this.texturas[3]);
			auto.translate([0,5.3,this.posiciones_autos[i]]);

			var curva_auto = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
			if (i > 2){
				curva_auto.dar_vuelta_curva();
			}

			auto.agregar_movimiento(curva_auto, this.velocidades_auto[i]);

			this.autos.push(auto);
		}

		/*var auto1 = new Auto();
		auto1.create([0.6,0,0.4], [0.6,0.6,0.7], 0.5, 0.6, 1.3, 0.11, 0.07);
		auto1.initTexture(this.texturas[9],this.texturas[3]);
		auto1.translate([0,5.3,3]);

		var curva_auto1 = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
		auto1.agregar_movimiento(curva_auto1, 250);



		var auto2 = new Auto();
		auto2.create([0,0.5,0.4], [0.6,0.6,0.7], 0.5, 0.6, 1.3, 0.11, 0.07);
		auto2.initTexture(this.texturas[9],this.texturas[3]);
		auto2.translate([0,5.3,2]);

		var curva_auto2 = this.autopista.curva_camino.devolver_rotada_transladada(Math.PI / 2, [1.0, 0.0, 0.0], this.esc_autopista);
		curva_auto2.dar_vuelta_curva();
		auto2.agregar_movimiento(curva_auto2, 400);

		this.autos.push(auto1);
		this.autos.push(auto2);*/
	}

	this.create_mapa = function(){
		this.cielo.create(this.lado*4, this.lado*4, this.lado*4, [this.lado/2, this.lado/2, 0], [0.3,0.6,1]);
		this.cielo.initTexture(this.texturas[8]);

		this.plazas = [];
		this.manzanas = [];

		for (var i = 0; i < this.cant_manzanas; i++) {
			for (var j = 0; j < this.cant_manzanas; j++) {
				if(this.autopista.coincide(j*(this.lado_manzana + this.ancho_calle), this.lado_manzana,
					 i * (this.lado_manzana + this.ancho_calle), this.lado_manzana) == true){
					//Crear plaza
					var plaza = new Plaza();
					plaza.create(this.lado_manzana, 0.5);
					plaza.translate_acum([this.lado_manzana/2 /*- (this.lado_manzana/10)*/ + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 /*- (this.lado_manzana/10)*/ + i * (this.lado_manzana + this.ancho_calle)]);
					plaza.initTexture(this.texturas[4]);
					this.plazas.push(plaza);
				}else{
					var manzana = new Manzana();
					manzana.create(this.lado_manzana, 0.5, 325.0, this.manzanas.length * 400);
					manzana.translate([this.lado_manzana/2 /*- (this.lado_manzana/10)*/ + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 /*- (this.lado_manzana/10)*/ + i * (this.lado_manzana + this.ancho_calle)]);
					manzana.initTexture(this.texturas[5]);
					this.manzanas.push(manzana);
					//Crear manzana
				}
				if(i == 0 && (j < this.cant_manzanas - 1)){
					this.calles[j].rotate([0.0, 1.0, 0.0], Math.PI/2);
					this.calles[j].translate([0.0, 0.0, (j + 1) * this.lado_manzana + j * this.ancho_calle + this.ancho_calle/2]);
				}
			}
			if(i < this.cant_manzanas - 1){
				this.calles[(this.cant_manzanas-1) + i].translate([(i + 1) * this.lado_manzana + i * this.ancho_calle + this.ancho_calle/2, 0.0, 0.0]);
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
		this.autopista.initTexture(this.texturas[6], this.texturas[7], this.texturas[10]);

		this.esc_autopista = [this.lado/final, this.lado/final, this.lado/final];
	}

	this.draw = function(mvScene){
		// this.plano.draw();

		this.cielo.draw(mvScene);

		for (var i = 0; i < this.calles.length; i++) {
			this.calles[i].drawCalle(mvScene, this.lado, this.lado_manzana, this.ancho_calle);
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
			this.manzanas[i].tick(t);
		}
	}

	this.setupWebGLBuffers = function(){
		this.cielo.setupWebGLBuffers();

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

	this.initTextures = function(){
		for (var i = 0; i < this.texturas_nombres.length; i++){
			var bool = true;
			if ((i == 8) || (i == 9)){
				bool = false;
			}
			this.initTexture(this.texturas_nombres[i], bool);
		};
	}

	this.initTexture = function(texture_file, bool){
		var aux_texture = gl.createTexture();
		aux_texture.image = new Image();
		aux_texture.image.onload = function () {
			handleLoadedTexture(aux_texture, bool);
		}
		aux_texture.image.src = texture_file;
		this.texturas.push(aux_texture);
	}

}
