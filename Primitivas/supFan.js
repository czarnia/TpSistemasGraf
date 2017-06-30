function SupFan(){

  this.position_buffer = [];
  this.webgl_position_buffer = null;

  this.index_buffer = [];
  this.webgl_index_buffer = null;

  this.color_buffer = [];
  this.webgl_color_buffer = null;

  this.texture_buffer = null;
  this.webgl_texture_buffer = null;

  this.normal_buffer = [];
  this.webgl_normal_buffer = null;

  this.create = function(perfil, color){
    this.position_buffer.push(0);
    this.position_buffer.push(0);
    this.position_buffer.push(0);

    this.normal_buffer.push(perfil.normales[0][0]);
    this.normal_buffer.push(perfil.normales[0][1]);
    this.normal_buffer.push(perfil.normales[0][2]);

    this.color_buffer.push(color[0]);
    this.color_buffer.push(color[1]);
    this.color_buffer.push(color[2]);

    for (var i = 0; i < perfil.forma.length; i++){
      this.position_buffer.push(perfil.forma[i][0]);
      this.position_buffer.push(perfil.forma[i][1]);
      this.position_buffer.push(perfil.forma[i][2]);

      if(perfil.normales){
        this.normal_buffer.push(perfil.normales[i][0]);
        this.normal_buffer.push(perfil.normales[i][1]);
        this.normal_buffer.push(perfil.normales[i][2]);
      }

      this.index_buffer.push(i);

      this.color_buffer.push(color[0]);
      this.color_buffer.push(color[1]);
      this.color_buffer.push(color[2]);
    }

    this.index_buffer.push(perfil.forma.length);
  }

  this.setupWebGLBuffers = function(){
      this.webgl_position_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

      this.webgl_color_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);

      this.webgl_index_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);

      if(this.texture_buffer != null){
        this.webgl_texture_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_buffer), gl.STATIC_DRAW);

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
      }else{
        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
      }
  }

  this.draw = function(mvMatrix_total){
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

      if(this.normal_buffer.length > 0){
        gl.uniform1i(shaderProgramTexturedObject.useLightingUniform, true);
      }else{
        gl.uniform1i(shaderProgramTexturedObject.useLightingUniform, false);
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
    gl.drawElements(gl.TRIANGLE_FAN, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    gl.useProgram(glProgram);
  }

  this.asign_text_buffer = function(buffer){
    this.texture_buffer = buffer;
  }

  this.initTexture = function(texture){
    this.texture = texture;
  }

  this.addNormalMap = function(texture){
    this.normal_map = texture;
  }
}
