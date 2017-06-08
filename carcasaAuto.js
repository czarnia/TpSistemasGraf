function CarcasaAuto(){
  this.superficie = new supBarrido();
	this.perfil = {
		forma:[],
		normal:[]
	}
  this.tapa1 = new SupFan();
  this.tapa2 = new SupFan();
	this.largo = null; //x
	this.alto = null; //y
  this.ancho = null; //z

  this.create = function(largo, alto, ancho, color){
    this.largo = largo;
  	this.alto = alto;
    this.ancho = ancho;
    var camino = this.camino();
    this.crear_perfil(100);
    this.superficie.create(camino, 40, this.perfil.forma, this.perfil.normal, color);
    this.tapa1.create(this.perfil.forma, color);
    this.tapa2.create(this.perfil.forma, color);
    this.tapa2.translate([0,0,ancho]);
  }

  this.camino = function(){
		var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([0,0,0]);
    puntos_control.push([0,0,0]);
    puntos_control.push([0,0,0]);
    puntos_control.push([0,0,0]);

    puntos_control.push([0,0,this.ancho]);
    puntos_control.push([0,0,this.ancho]);
    puntos_control.push([0,0,this.ancho]);
    puntos_control.push([0,0,this.ancho]);

		camino.create(puntos_control);
		return camino;
  }

  this.crear_perfil = function(step){
    var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);

    puntos_control.push([-(this.largo/2), -(this.alto/2), 0]);

    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([-(this.largo/2), -(this.alto/4), 0]);

    puntos_control.push([-(this.largo/2), 0, 0]);

    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);
    puntos_control.push([-(this.largo/4), 0, 0]);

    puntos_control.push([-(this.largo/8), this.alto/2, 0]);

    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);
    puntos_control.push([0, this.alto/2, 0]);

    puntos_control.push([this.largo*0.30, this.alto/2, 0]);

    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);
    puntos_control.push([(this.largo*0.4), 0, 0]);

    puntos_control.push([(this.largo/2), 0, 0]);

    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);
    puntos_control.push([(this.largo/2), -(this.alto/4), 0]);

    puntos_control.push([(this.largo/2), -(this.alto/2), 0]);

    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);
    puntos_control.push([0, -(this.alto/2), 0]);


    camino.create(puntos_control);

    for (var i = 0; i < step; i++){
      var u = (camino.valores_u/step)*i;
      var punto = camino.get_punto(u);
      this.perfil.forma.push(punto);
    }

    this.perfil.normal.push([0,0,1]);
    this.perfil.normal.push([0,1,0]);
  }

  this.setupWebGLBuffers = function(){
      this.tapa1.setupWebGLBuffers();
      this.tapa2.setupWebGLBuffers();
      this.superficie.setupWebGLBuffers();
  }

  this.draw = function(){
      this.superficie.draw();
      this.tapa1.draw();
      this.tapa2.draw();
  }

}
