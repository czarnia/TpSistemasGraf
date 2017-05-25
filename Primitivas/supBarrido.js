function supBarrido(){
	this.curvaBase = null;
	this.curvaCamino = null;
	this.grilla = new vertexGrid();

	this.create = function(camino, filas, puntos_forma){
		var cols = puntos_forma.length; //Las columnas tendran los puntos de la forma
										//Las filas la cantidad de repeticiones de la forma
		this.grilla.create(filas, cols);

		var normal_figura = vec3.fromValues(0,1,0); //y es la normal

		this.filas = filas;
		this.curvaCamino = camino;

		this.grilla.position_buffer = [];
		this.grilla.color_buffer = [];

		this.grilla.createIndexBuffer();

		long_base = base.length();
		long_camino = camino.length();

		for (var i = 0; i < this.filas; ++i) {
			var nivel = i * long_camino / this.filas; //Ver si bien el denominador
			//Acomodo normal, tangente y binormal
			//Crear funciones en curva que sean: 
			//posicionar y recibe el nivel
			//tangente q calcula la tangente
			//normal q calcula la normal igual me parece que es siempre 1 en z en este caso
			var punto = this.curvaCamino.get_punto(nivel);
			var tan = this.curvaCamino.get_tan(nivel);
			var normal = this.curvaCamino.get_normal(nivel);
			//La binormal es el producto vectorial entre la normal y la tangente
			//Traslado la curva camino al punto del nivel 
			var mat_traslacion = mat4.create();
			mat4.identity(mat_traslacion);
			mat4.translate(mat_traslacion, mat_traslacion, punto_nivel);

			//La forma debe tener la orientacion de la normal, entonces la roto acorde
			/*var mat_rotacion = mat4.create();
			mat4.identity(mat_rotacion);

			tan.normalize(tan, tan);/
			normal.normalize(normal, normal);
			var angulo = 

			mat4.rotate(mat_rotacion, mat_rotacion, normal, normal);*/
			//Creo una matriz con las normales
			//Recorro cada punto de la figura
			for (var i = 0; i < cols; i += 3) {
				var punto_figura = vec3.fromValues(puntos_forma[i], puntos_forma[i + 1], puntos_forma[i + 2]);
				//Traslado el punto a la posicion del nivel en el camino
				vec3.transformMat4(punto_figura, punto_figura, mat_traslacion);
				this.grilla.position_buffer.push(punto_figura[0]);
				this.grilla.position_buffer.push(punto_figura[1]);
				this.grilla.position_buffer.push(punto_figura[2]);

				//Le meto un color solo para probar
				this.grilla.color_buffer.push(0);
				this.grilla.color_buffer.push(0);
				this.grilla.color_buffer.push(0);
			}

		}
		this.grilla.setupWebGLBuffers();
	}

	this.draw = function(){
		this.grilla.drawVertexGrid();
	}
}