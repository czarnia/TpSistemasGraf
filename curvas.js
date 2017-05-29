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
    this.valores_u = puntos.length - 3;
    }

    this.length = function(){
        return this.valores_u;
    }

    this.get_punto = function(u){
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var u_local = u - aux;

        if (this.valores_u <= u){
            aux = this.valores_u - 1;
            u_local = 1;
        }

        return this.puntosDeControl[aux] * this.base0(u_local) 
                + this.puntosDeControl[aux + 1] * this.base1(u_local) 
                + this.puntosDeControl[aux + 2] * this.base2(u_local) 
                + this.puntosDeControl[aux + 3] * this.base3(u_local);
        //DUDA: ver si se puede calcular asi
    }

    this.get_tan = function(u){
        //Modifico para que el punto este de 0 a 1
        var aux = Math.floor(u);
        var u_local = u - aux;

        if (this.valores_u <= u){
            aux = this.valores_u - 1;
            u_local = 1;
        }

        return this.puntosDeControl[aux] * this.base0der(u_local) 
                + this.puntosDeControl[aux + 1] * this.base1der(u_local) 
                + this.puntosDeControl[aux + 2] * this.base2der(u_local) 
                + this.puntosDeControl[aux + 3] * this.base3der(u_local);
    }

    this.get_normal = function(u){
        var normal = vec3.create();
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
 