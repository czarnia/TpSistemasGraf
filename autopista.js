function Autopista(){
	this.calle = new Calle();
	this.borde = new Borde();

	this.create = function(curva_camino){
		this.calle.create(curva_camino);
		this.borde.create(curva_camino);
	}

	this.draw = function(){
		this.calle.draw();
		this.borde.draw();
	}
}
