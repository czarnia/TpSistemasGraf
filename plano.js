function VertexGrid () {
    this.cols = null;
    this.rows = null;
    this.index_buffer = null;

    this.position_buffer = null;
    this.color_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.create = function(_rows, _cols){
      this.cols = _cols;
      this.rows = _rows;

      this.position_buffer.push(-_rows/2.0);
      this.position_buffer.push(-_cols/2.0);
      this.position_buffer.push(0);

      this.position_buffer.push(_rows/2.0);
      this.position_buffer.push(-_cols/2.0);
      this.position_buffer.push(0);

      this.position_buffer.push(-_rows/2.0);
      this.position_buffer.push(-_cols/2.0);
      this.position_buffer.push(0);

      this.position_buffer.push(_rows/2.0);
      this.position_buffer.push(_cols/2.0);
      this.position_buffer.push(0);
    }

    this.rotate = function(p, plano){
      var position_buffer_aux = [];
      var m4=mat4.create();
      mat4.rotate(m4, m4, p, vec3.fromValues(plano[0], plano[1], plano[2]));

      var vec_aux = []
      for (var i = 0.0; i < this.position_buffer.length; i++) {
        vec_aux.push(this.position_buffer[i]);
        if ((i+1.0)%3 == 0){
          var vec = vec4.fromValues(vec_aux[0], vec_aux[1], vec_aux[2], 1.0);
          vec4.transformMat4(vec,vec,m4);
          position_buffer_aux.push(vec[0]);
          position_buffer_aux.push(vec[1]);
          position_buffer_aux.push(vec[2]);
          vec_aux = [];
        }
      };
      this.position_buffer = position_buffer_aux;
    }

    this.translate = function(p){
      var position_buffer_aux = [];
      var m4=mat4.create();
      mat4.translate(m4, m4, vec3.fromValues(p[0], p[1], p[2]));
      var vec_aux = []
      for (var i = 0.0; i < this.position_buffer.length; i++) {
        vec_aux.push(this.position_buffer[i]);
        if ((i+1.0)%3 == 0){
          var vec = vec4.fromValues(vec_aux[0], vec_aux[1], vec_aux[2], 1.0);
          vec4.transformMat4(vec,vec,m4);
          position_buffer_aux.push(vec[0]);
          position_buffer_aux.push(vec[1]);
          position_buffer_aux.push(vec[2]);
          vec_aux = [];
        }
      };
      this.position_buffer = position_buffer_aux;
    }

    this.createIndexBuffer = function(){

        this.index_buffer = []
        var i, j;

        for (i = 0.0; i < this.rows-1.0; i++){
          for (j = 0.0; j < this.cols; j++){
            if (i%2 == 0.0){
              this.index_buffer.push(this.cols*i+j);
              this.index_buffer.push(this.cols*(i+1.0)+j);
            }else{
              this.index_buffer.push(this.cols*i+(this.cols-j-1.0));
              this.index_buffer.push(this.cols*(i+1.0)+(this.cols-j-1.0));
            }
          };
        };
    }


    // Esta funci�n crea e incializa los buffers dentro del pipeline para luego
    // utlizarlos a la hora de renderizar.
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
        gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }
}
