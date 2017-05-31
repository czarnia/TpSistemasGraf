function supRevolucion(){
  this.eje = null;
  this.perfil = null;
  this.angulo = null;
  this.grilla = new VertexGrid();

  this.create = function(eje, perfil, angulo, step){
    var muestreo = angulo/step;
		this.grilla.create(step, perfil.forma.length);

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

      for (var j = 0; j < perfil.forma.length; j++) {
				var punto = vec3.fromValues(this.perfil.forma[j][0], this.perfil.forma[j][1], this.perfil.forma[j][2]);
				vec3.transformMat4(punto, punto, mat_rotacion);
				this.grilla.position_buffer.push(punto[0]);
				this.grilla.position_buffer.push(punto[1]);
				this.grilla.position_buffer.push(punto[2]);

				this.grilla.color_buffer.push(0.5*(j+1));
				this.grilla.color_buffer.push(0.9*(j-1));
				this.grilla.color_buffer.push(0.2*j);
			};
    };
    this.grilla.setupWebGLBuffers();
  }

  this.draw = function(){
    this.grilla.drawVertexGrid();
  }
}