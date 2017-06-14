function supBarrido(){
	this.curvaBase = null;
	this.curvaCamino = null;
	this.grilla = new VertexGrid();
	this.final = null;
	this.puntos_curva = [];

	this.create = function(camino, niveles, puntos_forma, normales_forma, color){
		var cols = puntos_forma.length; //Las columnas tendran los puntos de la forma
										//Los niveles son la cantidad de repeticiones de la forma
		this.grilla.create(niveles, cols);

		this.curvaCamino = camino;

		this.grilla.position_buffer = [];
		this.grilla.color_buffer = [];

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
			vec3.normalize(normales_forma[0], normales_forma[0]);
			var angulo = Math.acos(vec3.dot(tan, normales_forma[0]));

			var eje = vec3.create();
			vec3.cross(eje, tan, normales_forma[0]);

			//La forma debe tener la orientacion de la normal, entonces la roto acorde
			var mat_rotacion_tan = mat4.create();
			mat4.identity(mat_rotacion_tan);
			mat4.rotate(mat_rotacion_tan, mat_rotacion_tan, angulo, eje);

			//******PARA QUE COINCIDA CON LA NORMAL*******
			normal_mod = vec3.create();
			vec3.transformMat4(normal_mod, normales_forma[1], mat_rotacion_tan);
			vec3.normalize(normal, normal);
			vec3.normalize(normal_mod, normal_mod);
			var angulo_norm = Math.acos(vec3.dot(normal, normal_mod));

			var eje_norm = vec3.create();
			//Para que gire para el otro lado
			vec3.cross(eje_norm, normal_mod, normal); //VERSION BIEN
		
			var mat_rotacion_norm = mat4.create();
			mat4.identity(mat_rotacion_norm);
			mat4.rotate(mat_rotacion_norm, mat_rotacion_norm, angulo_norm, eje_norm);

			//Creo una matriz con las normales
			//Recorro cada punto de la figura
			for (var j = 0; j < puntos_forma.length; j++) {
				var punto_figura = vec3.fromValues(puntos_forma[j][0], puntos_forma[j][1], puntos_forma[j][2]);
				//Roto
				vec3.transformMat4(punto_figura, punto_figura, mat_rotacion_tan);
				//Roto para que coincidan las normales
				vec3.transformMat4(punto_figura, punto_figura, mat_rotacion_norm);
				//Traslado el punto a la posicion del nivel en el camino
				vec3.transformMat4(punto_figura, punto_figura, mat_traslacion);

				this.grilla.position_buffer.push(punto_figura[0]);
				this.grilla.position_buffer.push(punto_figura[1]);
				this.grilla.position_buffer.push(punto_figura[2]);

				//Le meto un color solo para probar
				this.grilla.color_buffer.push(color[0]);
				this.grilla.color_buffer.push(color[1]);
				this.grilla.color_buffer.push(color[2]);
			}

		}
		//Ver si salio de scope o se mantiene
		this.final = punto;

		this.grilla.setupWebGLBuffers();
	}

	this.translate = function(mov){
		this.grilla.translate(mov);
		this.setupWebGLBuffers();
	}

	this.rotate = function(p, plano){
		this.grilla.rotate(p, plano);
		this.setupWebGLBuffers();
	}

	this.scale = function(_x, _y, _z){
		this.grilla.scale(_x, _y, _z);
		this.setupWebGLBuffers();
	}

	this.setupWebGLBuffers = function(){
		this.grilla.setupWebGLBuffers();
	}

	this.draw = function(){
		this.grilla.drawVertexGrid();
	}
}
