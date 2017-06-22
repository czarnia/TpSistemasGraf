
//VertexGrid de ejercicio semanal.
function VertexGrid () {
    this.cols = null;
    this.rows = null;
    this.index_buffer = null;
    this.texture = null;

    this.position_buffer = null;
    this.color_buffer = null;
    this.texture_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_texture_buffer = null;
    this.webgl_index_buffer = null;

    this.create = function(_rows, _cols){
      this.cols = _cols;
      this.rows = _rows;
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

    // Esta funci�n inicializa el position_buffer y el color buffer de forma de
    // crear un plano de color gris que se extiende sobre el plano XY, con Z=0
    // El plano se genera centrado en el origen.
    // El prop�sito de esta funci�n es a modo de ejemplo de como inicializar y cargar
    // los buffers de las posiciones y el color para cada v�rtice.
    this.createUniformPlaneGrid = function(){

        this.position_buffer = [];
        this.color_buffer = [];

        for (var i = 0.0; i < this.rows; i++) {
           for (var j = 0.0; j < this.cols; j++) {

               // Para cada v�rtice definimos su posici�n
               // como coordenada (x, y, z=0)
               this.position_buffer.push(i-(this.rows-1.0)/2.0);
               this.position_buffer.push(j-(this.rows-1.0)/2.0);
               this.position_buffer.push(0.0);

               // Para cada v�rtice definimos su color
               this.color_buffer.push(1.0/this.rows * i);
               this.color_buffer.push(0.2);
               this.color_buffer.push(1.0/this.cols * j);

           };
        };
    }

    // ACTIVIDAD 2.
    // Crear alguna otra funci�n similar a la anterior createUniformPlaneGrid()
    // que cree una superficie en donde la altura ya no sea z=0 sino que tenga aluna forma
    // o part�n en particular.

    this.createSinPlaneGrid = function(){

        this.position_buffer = [];
        this.color_buffer = [];

        for (var i = 0.0; i < this.rows; i++) {
           for (var j = 0.0; j < this.cols; j++) {

               // Para cada v�rtice definimos su posici�n
               // como coordenada (x, y, z=0)
               this.position_buffer.push(i-(this.rows-1.0)/2.0);
               this.position_buffer.push(j-(this.rows-1)/2.0);
               this.position_buffer.push((j-(this.rows-1)/2.0)*Math.sin(i-(this.rows-1.0)/2.0));

               // Para cada v�rtice definimos su color
               this.color_buffer.push(1.0/this.rows * i);
               this.color_buffer.push(0.2);
               this.color_buffer.push(1.0/this.cols * j);

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

        if(this.texture_buffer != null){
          this.webgl_texture_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_buffer), gl.STATIC_DRAW);
        }else{
          // Repetimos los pasos 1. 2. y 3. para la informaci�n del color
          this.webgl_color_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
        }

        // Repetimos los pasos 1. 2. y 3. para la informaci�n de los �ndices
        // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
        // Notar tambi�n que se usa un array de enteros en lugar de floats.
        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
    }

    // Esta funci�n es la que se encarga de configurar todo lo necesario
    // para dibujar el VertexGrid.
    // En el caso del ejemplo puede observarse que la �ltima l�nea del m�todo
    // indica dibujar tri�ngulos utilizando los 6 �ndices cargados en el Index_Buffer.
    this.drawVertexGrid = function(mvMatrix_total){
      if(this.texture_buffer != null){
          gl.useProgram(shaderProgramTexturedObject);
          var u_model_view_matrix = gl.getUniformLocation(shaderProgramTexturedObject, "uMVMatrix");
          gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);         
          
          var vertexTextureAttribute = gl.getAttribLocation(shaderProgramTexturedObject, "aTextureCoord");
          gl.enableVertexAttribArray(vertexTextureAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.texture);
          gl.uniform1i(shaderProgramTexturedObject.samplerUniform, 0);

          var vertexPositionAttribute = gl.getAttribLocation(shaderProgramTexturedObject, "aVertexPosition");
          gl.enableVertexAttribArray(vertexPositionAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        }else{
          var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

          gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);
          var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
          gl.enableVertexAttribArray(vertexColorAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
          gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

          var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
          gl.enableVertexAttribArray(vertexPositionAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        }        

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

      // Dibujamos.
      gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);


        gl.useProgram(glProgram);
    }
}
