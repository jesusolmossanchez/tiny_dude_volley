

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, x, y, gravedad, impulso, posicion, cpu) {

    this.x                 = x;
    this.y                 = y;
    this.alto_              = 110;
    this.ancho_             = 80;
    this.dx                = 0;
    this.dy                = 0;
    //TODO: quitar los was...
    this.wasleft           = false;
    this.wasright          = false;
    this.gravity_           = gravedad;
    this.maxdx_             = 150;
    this.maxdy_             = 600;
    this.impulse_           = impulso;
    this.accel_             = this.maxdx_ / (juego.ACCEL_);
    this.friction_          = this.maxdx_ / (juego.FRICTION_);
    this.tiempo_enfadado_   = juego.timestamp_();
    this.tiempo_gorrino_    = juego.timestamp_();
    this.no_rebota_time_    = juego.timestamp_();
    //TODO: hacer que empiece donde se le dice
    this.start             = { x: this.x, y: this.y };
    this.velocidad_gorrino_ = 450;
    this.CPU_ = cpu;    

    if(posicion == 1){
        this.limite_derecha_    = juego.ancho_total_/2;
        this.limite_izquierda_  = 0; 
    }
    else{
        this.limite_derecha_    = juego.ancho_total_;
        this.limite_izquierda_  = juego.ancho_total_/2 + juego.net_.width;   
    } 

    this.update = function(dt) {
        //Control de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        this.wasleft    = this.dx  < 0;
        this.wasright   = this.dx  > 0;
      
        //reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity_;

        //movimientos
        if(!juego.hay_punto_){
            if (this.left){
                this.ddx = this.ddx - this.accel_;
            }
            else if (this.wasleft){
                this.ddx = this.ddx + this.friction_;
            }
          
            if (this.right){
                this.ddx = this.ddx + this.accel_;
            }
            else if (this.wasright){
                this.ddx = this.ddx - this.friction_;
            }

            //Salto
            if (this.jump && !this.jumping){
                if(this.tiempo_gorrino_ < juego.timestamp_() - 50 || this.CPU_) {
                    this.ddy = this.ddy - this.impulse_; // an instant big force impulse
                    this.jumping = true;
                }
            }

        

            //Si se pulsa acción
            if(this.accion){
                if (this.jumping && juego.timestamp_() > this.tiempo_enfadado_ + 300){
                    this.tiempo_enfadado_ = juego.timestamp_()+400;
                }
                if(!this.jumping && juego.timestamp_() > this.tiempo_gorrino_ + 300){
                    this.tiempo_gorrino_ = juego.timestamp_()+400;
                }
            }
        }

        //Posiciones
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        //velocidades
        this.dx = juego.bound_(this.dx + (dt * this.ddx), -this.maxdx_, this.maxdx_);
        this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);

        //Cambiando la velocidad con el level, andando
        var multiplica = -1;
        if(this.CPU_){
            if(this.dx > 0){
                multiplica = 1;
            }
            this.dx = this.dx - (10 - juego.level_) * 7 * multiplica;
        }

        if(!this.jumping && this.tiempo_gorrino_ > juego.timestamp_()){
            if(!this.haciendo_gorrino){
                if(this.left){
                    this.dx = -this.velocidad_gorrino_;
                    this.haciendo_gorrino = true;
                    this.gorrino_left = true;
                    window.croqueta_audio.play();
                }
                if(this.right){
                    this.dx = this.velocidad_gorrino_;
                    this.haciendo_gorrino = true;
                    this.gorrino_left = false;
                    window.croqueta_audio.play();
                }
            }
            else if(this.tiempo_gorrino_ > juego.timestamp_() + 150){
                if(this.gorrino_left){
                    this.dx = -this.velocidad_gorrino_;
                }
                else{
                    this.dx = this.velocidad_gorrino_;
                }

            }

            //Cambiando la velocidad con el level, gorrino
            if(this.CPU_){
                this.dx = this.dx - (10 - juego.level_) * 25 * multiplica;
            }

        }

        if(this.tiempo_gorrino_ < juego.timestamp_()){
            this.haciendo_gorrino = false;
        }
      
        
        if ((this.wasleft  && (this.dx > 0)) ||
            (this.wasright && (this.dx < 0))) {
          this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }


        //SI va pabajo
        if (this.dy >= 0) {
            if(this.y + this.alto_ > juego.alto_total_){
                this.y = juego.alto_total_ - this.alto_;
                this.dy = 0;
                this.jumping = false;
            }
        }
        //Si va parriba
        /* Lo comento, porque nunca debería tocar el techo, no? ... lo dejo por si hago algo al saltar
        else if (this.dy < 0) {
            
        }
        */
        
        //Si va a la derecha
        if (this.dx > 0) {

            //Choco con la red
            if(this.haciendo_gorrino){
                if(this.x + this.alto_ + this.ancho_/2 >= this.limite_derecha_){
                    this.x = this.limite_derecha_ - this.alto_ - this.ancho_/2;
                    this.dx = 0;

                } 
            }
            else if(this.x + this.ancho_ >= this.limite_derecha_){
                this.x = this.limite_derecha_ - this.ancho_;
                this.dx = 0;
            }
        }
        //Si va a la izquierda
        else if (this.dx < 0) {

            //Choco con la pared
            if(this.haciendo_gorrino){
                if(this.x - this.alto_ + this.ancho_/2 <= this.limite_izquierda_){
                    this.x = this.limite_izquierda_ + this.alto_ - this.ancho_/2;
                    this.dx = 0;
                } 

            }
            else if(this.x <= this.limite_izquierda_){
                this.x = this.limite_izquierda_;
                this.dx = 0;
            }
        }
    };

    this.pinta_player_ = function(gorrino, dt, ball, ctx, counter) {

        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);
        var ancho_player = this.ancho_;
        var alto_player = this.alto_;


        var alto_pies = 12;
        var ancho_pies = 16;

        var ojo_size = 16;

        var boca_largo = ancho_player/3;
        var boca_ancho = 4;
        
        var diff_player_ball = (x_player + ancho_player/2) - (ball.x - ball.ancho_/2);
        
        if(!gorrino){

            //cuerpo
            ctx.fillRect(x_player, y_player, ancho_player, alto_player - alto_pies);


            //pies
            var posicion_pie1 = 15;
            var posicion_pie2 = 50;
            if(this.tween_frames_(counter, 40) < 0.5 && (this.left || this.right)){
                posicion_pie2 = 55;
            }
            if(this.tween_frames_(counter, 50) < 0.5 && (this.left || this.right)){
                posicion_pie1 = 20;
            }

            var posicion_alto_pies = alto_pies - 1;
            if(this.jumping){
                posicion_pie1 = 20;
                posicion_pie2 = 40;
                posicion_alto_pies = alto_pies/2;
            }

            ctx.fillRect(x_player + posicion_pie1, y_player + alto_player - alto_pies - 1, ancho_pies, alto_pies);
            ctx.fillRect(x_player + posicion_pie2, y_player + alto_player - alto_pies - 1, ancho_pies, alto_pies);

            //ojos
            ctx.fillStyle = "#ffffff";
            var posicion_ojo1 = x_player + ancho_player/4 - diff_player_ball/15;
            posicion_ojo1 = juego.bound_(posicion_ojo1, x_player - 5, x_player + ancho_player/4);

            var posicion_ojo2 = x_player + ancho_player - ancho_player/8 - diff_player_ball/15;
            posicion_ojo2 = juego.bound_(posicion_ojo2, x_player + ancho_player/2, x_player + ancho_player - ancho_player/8);

            var ojos_jumping = 0;
            if(this.jumping){
                ojos_jumping = 5;

            }
            ctx.fillRect(posicion_ojo1, y_player + ancho_player/15 - ojos_jumping, ojo_size, ojo_size);
            ctx.fillRect(posicion_ojo2, y_player + ancho_player/18 - ojos_jumping, ojo_size, ojo_size);

            //boca
            ctx.fillStyle = "#ba001f";
            var posicion_boca = x_player + ancho_player/2 - diff_player_ball/25;
            posicion_boca = juego.bound_(posicion_boca, x_player + ancho_player/8, x_player + ancho_player/2 );

            if(this.jumping){
                boca_ancho = 12;
            }

            ctx.fillRect(posicion_boca, y_player + alto_player/4, boca_largo, boca_ancho);




        }
        else{
            var izq_gorrino = 1;
            var pies_izq = alto_pies;
            var ojos_izq = 0;
            if(this.gorrino_left){
                izq_gorrino = -1;
                pies_izq = 0;
                ojos_izq = ojo_size;
                
            }

            //cuerpo
            ctx.fillRect(x_player + this.ancho_/2, y_player + this.ancho_/4, izq_gorrino * this.alto_, this.ancho_);

            //pies
            ctx.fillRect(x_player + this.ancho_/2 - pies_izq, y_player + this.ancho_/2, alto_pies, ancho_pies);
            ctx.fillRect(x_player + this.ancho_/2 - pies_izq, y_player + this.ancho_/2 + 30, alto_pies, ancho_pies);


            //ojos
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x_player + this.ancho_/2 + izq_gorrino * (alto_player - ancho_player/8) - ojos_izq, y_player + this.ancho_/2 - 10, ojo_size, ojo_size);
            ctx.fillRect(x_player + this.ancho_/2 + izq_gorrino * (alto_player - ancho_player/8) - ojos_izq, y_player + this.ancho_/2 + 20, ojo_size, ojo_size);


            //boca
            ctx.fillStyle = "#6e0808";
            boca_ancho = 12;

            ctx.fillRect(x_player + ancho_player/2 + izq_gorrino * (alto_player - ancho_player/2.5), y_player + alto_player/2.5, boca_ancho, boca_largo);

            
        }
    



    };

    //TODO: igual lo suyo es usar esto para otras cosas y meterlo en el Game.js
    this.tween_frames_ = function(frame, duration) {
        var half  = duration/2,
            pulse = frame%duration;
        return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
    };

};
