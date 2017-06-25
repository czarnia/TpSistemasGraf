	var gl_canvas = null;
	var canvas_curva = null;
	var glProgram_canvas = null;
	var mouseX = null;
	var mouseY = null;
	var puntos_curva = [];
	puntos_curva.push([0.0, 0.0, 0.0]);
	puntos_curva.push([0.0, 0.0, 0.0]);
	puntos_curva.push([0.0, 0.0, 0.0]);
	puntos_curva.push([0.0, 0.0, 0.0]);
	puntos_curva.push([40.0, 20.0, 0.0]);
	// puntos.push([40.0, 0.0, 0.0]);
	// puntos.push([60.0, 0.0, 0.0]);
	puntos_curva.push([60.0, 0.0, 0.0]);
	puntos_curva.push([80.0, 40.0, 0.0]);
	puntos_curva.push([80.0, 40.0, 0.0]);
	puntos_curva.push([80.0, 40.0, 0.0]);
	puntos_curva.push([80.0, 40.0, 0.0]);
	var position_buffer = [];

init_canvas_curva = function(){
	canvas_curva = document.getElementById("second-canvas");
	try{
			gl_canvas = canvas_curva.getContext("webgl") || canvas_curva.getContext("experimental-webgl");
	}catch(e){
		console.log("Error cargando WebGL");
	}

	if(gl_canvas)
	{
		//setUpWebGL
		gl_canvas.clearColor(1.0, 1.0, 1.0, 1.0);
		gl_canvas.enable(gl_canvas.DEPTH_TEST);
		gl_canvas.depthFunc(gl_canvas.LEQUAL);
		gl_canvas.clear(gl_canvas.COLOR_BUFFER_BIT|gl_canvas.DEPTH_BUFFER_BIT);

		gl_canvas.viewport(0, 0, canvas_curva.width, canvas_curva.height);

		//Hacer init shaders para este canvas y lo demas
		var j = 0;
		initShaders_canvas_curva();
		for (var i = 0; i < puntos_curva.length; i++){
			position_buffer[j] = puntos_curva[i][0];
			position_buffer[j + 1] = puntos_curva[i][1];
			position_buffer[j + 2] = puntos_curva[i][2];
			j += 3;
		}

		dibujar_curva();

		canvas_curva.onmousedown = handleMouseDown_curva;
	}else{
			alert("Error: Your browser does not appear to support WebGL.");
	}
}

function initShaders_canvas_curva(){
	// Obtenemos los shaders ya compilados
	var fragmentShader = getShader(gl_canvas, "shader-fs-canvas-curva");
	var vertexShader = getShader(gl_canvas, "shader-canvas-curva");

	// Creamos un programa de shaders de WebGL.
	glProgram_canvas = gl_canvas.createProgram();

	// Asociamos cada shader compilado al programa.
	gl_canvas.attachShader(glProgram_canvas, vertexShader);
	gl_canvas.attachShader(glProgram_canvas, fragmentShader);

	// Linkeamos los shaders para generar el programa ejecutable.
	gl_canvas.linkProgram(glProgram_canvas);

	// Chequeamos y reportamos si hubo alg�n error.
	if (!gl_canvas.getProgramParameter(glProgram_canvas, gl_canvas.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " +
					gl_canvas.getProgramInfoLog(glProgram_canvas));
		return null;
	}

	// Le decimos a WebGL que de aqu� en adelante use el programa generado.
	gl_canvas.useProgram(glProgram_canvas);

	var pMatrix = mat4.create();
	var mvMatrix = mat4.create();

	var u_proj_matrix = gl_canvas.getUniformLocation(glProgram_canvas, "uPMatrix");
	// VER
	var max_x = puntos_curva[puntos_curva.length - 1][0];
	var max_y = puntos_curva[puntos_curva.length - 1][1];
	mat4.ortho(pMatrix, 0.0, max_x, 0.0, max_y, -10, 10);

	gl_canvas.uniformMatrix4fv(u_proj_matrix, false, pMatrix);

	var u_model_view_matrix = gl_canvas.getUniformLocation(glProgram_canvas, "uMVMatrix");
	// Preparamos una matriz de modelo+vista.
	mat4.identity(mvMatrix);
	// mat4.translate(mvMatrix, mvMatrix, [-50.0, -10.5, -100.0]);
	gl_canvas.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);
}

function handleMouseDown_curva(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;

    puntoX = (-canvas_curva.offsetLeft + mouseX) * puntos_curva[puntos_curva.length - 1][0] / canvas_curva.width;
    puntoY = (canvas_curva.offsetTop + canvas_curva.height - mouseY) * puntos_curva[puntos_curva.length - 1][1] / canvas_curva.height;

    puntos_curva.push([puntoX, puntoY, 0.0]);
    puntos_curva.sort(comparador);

    position_buffer.push(puntoX);
    position_buffer.push(puntoY);
    position_buffer.push(0.0);
    dibujar_curva();
}
//VER SI SE PUEDE HACER Q SE MUEVA Y TMB
comparador = function(a, b){
/*	if ((a[0] - b[0]) >= (a[1] - b[1]))
		return (a[0] - b[0]);
	else
		return (a[1] - b[1]);*/
	return (a[0] - b[0]);
}

dibujar_curva = function(){
	gl_canvas.clear(gl_canvas.COLOR_BUFFER_BIT|gl_canvas.DEPTH_BUFFER_BIT);
	draw_puntos();
	var curva = new curvaBspline3();
	curva.create(puntos_curva);
	curva.curva_2D();
	curva.setupWebGLBuffers2D();
	curva.draw();
}

click_regenerar = function(){
	var dist_p = document.getElementById("dist_p").value;
	var num_p = Number(dist_p);
	if(dist_p == "")
		num_p = 20;

	var dist_f = document.getElementById("dist_f").value;
	var num_f = Number(dist_f);
	if(dist_f == "")
		num_f = 10;

	dibujar_curva();

	escena.create_manzanas(6.0, 5.0, 1.0);
	escena.ubicar_autopista(puntos_curva, num_p, num_f);
	escena.create_calles();
	escena.create_mapa();
	escena.create_autos();
	escena.setupWebGLBuffers();

	drawScene();
}

draw_puntos = function(){
	var webgl_position_buffer = gl_canvas.createBuffer();

	gl_canvas.bindBuffer(gl_canvas.ARRAY_BUFFER, webgl_position_buffer);
	gl_canvas.bufferData(gl_canvas.ARRAY_BUFFER, new Float32Array(position_buffer), gl_canvas.STATIC_DRAW);
	webgl_position_buffer.itemSize = 3;
	webgl_position_buffer.numItems = position_buffer.length/3;

	var vertexPositionAttribute = gl_canvas.getAttribLocation(glProgram_canvas, "aVertexPosition");
    gl_canvas.enableVertexAttribArray(vertexPositionAttribute);
	gl_canvas.vertexAttribPointer(vertexPositionAttribute, 3, gl_canvas.FLOAT, false, 0, 0);

	gl_canvas.drawArrays(gl_canvas.POINTS, 0, webgl_position_buffer.numItems);
}
