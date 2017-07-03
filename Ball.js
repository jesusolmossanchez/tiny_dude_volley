

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Ball = function(juego, x, y, gravedad, impulso) {

	var   ancho_total = 840,
            alto_total  = 600,
            hay_punto = false;
    this.timestamp = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };
     //Limite entre dos máximos
    this.bound = function (x, min, max) {
        return Math.max(min, Math.min(max, x));
    };
    var alto_red = 220; 
    var net = { "height":alto_red, "width":12, "x":(ancho_total)/2, "y":(alto_total) - alto_red};
 
 	var     GRAVITY  = 800, // default (exagerated) gravity
            ACCEL    = 0.001,     // default take 1/2 second to reach maxdx (horizontal acceleration)
            FRICTION = 0.001,     // default take 1/6 second to stop from maxdx (horizontal friction)
            IMPULSE  = 2400,    // default player jump impulse
            IMPULSO_PELOTA  = 600,    // impulso de la pelota
            FACTOR_REBOTE  = 0.9,    // impulso de la pelota
            F_ALEJA_X  = 2,    // factor que se aleja la pelota en el ejeX
            F_SALTO_COLISION = 1.5, // factor en el que se reduce la velocidadY del jugador al colisionar con la pelota
            COLOR    = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
            COLORS   = [ COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ],
            KEY      = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, Z: 90 };

	this.x                = 96;
    this.y                = 0;
    this.alto             = 50;
    this.ancho            = 50;
    this.center_x         = this.x + this.ancho/2;
    this.center_y         = this.y + this.alto/2;
    this.dx               = 0;
    this.dy               = 0;
    this.gravity          = 900;
    this.maxdx            = 1500;
    this.maxdy            = 1500;
    this.impulse          = 550;
    this.accel            = this.maxdx / (ACCEL);
    this.friction         = this.maxdx / (FRICTION);
    this.ball             = true;
    this.start            = { x: this.x, y: this.y };
    this.theta = 0;

    this.timestamp = function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };


    this.update = function(dt){

    	this.calcula_centro(dt);

    	//reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity;
  
        //Posicion
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        //Velocidad
        //TODO: Revisar velocidad de la pelota
        this.dy = this.bound(this.dy + (dt * this.ddy), -this.maxdy, this.maxdy);
        this.dx = this.dx/1.0004;


        //pelota cayendo...
        if (this.dy > 0) {
            if((this.y + this.alto) > alto_total){
                this.dy = -this.dy * FACTOR_REBOTE;

                //TOCA el suelo, procesa punto
                if(!hay_punto){

                    //punto.play();

                    /* TODO: PROCESAR PUNTO
                    var x_explosion = this.center_x;
                    var y_explosion = this.center_y + this.alto;
                    
                    explosions.push(
                        new explosion(x_explosion, y_explosion, true, true)
                    );

                    tiempo_punto = this.timestamp() + 3000;
                    
                    if(this.center_x < ancho_total/2){
                        if(puntos2 >= 9){
                            game_over();
                        }
                        else{
                            puntos2++;
                            empieza1 = false;
                            
                        }
                    }
                    else{
                        if(puntos1 >= 9){
                            siguiente_level();
                        }
                        else{
                            puntos1++;
                            empieza1 = true;
                        }

                    }
                    */
                }
            }

        }
        //pelota subiendo
        else if (this.dy < 0) {
            if(this.y <= 0){
                this.dy  = - this.dy * FACTOR_REBOTE;
            }
        }
  
        //pelota va a la derecha
        if (this.dx > 0) {
            if((this.center_x + this.ancho/2) > ancho_total){
                this.dx = -this.dx * FACTOR_REBOTE;
            }
        }
        //pelota va a la izquierda
        else if (this.dx < 0) {

            if((this.center_x - this.ancho/2) <= 0){
                this.dx = -this.dx * FACTOR_REBOTE;

            }
        }





        if(hay_punto){
            if(this.dy > 0){
                this.dy = this.dy - 3;
            }
            else{
                this.dy = this.dy + 3;
            }
            this.ddy = this.ddy + 3;
        }

    };

    this.calcula_centro = function (dt) {

        this.center_x = this.x + (this.dx * dt) + this.ancho/2;
        this.center_y = this.y + (this.dy * dt) + this.alto/2;

    };

    this.calcula_rotacion = function (x, y, doble, dt) {

        var mas = 0;
        if(doble){
            mas = Math.PI/4;
        }
        this.theta += this.dx/10000;

        //ROTACION VERTICE
        var tempX = x - this.center_x;
        var tempY = y - this.center_y;

        var rotatedX = tempX*Math.cos(this.theta + mas) - tempY*Math.sin(this.theta + mas);
        var rotatedY = tempX*Math.sin(this.theta + mas) + tempY*Math.cos(this.theta + mas);

        var ret = {};
        ret.x = rotatedX + this.center_x;
        ret.y = rotatedY + this.center_y;
        return ret;

    };
    this.render = function (ctx, dt) {
        if(this.mate){
            ctx.fillStyle   = COLOR.SLATE;
        }
        else{
            ctx.fillStyle   = COLOR.GOLD;
        }

        var v1 = this.calcula_rotacion(this.x + (this.dx * dt), this.y + (this.dy * dt),false, dt);
        var v2 = this.calcula_rotacion(this.x + (this.dx * dt) + this.ancho, this.y + (this.dy * dt),false, dt);
        var v3 = this.calcula_rotacion(this.x + (this.dx * dt) + this.ancho, this.y + (this.dy * dt) + this.alto,false, dt);
        var v4 = this.calcula_rotacion(this.x + (this.dx * dt), this.y + (this.dy * dt) + this.alto,false, dt);

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;
    };

};