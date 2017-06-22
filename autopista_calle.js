function Calle(){
	this.superficie = new supBarrido();
	this.path = new curvaBspline3();
	this.perfil = {
		forma:null,
		normal:null
	}
	this.final_curva = null;
	this.texture_buffer = null;
	this.niveles = null;

	//Hardcodeo todo para probar despues vamos a valores reales
	this.create_perfil = function(ancho, alto){
		this.perfil.forma = [];
		this.perfil.normal = [];
		this.niveles = 100;

		this.perfil.forma.push([-ancho / 2, -alto / 2, 0.0]);
		this.perfil.forma.push([-(ancho / 2) + (ancho / 6), alto / 2, 0.0]);
		this.perfil.forma.push([(ancho / 2) - (ancho / 6), alto / 2, 0.0]);
		this.perfil.forma.push([ancho / 2, -alto / 2, 0.0]);
		this.perfil.forma.push([-ancho / 2, -alto / 2, 0.0]);

/*		this.perfil.forma.push([-3.0, 0.5, 0.0]);
		this.perfil.forma.push([-2.5, 1.0, 0.0]);
		this.perfil.forma.push([2.5, 1.0, 0.0]);
		this.perfil.forma.push([3.0, 0.5, 0.0]);
		this.perfil.forma.push([-3.0, 0.5, 0.0]);*/

		//Para que matchee con la tangente de la curva
		this.perfil.normal.push([0.0, 0.0, 1.0]);
		//Para que matchee con la normal de la curva
		this.perfil.normal.push([1.0, 0.0, 0.0]);
	}

	this.mover_perfil = function(mov){
		//var v_mov = vec3.fromValues(mov, 0, 0);
		for (var i = 0; i < this.perfil.forma.length; i++) {        
            vec3.add(this.perfil.forma[i], mov, this.perfil.forma[i]);            
		}
	}

	this.create = function(curva_camino, es_autopista){
		this.path = curva_camino;

		this.superficie.con_textura = true;
		this.superficie.texture = this.texture;
		if(es_autopista)
			this.superficie.texture_buffer = this.create_text_buffer_au();
		else
			this.superficie.texture_buffer = this.create_text_buffer_st();

		this.superficie.create(this.path, this.niveles, this.perfil.forma, this.perfil.normal,
				 [0.0, 0.0, 0.0]);

		this.final_curva = this.superficie.final;
	}

	this.create_calle_escena = function(dimension, final){
		var puntos = [];

		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);
		puntos.push([0.0, 0.0, 0.0]);

		if(final[0] != 0)
			for (var i = 0.0; i < dimension; i += 1.0) {
				puntos.push([i, 0.0, 0.0]);
			}
		else
			for (var i = 0.0; i < dimension; i += 1.0) {
				puntos.push([0.0, 0.0, i]);
			}
		puntos.push(final);
		puntos.push(final);
		puntos.push(final);
		puntos.push(final);

		this.path.create(puntos);
		this.path.setupWebGLBuffers();
		this.create(this.path);
	}

	this.initTexture = function(texture_file){
		var aux_texture = gl.createTexture();
        this.texture = aux_texture;
        this.texture.image = new Image();
        // this.texture.image.handleLoadedTexture = this.handleLoadedTexture;

        this.texture.image.onload = function () {
               handleLoadedTexture();
        }
        this.texture.image.src = texture_file;
	}

	//Crea el texture buffer para la calle de la autopista
	this.create_text_buffer_au = function(){
		this.texture_buffer = [];
		for(var i = 0; i < this.niveles; i++){
			for (var j = 0; j < this.perfil.forma.length; j++) {
				switch(j){
					case 0:
						var u = 0;
						break;
					case 1:
						var u = 0.125;
						break;
					case 2:
						var u = 0.125 * 7;
						break;
					case 3:
						var u = 0.125 * 8;
						break;
					case 4:
						var u = 0;
						break;
				}
				if( i < 25){
					var v = 0.04 * i ;
				}else if(i < 50){
					var v = 0.04 * (i - 25) ;
				}else if(i < 75){
					var v = 0.04 * (i - 50) ;
				}else{
					var v = 0.04 * (i - 75) ;
				}
				this.texture_buffer.push(u);
				this.texture_buffer.push(v);
			}
		}
		return this.texture_buffer;
	}

	//Crea el texture buffer para la calle entre los edificios
	this.create_text_buffer_st = function(){
		this.texture_buffer = [];
		for(var i = 0; i < this.niveles; i++){
			for (var j = 0; j < this.perfil.forma.length; j++) {
				switch(j){
					case 0:
						var u = 0;
						break;
					case 1:
						var u = 0.125;
						break;
					case 2:
						var u = 0.125 * 7;
						break;
					case 3:
						var u = 0.125 * 8;
						break;
					case 4:
						var u = 0;
						break;
				}
				if( i < 50){
					var v = 0.02 * i ;
				}else{
					var v = 0.02 * (i - 50) ;
				}
				this.texture_buffer.push(u);
				this.texture_buffer.push(v);
			}
		}
		return this.texture_buffer;
	}

	this.get_comienzo = function(){
		return this.superficie.get_comienzo();
	}

	this.translate = function(mov){
		this.superficie.translate(mov);
	}

	this.rotate = function(p, plano){
		this.superficie.rotate(p, plano);
	}

	this.scale = function(_x, _y, _z){
		this.superficie.scale(_x, _y, _z);
	}

	this.draw = function(){		
		this.superficie.draw();
	}
}