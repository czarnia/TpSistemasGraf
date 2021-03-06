
//VertexGrid de ejercicio semanal.
function VertexGrid () {
    this.cols = null;
    this.rows = null;
    this.index_buffer = null;
    this.textures = [];
    this.normal_map = null;

    this.position_buffer = null;
    this.color_buffer = null;
    this.texture_buffer = null;
    this.normal_buffer = [];
    this.tangent_buffer = [];

    this.webgl_position_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_texture_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_index_buffer = null;
    this.webgl_tangent_buffer = null;

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
        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

        if(this.texture_buffer != null){
          this.webgl_texture_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_buffer), gl.STATIC_DRAW);

          this.webgl_normal_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);

          if (this.normal_map != null){
            this.webgl_tangent_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
          }

        }else{
          this.webgl_color_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
        }
        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
    }

    this.drawCalle = function(mvMatrix_total, long_calle, lado_manzana, lado_cruce){
      gl.useProgram(shaderProgramCalle);

      shaderProgramCalle.vertexTangentAttribute = gl.getAttribLocation(shaderProgramCalle, "aVertexTangent");
      gl.enableVertexAttribArray(shaderProgramCalle.vertexTangentAttribute);
      gl.uniform1i(shaderProgramCalle.useNormalMap, true);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
      gl.vertexAttribPointer(shaderProgramCalle.vertexTangentAttribute, 3, gl.FLOAT, false, 0, 0);

      gl.uniformMatrix4fv(shaderProgramCalle.ModelViewMatrixUniform, false, mvMatrix_total);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
      gl.vertexAttribPointer(shaderProgramCalle.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
      gl.uniform1i(shaderProgramCalle.samplerCalle, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
      gl.uniform1i(shaderProgramCalle.samplerCruce, 1);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.normal_map);
      gl.uniform1i(shaderProgramCalle.samplerNormalMap, 2);

      gl.uniform1f(shaderProgramCalle.largo, long_calle);
      gl.uniform1f(shaderProgramCalle.finManzana, lado_manzana - lado_cruce/6);
      gl.uniform1f(shaderProgramCalle.finCruce, lado_cruce /*- 2*lado_cruce/6*/);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
      gl.vertexAttribPointer(shaderProgramCalle.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

      if(this.normal_buffer.length > 0){
        gl.uniform1i(shaderProgramCalle.useLightingUniform, true);
      }else{
        gl.uniform1i(shaderProgramCalle.useLightingUniform, false);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
      gl.vertexAttribPointer(shaderProgramCalle.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

      var normalMatrix = mat3.create();
      mat3.fromMat4(normalMatrix, mvMatrix_total);
      mat3.invert(normalMatrix, normalMatrix);
      mat3.transpose(normalMatrix, normalMatrix);
      gl.uniformMatrix3fv(shaderProgramCalle.nMatrixUniform, false, normalMatrix);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

      // Dibujamos.
      gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
      gl.useProgram(glProgram);
    }

    this.drawVertexGrid = function(mvMatrix_total){
      if(this.normal_map != null){
          gl.useProgram(shaderProgramNormalMap);
          shaderProgramNormalMap.vertexTangentAttribute = gl.getAttribLocation(shaderProgramNormalMap, "aVertexTangent");
          gl.enableVertexAttribArray(shaderProgramNormalMap.vertexTangentAttribute);
          gl.uniform1i(shaderProgramNormalMap.useNormalMap, true);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
          gl.vertexAttribPointer(shaderProgramNormalMap.vertexTangentAttribute, 3, gl.FLOAT, false, 0, 0);
          //gl.disableVertexAttribArray(shaderProgramNormalMap.vertexTangentAttribute);

          gl.uniformMatrix4fv(shaderProgramNormalMap.ModelViewMatrixUniform, false, mvMatrix_total);

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.vertexAttribPointer(shaderProgramNormalMap.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
          gl.uniform1i(shaderProgramNormalMap.samplerUniform, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.normal_map);
          gl.uniform1i(shaderProgramNormalMap.samplerNormalMap, 1);

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          gl.vertexAttribPointer(shaderProgramNormalMap.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

          if(this.normal_buffer.length > 0){
            gl.uniform1i(shaderProgramNormalMap.useLightingUniform, true);
          }else{
            gl.uniform1i(shaderProgramNormalMap.useLightingUniform, false);
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
          gl.vertexAttribPointer(shaderProgramNormalMap.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

          var normalMatrix = mat3.create();
          mat3.fromMat4(normalMatrix, mvMatrix_total);
          mat3.invert(normalMatrix, normalMatrix);
          mat3.transpose(normalMatrix, normalMatrix);
          gl.uniformMatrix3fv(shaderProgramNormalMap.nMatrixUniform, false, normalMatrix);
      }else if(this.texture_buffer != null){
          gl.useProgram(shaderProgramTexturedObject);

          gl.uniformMatrix4fv(shaderProgramTexturedObject.ModelViewMatrixUniform, false, mvMatrix_total);

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.vertexAttribPointer(shaderProgramTexturedObject.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
          gl.uniform1i(shaderProgramTexturedObject.samplerUniform, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          gl.vertexAttribPointer(shaderProgramTexturedObject.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

          if(this.normal_buffer.length > 0){
            gl.uniform1i(shaderProgramTexturedObject.useLightingUniform, true);
          }else{
            gl.uniform1i(shaderProgramTexturedObject.useLightingUniform, false);
          }

          if(this.normal_map){
            gl.uniform1i(shaderProgramTexturedObject.useNormalMap, true);
          }else{
            gl.uniform1i(shaderProgramTexturedObject.useNormalMap, false);
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
          gl.vertexAttribPointer(shaderProgramTexturedObject.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

          var normalMatrix = mat3.create();
          mat3.fromMat4(normalMatrix, mvMatrix_total);
          mat3.invert(normalMatrix, normalMatrix);
          mat3.transpose(normalMatrix, normalMatrix);
          gl.uniformMatrix3fv(shaderProgramTexturedObject.nMatrixUniform, false, normalMatrix);
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

    this.asign_text_buffer = function(buffer){
      this.texture_buffer = buffer;
    }

    this.initTexture = function(texture){
      this.textures.push(texture);
  	}

    this.addNormalMap = function(texture){
      this.normal_map = texture;
  	}
}
