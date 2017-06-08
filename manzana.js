function Manzana(){
  this.terreno = new Vereda();
  this.edificios = [];
  this.lado = null;
  this.alto = null;

  this.crear_largos = function(largo_disponible, cantidad_largos){
    var largo_min = largo_disponible/6;
    var largo_max = largo_disponible/4;
    var largo_total = 0;
    var largos = [];

    for (var i = 0; i < cantidad_largos-1; i++){
      var largo = largo_min + Math.random() * (largo_max-largo_min);
      largos.push(largo);
      largo_total += largo;
    }
    largos.push(largo_disponible-largo_total);

    return largos;
  }

  this.create = function(lado, alto){
    this.terreno.create([0.631,0.631,0.718], lado, alto);
    this.lado = lado;
    this.alto = alto;
    var profundidad = lado/5;
    var lado_edif = 4*(lado/5);
    var alto_min = lado*4;
    var alto_max = lado*2;
    var color = [0.6, 0.3, 0];

    var lados_x = this.crear_largos(lado_edif, 5);
    var lados_z = this.crear_largos(lado_edif-profundidad*2, 3);

    //Lados x
    var pos_z = lado_edif/2-profundidad;
    for (var i = 0; i < 2; i++){
      var pos_x = -lado_edif/2;
      for (var j = 0; j < 5; j++){
         var alto = alto_min + Math.random() * (alto_max-alto_min);
         var edif = new Edificio();
         color[0] = color[1]*j*0.2;
         color[2] = j*0.2;
         edif.create(lados_x[j], alto, profundidad, [pos_x+(lados_x[j]/2), alto/2+this.terreno.alto, pos_z+(profundidad/2)], color);
         this.edificios.push(edif);
         pos_x += lados_x[j];
      }
      pos_z = -lado_edif/2;
    }

    //Lados z
    pos_x = lado_edif/2-profundidad;
    for (var i = 0; i < 2; i++){
      var pos_z = -lado_edif/2+profundidad;
      for (var j = 0; j < 3; j++){
        var alto = alto_min + Math.random() * (alto_max-alto_min);
        var edif = new Edificio();
        color[0] = color[1]*j*0.2;
        color[2] = j*0.2;
        edif.create(profundidad, alto, lados_z[j], [pos_x+(profundidad/2), alto/2+this.terreno.alto, pos_z+(lados_z[j]/2)], color);
        this.edificios.push(edif);
        pos_z += lados_z[j];
      }
      pos_x = -lado_edif/2;
    }
  }

  this.draw = function(){
    this.terreno.draw();
    for (var i = 0; i < 16; i++){
      this.edificios[i].draw();
    }
  }

  this.setupWebGLBuffers = function(){
    this.terreno.setupWebGLBuffers();
    for (var i = 0; i < 16; i++){
      this.edificios[i].setupWebGLBuffers();
    }
  }

}
