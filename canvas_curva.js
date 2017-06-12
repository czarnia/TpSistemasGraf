	var gl_canvas = null,
			canvas_curva = null,
			glProgram_canvas = null;
	var mouseX = null;
	var mouseY = null;
	puntos_curva = [];

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

		gl_canvas.viewport(0, 0, canvas.width, canvas.height);

		//Hacer init shaders para este canvas y lo demas
		initShaders_canvas_curva();

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
}

function handleMouseDown_curva(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    console.log("Punto x: ", mouseX);
    console.log("Punto y: ", mouseY);

    puntos_curva.push([mouseX, mouseY, 0.0]);
    draw_puntos();
}

dibujar_curva = function(){
	gl_canvas.clear(gl_canvas.COLOR_BUFFER_BIT|gl_canvas.DEPTH_BUFFER_BIT);
	var curva = new curvaBspline3();
	curva.create(puntos_curva);
	curva.curva_2D();
	curva.setupWebGLBuffers();
	curva.draw();
}

click_regenerar = function(){
	dibujar_curva();

	escena.create_manzanas(23.0, 4.0, 5.0, 1.0);
	escena.ubicar_autopista(puntos_curva, 10, 10);
	escena.create_calles();
	escena.create_mapa();

	drawScene();
}

draw_puntos = function(punto){
	var position_buffer = gl_canvas.createBuffer();

	gl_canvas.bindBuffer(gl_canvas.ARRAY_BUFFER, position_buffer);
	gl_canvas.bufferData(gl_canvas.ARRAY_BUFFER, new Float32Array(puntos_curva), gl_canvas.STATIC_DRAW);
	position_buffer.itemSize = 3;
	position_buffer.numItems = puntos_curva.length/3;
	gl_canvas.vertexAttribPointer(glProgram_canvas.aVertexPosition, 3, gl_canvas.FLOAT, false, 0, 0);
		
	gl_canvas.drawArrays(gl_canvas.POINTS, 0, position_buffer.numItems);
}
