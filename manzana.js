function Manzana(){
  this.terreno = new Vereda();
  this.edificios = [];

  this.create = function(){
    var e = new Edificio();

    var alto_max = 10; //y
    var alto_min = 5;
    var ancho_max = 0.65; //x
    var ancho_min = 0.4;
    var profundidad = 0.5; //z

    this.terreno.create([0.631,0.631,0.718]);
    var pos_acum = [-3, -3, profundidad/2];

    var i = 0;
    for (i; i < 16; i++){
      var alto = alto_min + Math.random() * (alto_max-alto_min);
      var ancho = ancho_min + Math.random() * (ancho_max-ancho_min);

      if ((i % 4 == 0) && (i != 0)){
        var ancho = 3;
        for (var j = 0; j < 4; j++){
          if (i == 8){
            ancho -= this.edificios[i-1-j].x;
          }else{
            ancho -= this.edificios[i-1-j].x;
          }
        }
      }
      if (i == 15){
        var ancho = 3;
        ancho -= this.edificios[0].z + this.edificios[14].z + this.edificios[13].z + this.edificios[12].z;
      }

      if (i != 0){
        if (i < 5){
          pos_acum[0] += this.edificios[i-1].x + ancho/2;
        }else if (i <= 8){
          pos_acum[3] += this.edificios[i-1].z + profundidad/2;
        }else if (i <= 12){
          pos_acum[0] -= this.edificios[i-1].x + ancho/2;
        }else{
          pos_acum[3] -= this.edificios[i-1].z + profundidad/2;
        }
      }

      e.create(ancho, alto, profundidad, pos_acum);

      if (i <= 8 && i >= 5){
        e.rotate(Math.PI/2, [0,1,0]);
      }
      if (i <= 15 && i >= 13){
        e.rotate(-Math.PI/2, [0,1,0]);
      }

      this.edificios.push(e);
    }

  }

  this.draw = function(){
    this.terreno.draw();
    //for (var i = 0; i < 16; i++){
      //this.edificios[i].draw();
    //}
  }

  this.setupWebGLBuffers = function(){
    this.terreno.setupWebGLBuffers();
    //for (var i = 0; i < 1; i++){
      //this.edificios[i].setupWebGLBuffers();
    //}
  }

}
