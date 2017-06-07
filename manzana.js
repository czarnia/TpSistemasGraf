function Manzana(){
  this.terreno = new Vereda();
  this.edificios = [];
  this.lado = null;
  this.alto = null;

  this.crear_largos_x = function(largo_disponible){
    var largo_min = ;
    var largo_max = ;
    var largo_total = 0;
    var largos = [];

    for (var i = 0; i < 4; i++){
      var largo = largo_min + Math.random() * (largo_max-largo_min);
      largos.push(largo);
      largo_total += largo;
    }
    largos.push(largo_disponible-largo_total);  
  }

  this.create = function(lado, alto){
    this.terreno.create([0.631,0.631,0.718], lado, alto);
    this.lado = lado;
    this.alto = alto;
    var profundidad = lado/5;
    var lado_edif = 4*(lado/5);
    var alto_min = lado*7;
    var alto_max = lado*5;

    lados_x = this.crear_largos(lado_edif);
    lados_z = this.crear_largos(lado_edif-profundidad*2);

    //Lados x
    var pos_z = lado_edif/2;
    for (var i = 0; i < 2; i++){
      var pos_x = 0;
      for (var j = 0; j < 5; j++){
         var alto = alto_min + Math.random() * (alto_max-alto_min);
         var edif = new Edificio();
         edif.create(lados_x[j], alto, profundidad, [pos_x+(lados_x[j]/2), alto/2+terreno.alto, pos_z+(profundidad/2)]);
         edificios.push(edif);
         pos_x += lados_x[j];
      }
      pos_z = -lado_edif/2;
    }

    //Lados z
    pos_x = lado_edif/2;
    for (var i = 0; i < 2; i++){
      var pos_z = profundidad;
      for (var j = 0; j < 5; j++){
        var alto = alto_min + Math.random() * (alto_max-alto_min);
        var edif = new Edificio();
        edif.create(profundidad, alto, lados_z[j], [pos_x+(profundidad/2), alto/2+terreno.alto, pos_z+(lados_z[j]/2)]);
        edificios.push(edif);
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
