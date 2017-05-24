//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.lados = [];

  this.create = function(_x, _y, _z) {
    this.x = _x;
    this.y = _y;
    this.z = _z;

    var grid = new VertexGrid();
    grid.create(2, 2);
    grid.createUniformPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [1,0,0]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(2, 2);
    grid.createUniformPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [1,0,0]);
    grid.translate([0,1,0]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(2, 2);
    grid.createUniformPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [0,1,0]);
    grid.translate([0.5,0.5,0]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(2, 2);
    grid.createUniformPlaneGrid();
    grid.createIndexBuffer();
    grid.rotate(Math.PI/2, [0,1,0]);
    grid.translate([-0.5,0.5,0]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(2, 2);
    grid.createUniformPlaneGrid();
    grid.createIndexBuffer();
    grid.translate([0,0.5,0.5]);
    this.lados.push(grid);

    grid = new VertexGrid();
    grid.create(2, 2);
    grid.createUniformPlaneGrid();
    grid.createIndexBuffer();
    grid.translate([0,0.5,-0.5]);
    this.lados.push(grid);
  }

  this.setupWebGLBuffers = function (){
    for (var i = 0; i < 6; i++){
      var grid = this.lados[i];
      grid.setupWebGLBuffers();
    };
  }

  this.draw = function(){
    //this.lados[0].drawVertexGrid();
    for (i = 0; i < 6; i++) {
      this.lados[i].drawVertexGrid();
    };
  }

}
