

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Ball = function(juego, x, y, gravedad, impulso) {

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
    this.accel            = this.maxdx / (juego.ACCEL);
    this.friction         = this.maxdx / (juego.FRICTION);
    this.ball             = true;
    this.start            = { x: this.x, y: this.y };
    this.theta = 0;



    this.update = function(dt){

    	//this.calcula_centro(dt);

    	//reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity;
  
        //Posicion
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        //Velocidad
        //TODO: Revisar velocidad de la pelota
        this.dy = juego.bound(this.dy + (dt * this.ddy), -this.maxdy, this.maxdy);
        this.dx = this.dx/1.0004;


        //pelota cayendo...
        if (this.dy > 0) {
            if((this.y + this.alto) > juego.alto_total){
                this.dy = -this.dy * juego.FACTOR_REBOTE;

                //TOCA el suelo, procesa punto
                if(!juego.hay_punto){

                    //punto.play();

                    /* TODO: PROCESAR PUNTO*/
                    var x_explosion = this.center_x;
                    var y_explosion = this.center_y + this.alto;
                    
                    juego.explosions.push(
                        new Explosion(x_explosion, y_explosion, true, true, this)
                    );

                    juego.tiempo_punto = juego.timestamp() + 3000;
                    
                    if(this.center_x < juego.ancho_total/2){
                        if(juego.puntos2 >= 9){
                            juego.game_over();
                        }
                        else{
                            juego.puntos2++;
                            juego.empieza1 = false;
                            
                        }
                    }
                    else{
                        if(juego.puntos1 >= 9){
                            juego.siguiente_level();
                        }
                        else{
                            juego.puntos1++;
                            juego.empieza1 = true;
                        }

                    }
                }
            }

        }
        //pelota subiendo
        else if (this.dy < 0) {
            if(this.y <= 0){
                this.dy  = - this.dy * juego.FACTOR_REBOTE;
            }
        }
  
        //pelota va a la derecha
        if (this.dx > 0) {
            if((this.center_x + this.ancho/2) > juego.ancho_total){
                this.dx = -this.dx * juego.FACTOR_REBOTE;
            }
        }
        //pelota va a la izquierda
        else if (this.dx < 0) {

            if((this.center_x - this.ancho/2) <= 0){
                this.dx = -this.dx * juego.FACTOR_REBOTE;

            }
        }





        if(juego.hay_punto){
	        this.dy = juego.bound(this.dy/1.05, -500, 500);
	        this.dx = juego.bound(this.dx/1.05, -600, 600);
	        //this.ddy = juego.bound(this.ddy/1.05, -100, 100);
        }


    };

    this.calcula_centro = function (dt) {

        this.center_x = this.x + (this.dx * dt) + this.ancho/2;
        this.center_y = this.y + (this.dy * dt) + this.alto/2;

    };

    this.calcula_rotacion = function (x, y, doble, dt) {
    	this.calcula_centro(dt);
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
            ctx.fillStyle   = juego.COLOR.SLATE;
        }
        else{
            ctx.fillStyle   = juego.COLOR.GOLD;
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
