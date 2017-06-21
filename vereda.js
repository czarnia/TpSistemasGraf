function Vereda(){
	this.superficie = new supBarrido();
	this.perfil = {
		forma:[],
		normal:[]
	}
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
        this.superficie.create(camino, 40, this.perfil.forma, this.perfil.normal, color);
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
}
