//Curva de Besier base 3
function curvaBesier(){
    this.puntosDeControl = null;
    this.paso = null;

    //Defino las bases
    this.base0 = function(u) {
      return (1-u)*(1-u)*(1-u);
    }
    this.base1 = function(u) {
      return 3*(1-u)*(1-u)*u;
    }
    this.base2 = function(u) {
      return 3*(1-u)*u*u;
    }
    this.base3 = function(u) {
      return u*u*u;
    }

    //Defino las derivadas de las bases
    this.base0der = function(u) {
      return -3*u*u+6*u-3;
    }
    this.base1der = function(u) {
      return 9*u*u-12*u+3;
    }
    this.base2der = function(u) {
      return -9*u*u+6*u;
    }
    this.base3der = function(u) {
      return 3*u*u;
    }


    this.create = function(puntos, paso) {
      this.puntosDeControl = puntos;
      this.paso = paso;
    }

}


//Curva Bspline base 3
function curvaBspline3(){
  this.puntosDeControl = null;
  this.valores_u = null;
  this.binormal = vec3.fromValues(0.0,0.0,1.0);
  this.grilla = null;

  //Bases
  this.base0 = function(u) {
    return (1-3*u+3*u*u-u*u*u)*1/6;
  }
  this.base1 = function(u) {
    return (4-6*u*u+3*u*u*u)*1/6;
  }
  this.base2 = function(u) {
    return (1+3*u+3*u*u-3*u*u*u)*1/6;
  }
  this.base3 = function(u) {
    return (u*u*u)*1/6;
  }

  //Derivadas de las bases
  this.base0der = function(u) {
    return (-3 +6*u -3*u*u)/6;
  }
  this.base1der = function(u) {
    return (-12*u+9*u*u)/6;
  }
  this.base2der = function(u) {
    return (3+6*u-9*u*u)/6;
  }
  this.base3der = function(u) {
    return (3*u*u)*1/6;
  }

  this.create = function(puntos) {
    this.puntosDeControl = puntos;
    this.paso = paso;
    this.valores_u = puntos.length - 3;
/*    var puntos_curva = [];
    var indice = 0;
    if(tf % paso != 0)
        console.log("El tf debe ser divisible por el paso");*/

    //Conviene devolver el resultado de la funcion en un t que le pasen que devolver todos los puntos

    /*for(var j = 0; j < this.puntosDeControl.length; ++j){
        for(var i = 0; i <= (tf / paso); ++i){
            puntos_curva[indice + i] = this.puntosDeControl[j] * this.base0(to + i * paso) 
                    + this.puntosDeControl[j + 1] * this.base1(to + i * paso) 
                    + this.puntosDeControl[j + 2] * this.base2(to + i * paso) 
                    + this.puntosDeControl[j + 3] * this.base3(to + i * paso);
        }
        indice += i;*/
    }
    //Podria agarrar y devolver los puntos
    //Lo mismo con la tangente, la normal y la binormal de la curva
  

    this.get_punto = function(u){
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var t_local = u - aux;
        //Los puntos de control van a ser los que esten cerca de t creo
        return this.puntosDeControl[aux] * this.base0(t_local) 
                + this.puntosDeControl[aux + 1] * this.base1(t_local) 
                + this.puntosDeControl[aux + 2] * this.base2(t_local) 
                + this.puntosDeControl[aux + 3] * this.base3(t_local);
        //DUDA: ver si se puede calcular asi
    }

    this.get_tan = function(u){
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var t_local = u - aux;
        //Los puntos de control van a ser los que esten cerca de t creo
        return this.puntosDeControl[aux] * this.base0der(t_local) 
                + this.puntosDeControl[aux + 1] * this.base1der(t_local) 
                + this.puntosDeControl[aux + 2] * this.base2der(t_local) 
                + this.puntosDeControl[aux + 3] * this.base3der(t_local);
    }

    this.get_normal = function(u){
        vec3 normal = vec3.create();
        vec3.cross(normal, this.binormal, this.get_tan(u));
        return normal;
    }

    //No muy practico usar grilla para dibujar la curva asi q ver esto
    this.setupWebGLBuffers = function(){
        //Hacemos que la grilla dibuje la curva
        this.grilla = new VertexGrid();
        this.grilla.create(this.valores_u.length, 1);
        this.grilla.createIndexBuffer();
        for (var t = 0; t < this.valores_u.length; t++) {
            var punto = this.get_punto(t);
            this.grilla.position_buffer.push(punto[0]);
            this.grilla.position_buffer.push(punto[1]);
            this.grilla.position_buffer.push(punto[2]);
        }
        this.grilla.setupWebGLBuffers();
    }

    this.draw = function(){
        this.grilla.drawVertexGrid();
    }
}
 