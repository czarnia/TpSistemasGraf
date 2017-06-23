function SupFan(){

  this.position_buffer = [];
  this.webgl_position_buffer = null;

  this.index_buffer = [];
  this.webgl_index_buffer = null;

  this.color_buffer = [];
  this.webgl_color_buffer = null;

  this.texture_buffer = null;
  this.webgl_texture_buffer = null;

  this.create = function(perfil, color){
    for (var i = 0; i < perfil.length; i++){
      this.position_buffer.push(perfil[i][0]);
      this.position_buffer.push(perfil[i][1]);
      this.position_buffer.push(perfil[i][2]);

      this.index_buffer.push(i);

      this.color_buffer.push(color[0]);
      this.color_buffer.push(color[1]);
      this.color_buffer.push(color[2]);
    }
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
      }else{
        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
      }
  }

  this.draw = function(mvMatrix_total){
    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);

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
    gl.drawElements(gl.TRIANGLE_FAN, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);

  }

  this.asign_text_buffer = function(buffer){
    this.texture_buffer = buffer;
  }

  this.initTexture = function(texture_file){
		var aux_texture = gl.createTexture();
    this.texture = aux_texture;
    this.texture.image = new Image();

    this.texture.image.onload = function () {
      handleLoadedTexture();
    }

    this.texture.image.src = texture_file;
	}
}
