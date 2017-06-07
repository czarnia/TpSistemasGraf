function Plaza(){
	this.terreno = new Vereda();
	this.lado = null;
	this.alto = null;

	this.create = function(lado, alto){
		this.terreno.create([154,205,50], lado, alto);
		this.lado = lado;
		this.alto = alto;
	}

	this.translate = function(mov){
		this.terreno.translate(mov);
	}

	this.setupWebGLBuffers = function(){
		this.terreno.setupWebGLBuffers();
	}

	this.draw = function(){
		this.terreno.draw();
	}
}
