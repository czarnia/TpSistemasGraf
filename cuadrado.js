function Cuadrado(){
  this.z = null;
  this.x = null;
  this.y = null;

  this.index_buffer = null;

  this.position_buffer = null;
  this.color_buffer = null;

  this.webgl_position_buffer = null;
  this.webgl_color_buffer = null;
  this.webgl_index_buffer = null;

  this.traslacion = null;
  this.rotacion = null;
  this.escalado = null;

  this.create = function(x, y, z, color) {
    this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);

    this.escalado = mat4.create();
    mat4.identity(this.escalado);

    this.z = z;
    this.x = x;
    this.y = y;

    this.position_buffer = [ -x/2, y/2, z/2,
                            -x/2, y/2, -z/2,
                            x/2, y/2, z/2,
                            x/2, y/2, -z/2,
                            -x/2, -y/2, z/2,
                            -x/2, -y/2, -z/2,
                            x/2, -y/2, z/2,
                            x/2, -y/2, -z/2];

    this.index_buffer = [0,1,2,3,7,1,5,0,4,6,5,7,7,6,2,0];

    this.color_buffer = [];

    for (var i = 0; i < (this.position_buffer.length+1)/3; i++){
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

  this.scale = function(_x, _y, _z){
		mat4.scale(this.escalado, this.escalado, vec3.fromValues(_x,_y,_z));
	}

  this.draw = function(mvMatrix_scene){
    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

    var mvMatrix_cuadrado = mat4.create();
    mat4.identity(mvMatrix_cuadrado);
    mat4.multiply(mvMatrix_cuadrado, this.traslacion, this.rotacion);

    var mvMatrix_total = mat4.create();
    mat4.identity(mvMatrix_total);
    mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_cuadrado);
    mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

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
    gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);

  }

}
