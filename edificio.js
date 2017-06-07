//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.lados = [];

  this.create = function(_x, _y, _z, pos, color) {
    this.x = _x;
    this.y = _y;
    this.z = _z;

    // Cara 0 (yz)
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
      grid.translate(pos);
    };
  }

  this.setupWebGLBuffers = function (){
    for (var i = 0; i < 6; i++){
      var grid = this.lados[i];
      grid.setupWebGLBuffers();
    };
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
  }

  this.rotate = function(v, plano){
    for (i = 0; i < 6; i++) {
      this.lados[i].rotate(v, plano);
    };
  }

}
