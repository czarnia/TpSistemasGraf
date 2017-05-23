//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.lados = [];

  this.create = function(_x, _y, _z) {
    this.x = _x;
    this.y = _y
    this.x = _z;

    grid = new VertexGrid();
    grid.create(_x, _y);
    grid.createSinPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.pi/2, [0,1,1]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(_x, _y);
    grid.createSinPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.pi/2, [0,1,1]);
    grid.translate([0,0,_z]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(_x, _z);
    grid.createSinPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.pi/2, [1,1,0]);
    grid.translate([0,_y,0]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(_x, _z);
    grid.createSinPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.pi/2, [1,1,0]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(_y, _z);
    grid.createSinPlaneGrid();
    grid.createIndexBuffer();
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(_y, _z);
    grid.createSinPlaneGrid();
    grid.createIndexBuffer();
    grid.translate([_x,0,0]);
    this.lados.push(grid);
  }

  this.setupWebGLBuffers = function (){
    for (i = 0; i < 6; i++){
      grid = this.lados[i];
      grid.setupWebGLBuffers();
    };
  }

  this.draw = function(){
    for (i = 0; i < 6; i++) {
      this.lados[i].drawVertexGrid();
    };
  }

}
