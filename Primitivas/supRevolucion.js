function supRevolucion(){
  this.eje = null;
  this.perfil = null;
  this.angulo = null;
  this.grilla = new VertexGrid();

  this.create = function(eje, perfil, angulo, step, color){

    var muestreo = angulo/step;
		this.grilla.create(step, perfil.length);

		var normal_figura = vec3.fromValues(0,1,0); //y es la normal

		this.eje = eje;
    this.perfil = perfil;
    this.angulo = angulo;

		this.grilla.position_buffer = [];
		this.grilla.color_buffer = [];

		this.grilla.createIndexBuffer();

    for (var i = 0; i < step; i++){
      var angulo_nivel = i * angulo / (step-1);
      var mat_rotacion = mat4.create();
      mat4.identity(mat_rotacion);
      mat4.rotate(mat_rotacion, mat_rotacion, angulo_nivel, eje);

      for (var j = 0; j < perfil.length; j++) {
				var punto = vec3.fromValues(this.perfil[j][0], this.perfil[j][1], this.perfil[j][2]);
				vec3.transformMat4(punto, punto, mat_rotacion);
				this.grilla.position_buffer.push(punto[0]);
				this.grilla.position_buffer.push(punto[1]);
				this.grilla.position_buffer.push(punto[2]);

				this.grilla.color_buffer.push(color[0]);
				this.grilla.color_buffer.push(color[1] * i/step);
				this.grilla.color_buffer.push(color[2] * j/step);
			};
    };
  }

  this.draw = function(mvMatrix_total){
    var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
    gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);
    this.grilla.drawVertexGrid(mvMatrix_total);
  }

  this.setupWebGLBuffers = function(){
    this.grilla.setupWebGLBuffers();
  }

  this.initTexture = function(texture_file){
		this.grilla.initTexture(texture_file);
	}

	this.asign_text_buffer = function(buffer){
		this.grilla.asign_text_buffer(buffer);
	}
}
