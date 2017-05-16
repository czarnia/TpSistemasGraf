//Modelo un cubo que funciona como edificio.
function Edificio(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.vertices = null;

  this.create = function(_x, _y, _z) {
    this.x = _x;
    this.y = _y
    this.x = _z;

    this.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertices);

    var vertices_aux = [
      0, 0, 0,
      _x, 0, 0,
      _x, 0, _z,
      _x, _y, 0,
      0, _y, 0,
      _x, _y, _z,
      0, 0, _z,
      0, _y, _z,
    ]

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertices_aux), gl.STATIC_DRAW);
  }

}
