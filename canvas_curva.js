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
		gl_canvas.clearColor(0.1, 0.1, 0.1, 1.0);
		gl_canvas.enable(gl_canvas.DEPTH_TEST);
		gl_canvas.depthFunc(gl_canvas.LEQUAL);
		gl_canvas.clear(gl_canvas.COLOR_BUFFER_BIT|gl_canvas.DEPTH_BUFFER_BIT);

		gl_canvas.viewport(0, 0, canvas.width, canvas.height);

		//Hacer init shaders para este canvas y lo demas
		initShaders();
		setupBuffers();

		canvas_curva.onmousedown = handleMouseDown;
		document.onmouseup = handleMouseUp;
		document.onmousemove = handleMouseMove;

		setInterval(drawScene, 10);
	}else{
			alert("Error: Your browser does not appear to support WebGL.");
	}
}