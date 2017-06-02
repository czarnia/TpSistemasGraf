function SupFan(){

  this.position_buffer = [];
  this.webgl_position_buffer = null;

  this.index_buffer = [];
  this.webgl_index_buffer = null;

  this.color_buffer = [];
  this.webgl_color_buffer = null;

  this.create = function(perfil){
    for (var i = 0; i < perfil.length; i++){
      this.position_buffer.push(perfil[i][0]);
      this.position_buffer.push(perfil[i][1]);
      this.position_buffer.push(perfil[i][2]);

      this.index_buffer.push(i);

      this.color_buffer.push(0.8);
      this.color_buffer.push(0.1);
      this.color_buffer.push(0.3);
    }
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
      gl.drawElements(gl.TRIANGLE_FAN, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
  }




}
