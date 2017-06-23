function Plaza(){
	this.terreno = new Vereda();
	this.lado = null;
	this.alto = null;

	this.create = function(lado, alto){
		this.terreno.create([154/255,205/255,50/255], lado, alto);
		this.lado = lado;
		this.alto = alto;
	}

	this.translate_acum = function(v){
		this.terreno.translate_acum(v);
	}

	this.translate = function(v){
		this.terreno.translate(v);
	}

	this.setupWebGLBuffers = function(){
		this.terreno.setupWebGLBuffers();
	}

	this.draw = function(mvMatrix_scene){
		this.terreno.draw(mvMatrix_scene);
	}

	this.initTexture = function(texture_file){
		this.terreno.initTexture(texture_file);
	}
}
