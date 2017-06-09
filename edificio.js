//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.y_act = null;
  this.lados = null;
  this.pos = null;
  this.t = null;
  this.t_pasado = 0;

  this.create = function(_x, _y, _z, pos, color, t_crec) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.t = t_crec;
    this.pos = pos;
    this.color = color;

    this.y_act = 0;

    this.crear_caras(this.x, this.y_act, this.z, color);
  }

  this.crear_caras = function(_x, _y, _z, color){
    // Cara 0 (yz)
    this.lados = [];

    var grid = new Plano();
    grid.create(_x, _z, color);
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [1,0,0]);
    grid.translate([0,_y/2,0]);
    this.lados.push(grid);

    // Cara 1 (yz)
    grid = new Plano();
    grid.create(_x, _z, color);
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [1,0,0]);
    grid.translate([0,-_y/2,0]);
    this.lados.push(grid);


    // Cara 2 (xz)
    grid = new Plano();
    grid.create(_z, _y, color);
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [0,1,0]);
    grid.translate([_x*0.5,0,0]);
    this.lados.push(grid);

    // Cara 3 (xz)
    grid = new Plano();
    grid.create(_z, _y, color);
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [0,1,0]);
    grid.translate([-_x*0.5,0,0]);
    this.lados.push(grid);

    grid = new Plano();
    grid.create(_x, _y, color);
    grid.createIndexBuffer();
    grid.translate([0,0,_z*0.5]);
    this.lados.push(grid);

    grid = new Plano();
    grid.create(_x, _y, color);
    grid.createIndexBuffer();
    grid.translate([0,0,-_z*0.5]);
    this.lados.push(grid);


    for (var i = 0; i < 6; i++){
      var grid = this.lados[i];
      grid.translate(this.pos);
    };
  }

  this.setupWebGLBuffers = function (){
    for (var i = 0; i < 6; i++){
      var grid = this.lados[i];
      grid.setupWebGLBuffers();
    };
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
    this.crear_caras(this.x, this.y_act, this.z, this.color);
  }

  this.draw = function(){
    for (i = 0; i < 6; i++) {
      this.lados[i].draw();
    };
  }

  this.translate = function(v){
    for (i = 0; i < 6; i++) {
      this.lados[i].translate(v);
    };
    this.pos[0] = this.pos[0]+v[0];
    this.pos[1] = this.pos[1]+v[1];
    this.pos[2] = this.pos[2]+v[2];
  }

  this.rotate = function(v, plano){
    for (i = 0; i < 6; i++) {
      this.lados[i].rotate(v, plano);
    };
  }

}
