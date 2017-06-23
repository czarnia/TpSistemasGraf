//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.y_act = null;

  this.superficie = null;
  this.techo = null;

  this.textures = null;

  this.pos = null;
  this.t = null;
  this.t_pasado = 0;

  this.create = function(_x, _y, _z, pos, color, t_crec) {
    this.textures = [];

    this.x = _x;
    this.y = _y;
    this.z = _z;

    this.t = t_crec;
    this.pos = pos;

    this.y_act = 0;    

    this.superficie = new Cuadrado();
    this.superficie.create(this.x, this.y, this.z, color);
    this.superficie.translate([pos[0], 0.0000000000000000000000001, pos[2]]);
    this.superficie.scale_abs(this.x, 0.0000000000000000000000001, this.z);

    this.techo = new Cuadrado();
    this.techo.create_tapa(this.x, this.y, this.z, [0.66, 0.66, 0.66]);
    this.techo.translate([pos[0], 0.0000000000000000000000001, pos[2]]);
    this.techo.scale_abs(this.x, 0.0000000000000000000000001, this.z);
  }

  //Primero va la de PB y despues la de los demas pisos
  this.initTexture = function(texture_file){
    var aux_texture = gl.createTexture();
    var texture = aux_texture;
    texture.image = new Image();

    texture.image.onload = function () {
           handleLoadedTexture(texture, false);
    }
    texture.image.src = texture_file;
    //Como hay varias texturas agrego a un vector
    this.textures.push(texture);
  }

  this.setupWebGLBuffers = function (){
    this.superficie.textures.push(this.textures[0]);
    this.superficie.textures.push(this.textures[1]);
    this.superficie.setupWebGLBuffers();

    this.techo.setupWebGLBuffers();
  }

  this.tick = function(t){
    if (this.y_act >= this.y){
      return;
    }
    this.t_pasado += t;
    var aumento_y = (this.y/this.t)*this.t_pasado-this.y_act;
    this.y_act = (this.y/this.t)*this.t_pasado;
    if (this.y_act > this.y){
      aumento_y -= this.y_act-this.y;
      this.y_act = this.y;
    }
    this.pos[1] += aumento_y/2;
    this.superficie.translate_acum([0,aumento_y/2,0]);
    this.superficie.scale_abs(this.x, this.y_act, this.z);
    this.superficie.actualizar_texture_buffer();
    this.superficie.setupWebGLBuffers();

    this.techo.translate_acum([0,aumento_y/2,0]);
    this.techo.scale_abs(this.x, this.y_act, this.z);
    this.techo.setupWebGLBuffers();
  }

  this.translate_acum = function(v){
		this.superficie.translate_acum(v);

    this.techo.translate_acum(v);
	}

	this.translate = function(v){
		this.superficie.translate(v);

    this.techo.translate(v);
	}

	this.rotate_acum = function(eje, grados){
    this.superficie.rotate_acum(eje,grados);

    this.techo.rotate_acum(eje,grados);
	}

	this.rotate = function(eje, grados){
		this.superficie.rotate(eje,grados);

    this.techo.rotate(eje,grados);
	}

  this.scale_abs = function(_x, _y, _z){
		this.superficie.scale_abs(_x, _y, _z);

    this.techo.scale_abs(_x, _y, _z);
	}

  this.draw = function(mvMatrix_scene){
    this.superficie.draw(mvMatrix_scene);

    this.techo.draw(mvMatrix_scene);
  }

}
