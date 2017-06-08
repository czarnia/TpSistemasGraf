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

  this.translate = function(mov){
      this.superficie.grilla.translate(mov);
      this.tapa1.translate(mov);
      this.tapa2.translate(mov);
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
      this.tapa2.translate([0,alto,0]);
	}

	this.draw = function(){
    	this.superficie.draw();
      this.tapa1.draw();
      this.tapa2.draw();
	}
}
