function supBarrido(){
	this.curvaBase = null;
	this.curvaCamino = null;
	this.grilla = new VertexGrid();
	this.final = null;
	this.puntos_curva = [];

	this.create = function(camino, niveles, perfil, color){

		var cols = perfil.forma.length; //Las columnas tendran los puntos de la forma
										//Los niveles son la cantidad de repeticiones de la forma
		this.grilla.create(niveles, cols);

		this.curvaCamino = camino;

		this.grilla.position_buffer = [];
		this.grilla.color_buffer = [];
		if(perfil.normales)
			this.grilla.normal_buffer = [];

		this.grilla.createIndexBuffer();

		long_camino = camino.length();

		for (var i = 0; i < niveles; i++) {
			//Calculo el step
			var nivel = i * long_camino / (niveles - 1);
			//Acomodo normal, tangente y binormal
			var punto = this.curvaCamino.get_punto(nivel);
			this.puntos_curva.push(punto);
			var tan = this.curvaCamino.get_tan(nivel);
			var normal = this.curvaCamino.get_normal(nivel);
			//La binormal es el producto vectorial entre la normal y la tangente
			//Traslado la curva camino al punto del nivel
			var mat_traslacion = mat4.create();
			mat4.identity(mat_traslacion);
			mat4.translate(mat_traslacion, mat_traslacion, punto);

			//******PARA QUE COINCIDA CON LA TANGENTE*******
			vec3.normalize(tan, tan);
			vec3.normalize(perfil.normal[0], perfil.normal[0]);
			var angulo = Math.acos(vec3.dot(tan, perfil.normal[0]));

			var eje = vec3.create();
			vec3.cross(eje, tan, perfil.normal[0]);

			//La forma debe tener la orientacion de la normal, entonces la roto acorde
			var mat_rotacion_tan = mat4.create();
			mat4.identity(mat_rotacion_tan);
			mat4.rotate(mat_rotacion_tan, mat_rotacion_tan, angulo, eje);

			//******PARA QUE COINCIDA CON LA NORMAL*******
			normal_mod = vec3.create();
			vec3.transformMat4(normal_mod, perfil.normal[1], mat_rotacion_tan);
			vec3.normalize(normal, normal);
			vec3.normalize(normal_mod, normal_mod);
			var angulo_norm = Math.acos(vec3.dot(normal, normal_mod));

			var eje_norm = vec3.create();
			//Para que gire para el otro lado
			vec3.cross(eje_norm, normal_mod, normal); //VERSION BIEN

			var mat_rotacion_norm = mat4.create();
			mat4.identity(mat_rotacion_norm);
			mat4.rotate(mat_rotacion_norm, mat_rotacion_norm, angulo_norm, eje_norm);

			//Recorro cada punto de la figura
			for (var j = 0; j < perfil.forma.length; j++) {
				var punto_figura = vec3.fromValues(perfil.forma[j][0], perfil.forma[j][1], perfil.forma[j][2]);
				//Roto
				vec3.transformMat4(punto_figura, punto_figura, mat_rotacion_tan);
				//Roto para que coincidan las normales
				vec3.transformMat4(punto_figura, punto_figura, mat_rotacion_norm);
				//Traslado el punto a la posicion del nivel en el camino
				vec3.transformMat4(punto_figura, punto_figura, mat_traslacion);

				this.grilla.position_buffer.push(punto_figura[0]);
				this.grilla.position_buffer.push(punto_figura[1]);
				this.grilla.position_buffer.push(punto_figura[2]);

				if(perfil.normales){
					this.grilla.normal_buffer.push(perfil.normales[j][0]);
					this.grilla.normal_buffer.push(perfil.normales[j][1]);
					this.grilla.normal_buffer.push(perfil.normales[j][2]);
				}

				if(!this.con_textura){
					this.grilla.color_buffer.push(color[0]);
					this.grilla.color_buffer.push(color[1]);
					this.grilla.color_buffer.push(color[2]);
				}
			}
		}
		this.final = punto;
	}

	this.get_comienzo = function(){
		var aux = vec3.fromValues(this.grilla.position_buffer[0], this.grilla.position_buffer[1],
		this.grilla.position_buffer[2]);
		return aux;
	}

	this.scale = function(_x, _y, _z){
		this.grilla.scale(_x, _y, _z);
	}

	this.setupWebGLBuffers = function(){
		this.grilla.setupWebGLBuffers();
	}

	this.draw = function(mvMatrix_total){
		var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
		gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix_total);

		this.grilla.drawVertexGrid(mvMatrix_total);
	}

	this.drawCalle = function(mvMatrix_total, long_calle, lado_manzana, lado_cruce){
		this.grilla.drawCalle(mvMatrix_total, long_calle, lado_manzana, lado_cruce);
	}

	this.initTexture = function(texture_file){
		this.grilla.initTexture(texture_file);
	}

	this.asign_text_buffer = function(buffer){
		this.grilla.asign_text_buffer(buffer);
	}
}
