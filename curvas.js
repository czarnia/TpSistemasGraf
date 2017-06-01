//Curva de Besier base 3
function curvaBesier(){
    this.puntosDeControl = null;
    this.paso = null;

    //Defino las bases
    this.base0 = function(u) {
      return (1-u)*(1-u)*(1-u);
    }
    this.base1 = function(u) {
      return 3*(1-u)*(1-u)*u;
    }
    this.base2 = function(u) {
      return 3*(1-u)*u*u;
    }
    this.base3 = function(u) {
      return u*u*u;
    }

    //Defino las derivadas de las bases
    this.base0der = function(u) {
      return -3*u*u+6*u-3;
    }
    this.base1der = function(u) {
      return 9*u*u-12*u+3;
    }
    this.base2der = function(u) {
      return -9*u*u+6*u;
    }
    this.base3der = function(u) {
      return 3*u*u;
    }


    this.create = function(puntos) {
      this.puntosDeControl = puntos;
      this.valores_u = puntos.length - 3;
    }

    this.length = function(){
        return this.valores_u;
    }

    this.get_punto = function(u){
        var vector_aux = vec3.fromValues(0.0, 0.0, 0.0);
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var u_local = u - aux;

        if (this.valores_u <= u){
            aux = this.valores_u - 1;
            u_local = 1;
        }

        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux], this.base0(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 1], this.base1(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 2], this.base2(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 3], this.base3(u_local));

        return vector_aux;
    }

    this.get_tan = function(u){
        var vector_aux = vec3.fromValues(0.0, 0.0, 0.0);
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var u_local = u - aux;

        if (this.valores_u <= u){
            aux = this.valores_u - 1;
            u_local = 1;
        }

        var ok = true;
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 3; j++){
                if (this.puntosDeControl[aux][j] != this.puntosDeControl[aux + i][j])
                    ok = false;
            }
        }

        if (ok == true){
            if ((aux + 4) < this.puntosDeControl.length){
                vec3.subtract(vector_aux, this.puntosDeControl[aux + 4], this.puntosDeControl[aux]);
                return vector_aux;
            }
            vec3.subtract(vector_aux, this.puntosDeControl[aux], this.puntosDeControl[aux - 1]);
            return vector_aux;
        }

        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux], this.base0der(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 1], this.base1der(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 2], this.base2der(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 3], this.base3der(u_local));

        return vector_aux;
    }

      this.get_normal = function(u){
          var normal = vec3.create();
          vec3.cross(normal, this.binormal, this.get_tan(u));
          return normal;
      }

      this.setupWebGLBuffers = function(){
          // 1. Creamos un buffer para las posicioens dentro del pipeline.
          this.webgl_position_buffer = gl.createBuffer();
          // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
          // hemos creado.
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          // 3. Cargamos datos de las posiciones en el buffer.
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

          // Repetimos los pasos 1. 2. y 3. para la informaci�n del color
          this.webgl_color_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);

          // Repetimos los pasos 1. 2. y 3. para la informaci�n de los �ndices
          // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
          // Notar tambi�n que se usa un array de enteros en lugar de floats.
          this.webgl_index_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
      }

      this.draw = function(){

          var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
          gl.enableVertexAttribArray(vertexPositionAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

          var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
          gl.enableVertexAttribArray(vertexColorAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
          gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

          // Dibujamos.
        gl.drawElements(gl.LINE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }

}


//Curva Bspline base 3
function curvaBspline3(){
  this.puntosDeControl = null;
  this.valores_u = null;
  this.binormal = vec3.fromValues(0.0,0.0,1.0);
  this.grilla = null;

  this.position_buffer = null;
  this.color_buffer = null;
  this.index_buffer = null;
  this.webgl_position_buffer = null;
  this.webgl_color_buffer = null;
  this.webgl_index_buffer = null;

  //Bases
  this.base0 = function(u) {
    return (1-3*u+3*u*u-u*u*u)*1/6;
  }
  this.base1 = function(u) {
    return (4-6*u*u+3*u*u*u)*1/6;
  }
  this.base2 = function(u) {
    return (1+3*u+3*u*u-3*u*u*u)*1/6;
  }
  this.base3 = function(u) {
    return (u*u*u)*1/6;
  }

  //Derivadas de las bases
  this.base0der = function(u) {
    return (-3 +6*u -3*u*u)/6;
  }
  this.base1der = function(u) {
    return (-12*u+9*u*u)/6;
  }
  this.base2der = function(u) {
    return (3+6*u-9*u*u)/6;
  }
  this.base3der = function(u) {
    return (3*u*u)*1/6;
  }

  this.create = function(puntos) {
    this.puntosDeControl = puntos;
    this.valores_u = puntos.length - 3;
    }

    this.length = function(){
        return this.valores_u;
    }

    this.get_punto = function(u){
        var vector_aux = vec3.fromValues(0.0, 0.0, 0.0);
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var u_local = u - aux;

        if (this.valores_u <= u){
            aux = this.valores_u - 1;
            u_local = 1;
        }

        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux], this.base0(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 1], this.base1(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 2], this.base2(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 3], this.base3(u_local));

        return vector_aux;
    }

    this.get_tan = function(u){
        var vector_aux = vec3.fromValues(0.0, 0.0, 0.0);
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var u_local = u - aux;

        if (this.valores_u <= u){
            aux = this.valores_u - 1;
            u_local = 1;
        }

        //Considero el caso en el que el vector tangente da 0
        var ok = false;
/*        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 3; j++){
                if (this.puntosDeControl[aux][j] != this.puntosDeControl[aux + i][j])
                    ok = false;
            }
        }

        if (ok == true){
            if ((aux + 4) < this.puntosDeControl.length){
                vec3.subtract(vector_aux, this.puntosDeControl[aux + 4], this.puntosDeControl[aux]);
                return vector_aux;
            }
            vec3.subtract(vector_aux, this.puntosDeControl[aux], this.puntosDeControl[aux - 1]);
            return vector_aux;
        }*/

        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux], this.base0der(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 1], this.base1der(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 2], this.base2der(u_local));
        vec3.scaleAndAdd(vector_aux, vector_aux, this.puntosDeControl[aux + 3], this.base3der(u_local));

        for(var i = 0; i < vector_aux.length; i++){
            if(vector_aux[i] != 0)
                ok = true;
        }

        if (ok == false){
            if ((aux + 4) < this.puntosDeControl.length){
                vec3.subtract(vector_aux, this.puntosDeControl[aux + 4], this.puntosDeControl[aux]);
                return vector_aux;
            }
            vec3.subtract(vector_aux, this.puntosDeControl[aux], this.puntosDeControl[aux - 1]);
            return vector_aux;
        }

        return vector_aux;
    }

    this.get_normal = function(u){
        var normal = vec3.create();
        vec3.cross(normal, this.binormal, this.get_tan(u));
        return normal;
    }

    this.curva_prueba = function(){
        this.position_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var aux = vec3.create();
        for (var i = 0; i < (this.valores_u * 10); i += 1) {
           aux = this.get_punto(i/10);

           this.position_buffer.push(aux[0]);
           this.position_buffer.push(aux[1]);
           this.position_buffer.push(aux[2]);

           this.color_buffer.push(1.0);
           this.color_buffer.push(1.0);
           this.color_buffer.push(1.0);

           this.index_buffer.push(i);
        }
    }

    this.setupWebGLBuffers = function(){
        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        this.webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

        // Repetimos los pasos 1. 2. y 3. para la informaci�n del color
        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);

        // Repetimos los pasos 1. 2. y 3. para la informaci�n de los �ndices
        // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
        // Notar tambi�n que se usa un array de enteros en lugar de floats.
        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
    }

    this.draw = function(){

        var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        // Dibujamos.
        gl.drawElements(gl.LINE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }
}
