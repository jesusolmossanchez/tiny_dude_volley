/**************************************************
*** EXPLOSION PLAYER CLASS
**************************************************/
var Explosion = function(x, y, supertiro, punto, ball) {
    this.particles = [];
    this.particulas_por_explosion = 15;
    if(supertiro){
        this.particulas_por_explosion = 15 * 3;
    }

    for (var i = 0; i < this.particulas_por_explosion; i++) {
        this.particles.push(
            new Particle(x, y, supertiro, punto, ball)
        );
    }
};



var Particle = function(x, y, supertiro, punto, ball) {
    
    this.randInt = function(min, max, positive) {

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
    this.particlesMinSpeed      = 3;
    this.particlesMaxSpeed      = 8;
    this.particlesMinSize       = 1;
    this.max_particulas_size       = 8;

    if(supertiro){
        this.max_particulas_size = this.max_particulas_size * 1.5;
    }

    if(punto){
        this.r    = this.randInt(0, 255);
        this.g    = '0';
        this.b    = '0';
    }
    else if(supertiro){
        this.r    = this.randInt(0, 255);
        this.g    = '255';
        this.b    = this.randInt(0, 255);
    }
    else{
        this.r    = '255';
        this.g    = '255';
        this.b    = this.randInt(0, 255);
    }

    this.x    = x;
    this.y    = y;
    this.xv   = this.randInt(this.particlesMinSpeed, this.particlesMaxSpeed, false) + ball.dx/300;
    this.yv   = this.randInt(this.particlesMinSpeed/2, this.particlesMaxSpeed/2, false) + ball.dy/300;
    this.size = this.randInt(this.particlesMinSize, this.max_particulas_size, true);
    
};