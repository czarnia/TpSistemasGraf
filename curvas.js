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
function curvaBspline(){
  this.puntosDeControl = null;

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

  this.create = function(puntos, paso) {
    this.puntosDeControl = puntos;
    this.paso = paso;
  }


}
