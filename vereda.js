function Vereda(){
	this.superficie = new supBarrido();
	this.perfil = {
		forma:[],
		normal:[]
	}

  this.camino = function(){
		var camino = new curvaBspline3();
		var puntos_control = [];

    puntos_control.push([0,0,0]);
    puntos_control.push([0,0,0]);
    puntos_control.push([0,0,0]);
    puntos_control.push([0,0,0]);

    puntos_control.push([0,2,0]);
    puntos_control.push([0,2,0]);
    puntos_control.push([0,2,0]);
    puntos_control.push([0,2,0]);

		camino.create(puntos_control);
		return camino;
  }

  this.crear_perfil = function(){

    this.perfil.forma.push([-5/2,0,-5/2]);
    //this.perfil.forma.push([-(5/2)+1,0,-5/2]);
    //this.perfil.forma.push([(5/2)-1,0,-5/2]);
    this.perfil.forma.push([5/2,0,-(5/2)]);
    //this.perfil.forma.push([5/2,0,-(5/2)+1]);
    //this.perfil.forma.push([5/2,0,(5/2)-1]);
    this.perfil.forma.push([5/2,0,5/2]);
    //this.perfil.forma.push([(5/2)-1,0,5/2]);
    //this.perfil.forma.push([-(5/2)+1,0,5/2]);
    this.perfil.forma.push([-(5/2),0,5/2]);
    //this.perfil.forma.push([-(5/2),0,(5/2)-1]);
    //this.perfil.forma.push([-(5/2),0,-(5/2)+1]);

    //repito el primer punto para cerrar la curva

    this.perfil.forma.push([-5/2,0,-5/2]);

    for (var i = 0; i < this.perfil.forma.length+1; i++){
      this.perfil.normal.push([0,1,0]);
    };
  }

	this.create = function(){
    var camino = this.camino();
    this.crear_perfil();
    this.superficie.create(camino, 40, this.perfil.forma, this.perfil.normal);
	}

	this.draw = function(){
		this.superficie.draw();
	}
}
