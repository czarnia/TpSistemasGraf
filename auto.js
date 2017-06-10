function Auto(){
  this.carcasa = new CarcasaAuto();
  this.ruedas = [];
  this.movimientos = [];
  this.ubic = null;
  this.velocidad = null;
  this.t = null;

  this.create = function(color_carcasa, color_rueda, ancho, alto, largo, r_rueda, ancho_rueda, velocidad){
    var posiciones_ruedas = [[-1/5*largo, -alto/2, -ancho/2], [1/4*largo, -alto/2, -ancho/2], [-1/5*largo, -alto/2, ancho/2], [1/4*largo, -alto/2, ancho/2]];

    this.velocidad = velocidad;
    this.ubic = 0;
    this.t = 0;
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

  this.translate = function(v){
    this.carcasa.translate(v);
    for (var i = 0; i < 4; i++){
      this.ruedas[i].translate(v);
    }
  }

  this.mover = function(v){
    this.translate(v);
  }

  this.agregar_movimiento = function(curva, step){
    for (var i = 0; i < step; i++){
      var u = (curva.valores_u/step)*i;
      var punto = curva.get_punto(u);
      this.movimientos.push(punto);
    }
  }

  this.tick = function(t){
    //this.t += t;
    //if (!(this.t >= 1/this.velocidad)){
      //return;
    //}
    //this.t = 0;
    this.mover(this.movimientos[this.ubic]);
    this.ubic += 1;
    if (this.ubic >= this.movimientos.length){
      this.ubic = 0;
    }
  }
}
