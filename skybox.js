function SkyBox(){
  this.superficie = null;
  this.x = null;
  this.y = null;
  this.z = null;

  this.create = function(_x, _y, _z, pos, color) {
    this.x = _x;
    this.y = _y;
    this.z = _z;

    this.superficie = new Cuadrado();
    this.superficie.create(this.x, this.y, this.z, color);
    this.superficie.translate([pos[0], pos[1], pos[2]]);
  }

  this.translate_acum = function(v){
		this.superficie.translate_acum(v);
    this.techo.translate_acum(v);
	}

	this.translate = function(v){
		this.superficie.translate(v);

    this.techo.translate(v);
	}

  this.scale_abs = function(_x, _y, _z){
		this.superficie.scale_abs(_x, _y, _z);
	}

  this.draw = function(mvMatrix_scene){
    this.superficie.draw(mvMatrix_scene);
  }

  this.setupWebGLBuffers = function(){
    this.superficie.setupWebGLBuffers();
  }

  this.initTexture = function(texture){
    var texture_buffer = this.create_text_buffer();
    this.superficie.addTexture(texture);
    this.superficie.asign_text_buffer(texture_buffer);
  }

  this.create_text_buffer = function(){
    var texture_buffer = [];

    texture_buffer = [
      1, 2/3,
      0.75, 2/3,
      0.75, 1/3,
      1, 1/3,

      0.25, 2/3,
      0.25, 1/3,
      0.5, 1/3,
      0.5, 2/3,

      0.25, 1/3,
      0.25, 0,
      0.5, 0,
      0.5, 1/3,

      0.25, 2/3,
      0.5, 2/3,
      0.5, 1,
      0.25, 1,

      0.5, 2/3,
      0.5, 1/3,
      0.75, 1/3,
      0.75, 2/3,

      0.25, 2/3,
      0, 2/3,
      0, 1/3,
      0.23, 1/3,
    ];

    return texture_buffer;
  }

}
