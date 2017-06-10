function Auto(){
  this.carcasa = new CarcasaAuto();
  this.ruedas = [];

  this.create = function(color_carcasa, color_rueda, ancho, alto, largo, r_rueda, ancho_rueda){
    var posiciones_ruedas = [[-1/4*largo, -alto/2, -ancho/2], [1/4*largo, -alto/2, -ancho/2], [-1/4*largo, -alto/2, ancho/2], [1/4*largo, -alto/2, ancho/2]];
    this.carcasa.create(largo, alto, ancho, color_carcasa);
    for (var i = 0; i < 4; i++){
      var r = new Rueda();
      r.create(r_rueda, ancho_rueda, color_rueda);
      r.translate(posiciones_ruedas[i]);
      this.ruedas.push(r);
    }
  }

  this.draw = function(){
    this.carcasa.draw();
    for (var i = 0; i < 4; i++){
      this.ruedas[i].draw();
    }
  }

  this.setupWebGLBuffers = function(){
    this.carcasa.setupWebGLBuffers();
  }
}
