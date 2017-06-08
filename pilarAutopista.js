function PilarAutopista(){
	this.superficie = new supRevolucion();
	this.perfil = [];

	this.create = function(){
		this.crear_perfil();
		var puntos_perfil = [];
		puntos_perfil.push([-20,83,0]);
		for (var j = 0; j < this.perfil.length; j++){
			for (var i = 0; i < 40; i++){
				var u = (this.perfil[j].valores_u/40)*i;
				var punto = this.perfil[j].get_punto(u);
				puntos_perfil.push(punto);
			}
		}

		this.superficie.create([0,1,0], puntos_perfil, Math.PI*2, 60.0);
	}

	this.crear_perfil = function(){
		var copa = new curvaBesier();
		var pilar = new curvaBesier();
		var base = new curvaBesier();

		var p_copa = [];
		var p_pilar = [];
		var p_base = [];

		p_copa.push([-20,80,0]);
		p_copa.push([-20,80,0]);
		p_copa.push([-7,70,0]);
		p_copa.push([-7,70,0]);

		p_pilar.push([-7,70,0]);
		p_pilar.push([-7,70,0]);
		p_pilar.push([-7,20,0]);
		p_pilar.push([-7,20,0]);

		p_base.push([-7,20,0]);
		p_base.push([-15,15,0]);
		p_base.push([-15,10,0]);
		p_base.push([-20,0,0]);

		copa.create(p_copa);
		pilar.create(p_pilar);
		base.create(p_base);

		this.perfil.push(copa);
		this.perfil.push(pilar);
		this.perfil.push(base);
	}

	this.translate = function(vec){
		this.superficie.translate(vec);
	}

	this.rotate = function(grados, eje){
		this.superficie.rotate(grados, eje);
	}

	this.draw = function(){
		this.superficie.draw();
	}

	this.scale = function(_x, _y, _z){
		this.superficie.scale(_x, _y, _z);
	}
}
