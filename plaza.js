function Plaza(){
	this.terreno = new Vereda();

	this.create = function(){
		this.terreno.create([154,205,50]);
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
