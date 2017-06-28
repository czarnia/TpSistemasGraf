function Cuadrado(){
  this.z = null;
  this.x = null;
  this.y = null;
  this.y_total = null;

  this.textures = null;

  this.index_buffer = null;

  this.position_buffer = null;
  this.color_buffer = null;
  this.texture_buffer = null;
  this.normal_buffer = null;

  this.webgl_position_buffer = null;
  this.webgl_color_buffer = null;
  this.webgl_texture_buffer = null;
  this.webgl_normal_buffer = null;
  this.webgl_index_buffer = null;

  this.traslacion = null;
  this.rotacion = null;
  this.escalado = null;

  this.create = function(x, y, z, color) {
    this.textures = [];

    this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);

    this.escalado = mat4.create();
    mat4.identity(this.escalado);

    this.z = z;
    this.x = x;
    this.y = y;
    this.y_total = y;

    /*this.position_buffer = [ -x/2, y/2, z/2,
                            -x/2, y/2, -z/2,
                            x/2, y/2, z/2,
                            x/2, y/2, -z/2,
                            -x/2, -y/2, z/2,
                            -x/2, -y/2, -z/2,
                            x/2, -y/2, z/2,
                            x/2, -y/2, -z/2];*/
    this.position_buffer = [
            // Front face
            -x/2, -y/2, z/2, //esquina inferior izq
             x/2, -y/2, z/2, //esquina inferior der
             x/2, y/2, z/2, //esquina superior der
            -x/2, y/2, z/2, //esquina superior izq

            // Back face
            -x/2, -y/2, -z/2,
            -x/2,  y/2, -z/2,
             x/2,  y/2, -z/2,
             x/2, -y/2, -z/2,

            // Top face
            -x/2,  y/2, -z/2,
            -x/2,  y/2,  z/2,
             x/2,  y/2,  z/2,
             x/2,  y/2, -z/2,

            // Bottom face
            -x/2, -y/2, -z/2,
             x/2, -y/2, -z/2,
             x/2, -y/2,  z/2,
            -x/2, -y/2,  z/2,

            // Right face
             x/2, -y/2, -z/2,
             x/2,  y/2, -z/2,
             x/2,  y/2,  z/2,
             x/2, -y/2,  z/2,

            // Left face
            -x/2, -y/2, -z/2,
            -x/2, -y/2,  z/2,
            -x/2,  y/2,  z/2,
            -x/2,  y/2, -z/2,
        ];

    // this.index_buffer = [0,1,2,3,7,1,5,0,4,6,5,7,7,6,2,0];
    this.index_buffer = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face
        ];

    this.color_buffer = [];

    for (var i = 0; i < (this.position_buffer.length+1)/3; i++){
      this.color_buffer.push(color[0]);
      this.color_buffer.push(color[1]);
      this.color_buffer.push(color[2]);
    }

    this.texture_buffer = [];

    this.texture_buffer = [
          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,

          // Back face
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
          0.0, 0.0,

          // Top face
          0.0, this.y / this.y_total,
          0.0, 0.0,
          1.0, 0.0,
          1.0, this.y / this.y_total,

          // Bottom face
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
        ];

    this.normal_buffer = [
            // Front face
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,

            // Back face
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,

            // Top face
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,

            // Bottom face
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,

            // Right face
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,

            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0];

  }

  this.actualizar_texture_buffer = function(){
    this.texture_buffer = [
          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,

          // Back face
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
          0.0, 0.0,

          // Top face
          0.0, this.y / this.y_total,
          0.0, 0.0,
          1.0, 0.0,
          1.0, this.y / this.y_total,

          // Bottom face
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, this.y / this.y_total,
          0.0, this.y / this.y_total,
        ];
  }

  this.create_tapa = function(x, y, z, color){
    this.textures = [];

    this.rotacion = mat4.create();
    mat4.identity(this.rotacion);

    this.traslacion = mat4.create();
    mat4.identity(this.traslacion);

    this.escalado = mat4.create();
    mat4.identity(this.escalado);

    this.z = z;
    this.x = x;
    this.y = y;
    this.y_total = y;

    this.position_buffer = [-x/2,  y/2, -z/2,
                            -x/2,  y/2,  z/2,
                             x/2,  y/2,  z/2,
                             x/2,  y/2, -z/2];

    this.index_buffer = [
            0, 1, 2,      0, 2, 3
        ];

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

      if(this.textures.length > 0){
          this.webgl_texture_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_buffer), gl.STATIC_DRAW);

          if(this.normal_buffer){
            this.webgl_normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
          }
      }else{
          // Repetimos los pasos 1. 2. y 3. para la informaci�n del color
          this.webgl_color_buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
      }

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
    this.x = this.x*_x;
    this.y = this.y*_y;
    this.z = this.z*_z;
	}

  this.scale_abs = function(_x, _y, _z){
    var x_esc = _x/this.x;
    var y_esc = _y/this.y;
    var z_esc = _z/this.z;

    this.scale(x_esc, y_esc, z_esc);
  }

  this.draw = function(mvMatrix_scene){
    if(this.textures.length > 0){
          gl.useProgram(shaderProgramEdificio);

          var mvMatrix_cuadrado = mat4.create();
          mat4.identity(mvMatrix_cuadrado);
          mat4.multiply(mvMatrix_cuadrado, this.traslacion, this.rotacion);

          var mvMatrix_total = mat4.create();
          mat4.identity(mvMatrix_total);
          mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_cuadrado);
          mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

          gl.uniformMatrix4fv(shaderProgramEdificio.ModelViewMatrixUniform, false, mvMatrix_total);       

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_buffer);
          gl.vertexAttribPointer(shaderProgramEdificio.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
          gl.uniform1i(shaderProgramEdificio.samplerPB, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
          gl.uniform1i(shaderProgramEdificio.samplerPisos, 1);

          gl.uniform1f(shaderProgramEdificio.Altura, this.y_total);
          gl.uniform1f(shaderProgramEdificio.AlturaPB, 1);
          gl.uniform1f(shaderProgramEdificio.AlturaPisos, (this.y_total - 1) / 2);

          gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
          gl.vertexAttribPointer(shaderProgramEdificio.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

          if(this.normal_buffer){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.vertexAttribPointer(shaderProgramEdificio.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.uniform1i(shaderProgramEdificio.useLightingUniform, true);

            var normalMatrix = mat3.create();
            mat3.fromMat4(normalMatrix, mvMatrix_total);
            mat3.invert(normalMatrix, normalMatrix);
            mat3.transpose(normalMatrix, normalMatrix);
            gl.uniformMatrix3fv(shaderProgramEdificio.nMatrixUniform, false, normalMatrix);
          }else{
            gl.uniform1i(shaderProgramEdificio.useLightingUniform, false);
          }
        }else{
          var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");

          var mvMatrix_cuadrado = mat4.create();
          mat4.identity(mvMatrix_cuadrado);
          mat4.multiply(mvMatrix_cuadrado, this.traslacion, this.rotacion);

          var mvMatrix_total = mat4.create();
          mat4.identity(mvMatrix_total);
          mat4.multiply(mvMatrix_total, mvMatrix_scene, mvMatrix_cuadrado);
          mat4.multiply(mvMatrix_total, mvMatrix_total, this.escalado);

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
    gl.drawElements(gl.TRIANGLES, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);

    gl.useProgram(glProgram);
  }

}
