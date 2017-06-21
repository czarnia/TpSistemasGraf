//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.y_act = null;

  this.superficie = null;

  this.pos = null;
  this.t = null;
  this.t_pasado = 0;

  this.create = function(_x, _y, _z, pos, color, t_crec) {
    this.x = _x;
    this.y = _y;
    this.z = _z;

    this.t = t_crec;
    this.pos = pos;

    this.y_act = 0;

    this.superficie = new Cuadrado();
    this.superficie.create(this.x, this.y, this.z, color);
    this.superficie.translate(pos);
  }

  this.setupWebGLBuffers = function (){
    this.superficie.setupWebGLBuffers();
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
  }

  this.translate_acum = function(v){
		this.superficie.translate_acum(v);
	}

	this.translate = function(v){
		this.superficie.translate(v);
	}

	this.rotate_acum = function(eje, grados){
    this.superficie.rotate_acum(eje,grados);
	}

	this.rotate = function(eje, grados){
		this.superficie.rotate(eje,grados);
	}

  this.scale_abs = function(_x, _y, _z){
		this.superficie.scale_abs(_x, _y, _z);
	}

  this.draw = function(mvMatrix_scene){
    this.superficie.draw(mvMatrix_scene);
  }

}
