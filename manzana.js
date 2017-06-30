function Manzana(){
  this.terreno = new Vereda();
  this.edificios = [];
  this.lado = null;
  this.alto = null;
  this.tick_ini = null;
  this.t = null;

  this.rotacion = null;
  this.translate = null;

  this.crear_largos = function(largo_disponible, cantidad_largos){
    var largo_min = largo_disponible/5;
    var largo_max = largo_disponible/3;
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

  this.create = function(lado, alto, t, tick_ini){
    this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);

    this.terreno.create([0.631,0.631,0.718], lado, alto);
    this.lado = lado;
    this.alto = alto;
    this.tick_ini = tick_ini;
    this.t = 0;

    var profundidad = lado/5;
    var lado_edif = 4*(lado/5);
    var alto_min = 1;
    var alto_max = 5;
    var color = [0.6, 0.3, 0];

    var lados_x = this.crear_largos(lado_edif, 4);
    var lados_z = this.crear_largos(lado_edif-profundidad*2, 2);

    //Lados x
    var pos_z = lado_edif/2-profundidad;
    for (var i = 0; i < 2; i++){
      var pos_x = -lado_edif/2;
      for (var j = 0; j < 4; j++){
         var alto = alto_min + Math.random() * (alto_max-alto_min);
         var edif = new Edificio();
         color[0] = color[1]*j*0.2;
         color[2] = j*0.5;
         // edif.create(lados_x[j], alto, profundidad, [pos_x+(lados_x[j]/2), this.terreno.alto, pos_z+(profundidad/2)], color, t);
         var random = Math.random() * 100;
         var text = Math.floor(random %  v_texturas_pisos.length);

         alto = Math.floor(alto)*v_texturas_pisos[text].y/128+v_texturas_PB[text].y/128

         edif.create(lados_x[j], alto, profundidad, [pos_x+(lados_x[j]/2), this.terreno.alto, pos_z+(profundidad/2)], color, t*(this.edificios.length+1)*(1/12));

         edif.initTexture(v_texturas_PB[text]);
         edif.initTexture(v_texturas_pisos[text]);
         this.edificios.push(edif);
         pos_x += lados_x[j];
      }
      pos_z = -lado_edif/2;
    }

    //Lados z
    pos_x = lado_edif/2-profundidad;
    for (var i = 0; i < 2; i++){
      var pos_z = -lado_edif/2+profundidad;
      for (var j = 0; j < 2; j++){
        var alto = alto_min + Math.random() * (alto_max-alto_min);
        var edif = new Edificio();
        color[1] = color[1]*j*0.3;
        color[2] = j*0.2;
        edif.create(profundidad, alto, lados_z[j], [pos_x+(profundidad/2), this.terreno.alto, pos_z+(lados_z[j]/2)], color, t);
        var random = Math.random() * 100;
        var text = Math.floor(random %  v_texturas_pisos.length);
        edif.initTexture(v_texturas_PB[text]);
        edif.initTexture(v_texturas_pisos[text]);
        this.edificios.push(edif);
        pos_z += lados_z[j];
      }
      pos_x = -lado_edif/2;
    }
  }

  this.tick = function(t){
    this.t += t;
    if (this.t <= this.tick_ini){
      return;
    }
    for (var i = 0; i < this.edificios.length; i++){
      this.edificios[i].tick(t);
    }
  }

  this.draw = function(mvMatrix_scene){
    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    var mvMatrix_manzana = mat4.create();
    mat4.identity(mvMatrix_manzana);
    mat4.multiply(mvMatrix_manzana, this.traslacion, this.rotacion);

    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_manzana);

    this.terreno.draw(mvMatrix_total);
    for (var i = 0; i < this.edificios.length; i++){
      this.edificios[i].draw(mvMatrix_total);
    }
  }

  this.setupWebGLBuffers = function(){
    this.terreno.setupWebGLBuffers();
    for (var i = 0; i < this.edificios.length; i++){
      this.edificios[i].setupWebGLBuffers();
    }
  }

  this.translate_acum = function(v){
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.translate = function(v){
		mat4.identity(this.traslacion);
		mat4.translate(this.traslacion, this.traslacion, v);
	}

	this.rotate_acum = function(eje, grados){
		mat4.rotate(this.rotacion, this.rotacion, grados, vec3.fromValues(eje[0], eje[1], eje[2]));
	}

	this.rotate = function(eje, grados){
		mat4.identity(this.rotacion);
		mat4.rotate(this.rotacion, this.rotacion, grados, vec3.fromValues(eje[0], eje[1], eje[2]));
	}

  this.initTexture = function(texture_file){
		this.terreno.initTexture(texture_file);
	}

  this.initTextureRoof = function(texture_file){
    for (var i = 0; i < this.edificios.length; i++){
      this.edificios[i].initTextureRoof(texture_file);
    }
  }

}
