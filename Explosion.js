/**************************************************
*** EXPLOSION CLASSes
**************************************************/
var Explosion = function(x, y, supertiro, punto, ball) {
    this.particles_ = [];
    this.particulas_por_explosion_ = 15;
    if(supertiro){
        this.particulas_por_explosion_ = 15 * 3;
    }
    if(punto){
        this.particulas_por_explosion_ = 15 * 5;
    }


    for (var i = 0; i < this.particulas_por_explosion_; i++) {
        this.particles_.push(
            new Particle(x, y, supertiro, punto, ball)
        );
    }
};



var Particle = function(x, y, supertiro, punto, ball) {
    
    this.randInt_ = function(min, max, positive) {

        var num;
        if (positive === false) {
            num = Math.floor(Math.random() * max) - min;
            num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
        } else {
            num = Math.floor(Math.random() * max) + min;
        }

        return num;

    };


    //TODO: parametrizar
    this.particlesMinSpeed_      = 3;
    this.particlesMaxSpeed_      = 8;
    this.particlesMinSize_       = 1;
    this.max_particulas_size_       = 8;

    if(supertiro){
        this.max_particulas_size_ = this.max_particulas_size_ * 1.5;
    }

    if(punto){
        this.particlesMinSpeed_      =  this.particlesMinSpeed_ * 1.2;
        this.particlesMaxSpeed_      =  this.particlesMaxSpeed_ * 1.5;
        this.particlesMinSize_       =  this.particlesMinSize_ * 1.2;
        this.max_particulas_size_       =  this.max_particulas_size_ * 1.5;
    }

    if(punto){
        this.r    = this.randInt_(0, 255);
        this.g    = '0';
        this.b    = '0';
    }
    else if(supertiro){
        this.r    = this.randInt_(0, 255);
        this.g    = '255';
        this.b    = this.randInt_(0, 255);
    }
    else if(!ball){
        this.r    = this.randInt_(0, 255);
        this.g    = '0';
        this.b    = '0';
    }
    else{
        this.r    = '255';
        this.g    = '255';
        this.b    = this.randInt_(0, 255);
    }

    this.x    = x;
    this.y    = y;

    var mas_x = 0;
    var mas_y = 0;
    if(ball){
        mas_x =  ball.dx/300;
        mas_y =  ball.dy/300;
    }


    this.xv   = this.randInt_(this.particlesMinSpeed_, this.particlesMaxSpeed_, false) + mas_x;
    this.yv   = this.randInt_(this.particlesMinSpeed_/2, this.particlesMaxSpeed_/2, false) + mas_y;
    this.size = this.randInt_(this.particlesMinSize_, this.max_particulas_size_, true);
    
};
