function Manzana(){
  this.terreno = new Vereda();
  this.edificios = [];

  this.create = function(){
    var e = new Edificio();

    var alto_max = ; //y
    var alto_min = ;
    var ancho_max = ; //x
    var ancho_min = ;
    var profundidad = ; //z

    this.terreno.create([0.631,0.631,0.718]);

    for (var i = 0; i < 16; i++){
      var alto = alto_min + Math.random() * (alto_max-alto_min);
      var ancho = ancho_min + Math.random() * (ancho_max-ancho_min);

      if ((i % 4 == 0) && (i != 0)){
        var ancho = ;
        for (var j = 0; j < 4; j++){
          if (i == 8){
            ancho -= edificios[i-1-j].x;
          }else{
            ancho -= edificios[i-1-j].x;
          }
        }
      }
      if (i == 15){
        var ancho = ;
        ancho -= edificios[0].z + edificios[14].z + edificios[13].z + edificios[12].z;
      }

      var pos = []
      e.create(ancho, alto, profundidad);
    }

  }

  this.draw = function(){
    terreno.draw();
    for (var i = 0; i < 16; i++){
      edificios[i].draw();
    }
  }

}
