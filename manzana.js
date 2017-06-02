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
    var pos_acum = [, , profundidad/2];

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

      if ((i =< 4) && (i > 0)){
        pos_acum[x] += edificios[i-1].x + ancho/2;
      }else if (i =< 8){
        pos_acum[z] += edificios[i-1].z + profundidad/2;
      }else if (i <= 12){
        pos_acum[x] -= edificios[i-1].x + ancho/2;
      }else{
        pos_acum[z] -= edificios[i-1].z + profundidad/2;
      }

      e.create(ancho, alto, profundidad, pos_acum);

      if ((i <= 8) && (i >= 5)){
        e.rotate(Math.PI/2, [0,1,0]);
      }
      if ((i <= 15) && (i >= 13)){
        e.rotate(-Math.PI/2, [0,1,0]);
      }

      this.edificios.push(e);
    }

  }

  this.draw = function(){
    terreno.draw();
    for (var i = 0; i < 16; i++){
      edificios[i].draw();
    }
  }

}
