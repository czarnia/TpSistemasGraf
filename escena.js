function Escena(){
	this.lado = null;
	this.cant_manzanas = null;
	this.ancho_calle = null;
	this.lado_manzana = null;
	this.calles = null;
	this.plano = new Plano();
	this.plazas = null;

	this.create_manzanas = function(cant_manzanas, lado_manzana,
							ancho_calle, autopista){
		this.cant_manzanas = cant_manzanas;
		this.ancho_calle = ancho_calle;
		this.autopista = autopista;
		this.lado_manzana = lado_manzana;
	}

	this.create_calles = function(lado){
		this.lado = lado;
		this.calles = [];

		//Asumo valores enteros
		for (var i = 0; i < 2 * (lado - this.cant_manzanas * this.lado_manzana) / this.ancho_calle; i++) {
			var calle = new Calle();
			calle.create_perfil(this.ancho_calle, 0.5);
			calle.create_calle_escena(lado, [0.0, 0.0, lado]);
			this.calles.push(calle);
		}
	}

	this.create_mapa = function(){
		this.plano.create(this.lado, this.lado, [0.5, 0.0, 0.0]);
		this.plano.createIndexBuffer();
		this.plano.rotate(Math.PI/2, [1.0, 0.0, 0.0]);
		this.plano.translate([this.lado/2, 0.0, this.lado/2]);
		this.plano.setupWebGLBuffers();

		this.plazas = [];		

		for (var i = 0; i < this.cant_manzanas; i++) {
			for (var j = 0; j < this.cant_manzanas; j++) {
				if(this.autopista.coincide(j*(this.lado_manzana + this.ancho_calle), this.lado_manzana,
					 i * (this.lado_manzana + this.ancho_calle), this.lado_manzana) == true){
					//Crear plaza
					var plaza = new Plaza();
					plaza.create();
					plaza.translate([this.lado_manzana/2 + j*(this.lado_manzana + this.ancho_calle),
										  0.0,
									this.lado_manzana/2 + i * (this.lado_manzana + this.ancho_calle)]);

					// plaza.translate([0.0, 0.0, 0.0]);
					plaza.setupWebGLBuffers();
					this.plazas.push(plaza);
					console.log("PLAZA");
				}
				else
					//Crear manzana
					console.log("MANZANA");
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

	this.draw = function(){
		this.plano.draw();

		for (var i = 0; i < this.calles.length; i++) {
			this.calles[i].draw();
		}

		for (var i = 0; i < this.plazas.length; i++) {
			this.plazas[i].draw();
		}

	}
}