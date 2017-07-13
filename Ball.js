

/**************************************************
** GAME BALL CLASS
**************************************************/
var Ball = function(juego, x, y, gravedad, impulso) {

    this.x                = 96;
    this.y                = 0;
    this.alto_             = 50;
    this.ancho_            = 50;
    this.center_x_         = this.x + this.ancho_/2;
    this.center_y_         = this.y + this.alto_/2;
    this.dx               = 0;
    this.dy               = 0;
    this.gravity_          = 900;
    this.maxdx_            = 1500;
    this.maxdy_            = 1500;
    this.impulse_          = 550;
    this.accel_            = this.maxdx_ / (juego.ACCEL_);
    this.friction_         = this.maxdx_ / (juego.FRICTION_);
    this.ball_             = true;
    this.start_            = { x: this.x, y: this.y };
    this.theta_ = 0;



    this.update = function(dt){

        //this.calcula_centro(dt);

        //reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity_;
  
        //Posicion
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        //Velocidad
        //TODO: Revisar velocidad de la pelota
        this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);
        this.dx = this.dx/1.0004;


        //pelota cayendo...
        if (this.dy > 0) {
            if((this.y + this.alto_) > juego.alto_total_){
                this.dy = -this.dy * juego.FACTOR_REBOTE_;

                //TOCA el suelo, procesa punto
                if(!juego.hay_punto_){
     
                    window.punto_audio.play();

                    var x_explosion = this.center_x_;
                    var y_explosion = this.center_y_ + this.alto_;
                    
                    juego.explosions_.push(
                        new Explosion(x_explosion, y_explosion, true, true, this)
                    );

                    juego.tiempo_punto_ = juego.timestamp_() + 4000;
                    
                    if(this.center_x_ < juego.ancho_total_/2){
                        juego.ultimo_rebote = 2;
                        if(juego.puntos2_ >= 9){
                            juego.ganador_ = 2;
                            juego.game_over_(juego.ctx);
                        }
                        else{
                            juego.puntos2_++;
                            juego.empieza1_ = false;
                            
                        }
                    }
                    else{
                        if(juego.puntos1_ >= 9){
                            juego.ganador_ = 1;
                            juego.game_over_(juego.ctx);
                        }
                        if(juego.puntos1_ >= 4 && juego.level_ < 9){
                            juego.siguiente_level_();
                        }
                        else{
                            juego.puntos1_++;
                            juego.empieza1_ = true;
                        }

                    }
                }
            }

        }
        //pelota subiendo
        else if (this.dy < 0) {
            if(this.y <= 0){
                this.dy  = - this.dy * juego.FACTOR_REBOTE_;
            }
        }
  
        //pelota va a la derecha
        if (this.dx > 0) {
            if((this.center_x_ + this.ancho_/2) > juego.ancho_total_){
                this.dx = -this.dx * juego.FACTOR_REBOTE_;
            }
        }
        //pelota va a la izquierda
        else if (this.dx < 0) {

            if((this.center_x_ - this.ancho_/2) <= 0){
                this.dx = -this.dx * juego.FACTOR_REBOTE_;

            }
        }





        if(juego.hay_punto_){
            this.dy = juego.bound_(this.dy/1.05, -500, 500);
            this.dx = juego.bound_(this.dx/1.05, -600, 600);
            //this.ddy = juego.bound_(this.ddy/1.05, -100, 100);
        }


    };

    this.calcula_centro = function (dt) {

        this.center_x_ = this.x + (this.dx * dt) + this.ancho_/2;
        this.center_y_ = this.y + (this.dy * dt) + this.alto_/2;

    };

    this.calcula_rotacion = function (x, y, doble, dt) {
        this.calcula_centro(dt);
        var mas = 0;
        if(doble){
            mas = Math.PI/4;
        }
        this.theta_ += this.dx/10000;

        //ROTACION VERTICE
        var tempX = x - this.center_x_;
        var tempY = y - this.center_y_;

        var rotatedX = tempX*Math.cos(this.theta_ + mas) - tempY*Math.sin(this.theta_ + mas);
        var rotatedY = tempX*Math.sin(this.theta_ + mas) + tempY*Math.cos(this.theta_ + mas);

        var ret = {};
        ret.x = rotatedX + this.center_x_;
        ret.y = rotatedY + this.center_y_;
        return ret;

    };
    this.render = function (ctx, dt) {
        if(this.mate){
            ctx.fillStyle   = juego.COLOR_.SLATE;
        }
        else{
            ctx.fillStyle   = juego.COLOR_.GOLD;
        }

        var v1 = this.calcula_rotacion(this.x + (this.dx * dt), this.y + (this.dy * dt),false, dt);
        var v2 = this.calcula_rotacion(this.x + (this.dx * dt) + this.ancho_, this.y + (this.dy * dt),false, dt);
        var v3 = this.calcula_rotacion(this.x + (this.dx * dt) + this.ancho_, this.y + (this.dy * dt) + this.alto_,false, dt);
        var v4 = this.calcula_rotacion(this.x + (this.dx * dt), this.y + (this.dy * dt) + this.alto_,false, dt);

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
