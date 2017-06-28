function Vereda(){
	this.superficie = new supBarrido();
	this.perfil = {
		forma:[],
		normal:[],
		normales:null
	}
	this.camino_perfil = null;
	this.tapa1 = new SupFan();
	this.tapa2 = new SupFan();
	this.lado = null;
	this.alto = null;

	this.rotacion = null;
	this.traslacion = null;

	this.traslacion_tapa1 = null; //las tapas sólo están trasladadas respecto a la superficie.
  this.traslacion_tapa2 = null;

  this.camino = function(alto){
		var camino = new curvaBspline3();
		var puntos_control = [];

        puntos_control.push([0,0,0]);
        puntos_control.push([0,0,0]);
        puntos_control.push([0,0,0]);
        puntos_control.push([0,0,0]);

        puntos_control.push([0,this.alto,0]);
        puntos_control.push([0,this.alto,0]);
        puntos_control.push([0,this.alto,0]);
        puntos_control.push([0,this.alto,0]);

		camino.create(puntos_control);
		return camino;
  }

  this.crear_perfil = function(step){

    var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);

    puntos_control.push([(this.lado/2)-(this.lado/10),0,-this.lado/2]);
    puntos_control.push([(this.lado/2)-(this.lado/10),0,-this.lado/2]);
    puntos_control.push([(this.lado/2)-(this.lado/10),0,-this.lado/2]);
    puntos_control.push([(this.lado/2)-(this.lado/10),0,-this.lado/2]);

    puntos_control.push([this.lado/2,0,-(this.lado/2)]);

    puntos_control.push([this.lado/2,0,-(this.lado/2)+(this.lado/10)]);
    puntos_control.push([this.lado/2,0,-(this.lado/2)+(this.lado/10)]);
    puntos_control.push([this.lado/2,0,-(this.lado/2)+(this.lado/10)]);
    puntos_control.push([this.lado/2,0,-(this.lado/2)+(this.lado/10)]);

    puntos_control.push([this.lado/2,0,(this.lado/2)-(this.lado/10)]);
    puntos_control.push([this.lado/2,0,(this.lado/2)-(this.lado/10)]);
    puntos_control.push([this.lado/2,0,(this.lado/2)-(this.lado/10)]);
    puntos_control.push([this.lado/2,0,(this.lado/2)-(this.lado/10)]);

    puntos_control.push([this.lado/2,0,this.lado/2]);

    puntos_control.push([(this.lado/2)-(this.lado/10),0,this.lado/2]);
    puntos_control.push([(this.lado/2)-(this.lado/10),0,this.lado/2]);
    puntos_control.push([(this.lado/2)-(this.lado/10),0,this.lado/2]);
    puntos_control.push([(this.lado/2)-(this.lado/10),0,this.lado/2]);

    puntos_control.push([-(this.lado/2)+(this.lado/10),0,this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,this.lado/2]);

    puntos_control.push([-(this.lado/2),0,this.lado/2]);

    puntos_control.push([-(this.lado/2),0,(this.lado/2)-(this.lado/10)]);
    puntos_control.push([-(this.lado/2),0,(this.lado/2)-(this.lado/10)]);
    puntos_control.push([-(this.lado/2),0,(this.lado/2)-(this.lado/10)]);
    puntos_control.push([-(this.lado/2),0,(this.lado/2)-(this.lado/10)]);

    puntos_control.push([-(this.lado/2),0,-(this.lado/2)+(this.lado/10)]);
    puntos_control.push([-(this.lado/2),0,-(this.lado/2)+(this.lado/10)]);
    puntos_control.push([-(this.lado/2),0,-(this.lado/2)+(this.lado/10)]);
    puntos_control.push([-(this.lado/2),0,-(this.lado/2)+(this.lado/10)]);

    puntos_control.push([-this.lado/2,0,-this.lado/2]);

    //repito el primer punto para cerrar la curva

    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);
    puntos_control.push([-(this.lado/2)+(this.lado/10),0,-this.lado/2]);

		camino.create(puntos_control);

		this.camino_perfil = camino;

    for (var i = 0; i < step; i++){
      var u = (camino.valores_u/step)*i;
      var punto = camino.get_punto(u);
      this.perfil.forma.push(punto);
    }

    this.perfil.normal.push([0,1,0]);
    this.perfil.normal.push([0,0,1]);
  }

	this.translate_acum = function(v){
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.translate = function(v){
		mat4.identity(this.traslacion);
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.rotate_acum = function(eje, grados){
		mat4.rotate(this.rotacion, this.rotacion, grados, vec3.fromValues(eje[0], eje[1], eje[2]));
	}

	this.rotate = function(eje, grados){
		mat4.identity(this.rotacion);
		mat4.rotate(this.rotacion, this.rotacion, grados, vec3.fromValues(eje[0], eje[1], eje[2]));
	}

  this.setupWebGLBuffers = function(){
      this.tapa1.setupWebGLBuffers();
      this.tapa2.setupWebGLBuffers();
      this.superficie.setupWebGLBuffers();
  }


	this.create = function(color, lado, alto){
        this.lado = lado;
        this.alto = alto;
        var camino = this.camino();
        this.crear_perfil(100);
        this.superficie.create(camino, 40, this.perfil, color);
        this.tapa1.create(this.perfil.forma, color);
        this.tapa2.create(this.perfil.forma, color);

				this.rotacion = mat4.create();
		    mat4.identity(this.rotacion);
		    this.traslacion = mat4.create();
		    mat4.identity(this.traslacion);

				this.traslacion_tapa1 = mat4.create();
		    mat4.identity(this.traslacion_tapa1);

		    this.traslacion_tapa2 = mat4.create();
		    mat4.identity(this.traslacion_tapa2);
				mat4.translate(this.traslacion_tapa2, this.traslacion_tapa2, [0,alto,0]);
	}

	this.create_text_buffer = function(){
		var buffer_tapas = [];
		var buffer_superficie = [];

		var step = 100;

		buffer_tapas.push(this.lado);
		buffer_tapas.push(this.lado);

		for (var i = 0; i < step; i++){
			var u = (this.camino_perfil.valores_u/step)*i;
			var punto = this.camino_perfil.get_punto(u);
			buffer_tapas.push(2*(punto[0]+this.lado/2));
			buffer_tapas.push(2*(punto[2]+this.lado/2));
		}

		for (var i = 0; i < 40; i++){
			for (var j = 0; j < step; j++){
				var u = (this.camino_perfil.valores_u/step)*j;
				var punto = this.camino_perfil.get_punto(u);
				buffer_superficie.push(punto[0]+punto[2]+2*this.lado);
				buffer_superficie.push(i*0.1);
			}
		}

		this.superficie.asign_text_buffer(buffer_superficie);
		this.tapa1.asign_text_buffer(buffer_tapas);
		this.tapa2.asign_text_buffer(buffer_tapas);
	}

	this.draw = function(mvMatrix_scene){
			var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

			var mvMatrix_vereda = mat4.create();
			mat4.identity(mvMatrix_vereda);
			mat4.multiply(mvMatrix_vereda, this.traslacion, this.rotacion);

			var mvMatrix_total = mat4.create();
			mat4.identity(mvMatrix_total);
			mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_vereda);

      this.superficie.draw(mvMatrix_total);

			var mvMatrix_tapa1 = mat4.create();
			mat4.identity(mvMatrix_tapa1);
			var mvMatrix_tapa2 = mat4.create();
			mat4.identity(mvMatrix_tapa2);

			mat4.multiply(mvMatrix_tapa1, mvMatrix_total, this.traslacion_tapa1);
			mat4.multiply(mvMatrix_tapa2, mvMatrix_total, this.traslacion_tapa2);

      this.tapa1.draw(mvMatrix_tapa1);
      this.tapa2.draw(mvMatrix_tapa2);
	}

	this.initTexture = function(texture_file){
		this.tapa1.initTexture(texture_file);
		this.tapa2.initTexture(texture_file);
		this.superficie.initTexture(texture_file);
		this.create_text_buffer();
	}
}
