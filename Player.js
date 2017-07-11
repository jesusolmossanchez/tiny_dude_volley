

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, x, y, gravedad, impulso, posicion, cpu) {

    this.x                 = x;
    this.y                 = y;
    this.alto              = 110;
    this.ancho             = 80;
    this.dx                = 0;
    this.dy                = 0;
    this.wasleft           = false;
    this.wasright          = false;
    this.gravity           = gravedad;
    this.maxdx             = 150;
    this.maxdy             = 600;
    this.impulse           = impulso;
    this.accel             = this.maxdx / (juego.ACCEL);
    this.friction          = this.maxdx / (juego.FRICTION);
    this.player            = true;
    this.tiempo_enfadado   = juego.timestamp();
    this.tiempo_gorrino    = juego.timestamp();
    this.no_rebota_time    = juego.timestamp();
    this.start             = { x: this.x, y: this.y };
    this.velocidad_gorrino = 450;
    this.CPU = cpu;    

    if(posicion == 1){
        this.limite_derecha    = juego.ancho_total/2;
        this.limite_izquierda  = 0; 
    }
    else{
        this.limite_derecha    = juego.ancho_total;
        this.limite_izquierda  = juego.ancho_total/2 + juego.net.width;   
    } 

    this.update = function(dt) {
        //Control de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        this.wasleft    = this.dx  < 0;
        this.wasright   = this.dx  > 0;
      
        //reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity;

        //movimientos
        if(!juego.hay_punto){
            if (this.left){
                this.ddx = this.ddx - this.accel;
            }
            else if (this.wasleft){
                this.ddx = this.ddx + this.friction;
            }
          
            if (this.right){
                this.ddx = this.ddx + this.accel;
            }
            else if (this.wasright){
                this.ddx = this.ddx - this.friction;
            }

            //Salto
            if (this.jump && !this.jumping){
                if(this.tiempo_gorrino < juego.timestamp() - 50 || this.CPU) {
                    this.ddy = this.ddy - this.impulse; // an instant big force impulse
                    this.jumping = true;
                }
            }

        

            //Si se pulsa acción
            if(this.accion){
                if (this.jumping && juego.timestamp() > this.tiempo_enfadado + 300){
                    this.tiempo_enfadado = juego.timestamp()+400;
                }
                if(!this.jumping && juego.timestamp() > this.tiempo_gorrino + 300){
                    this.tiempo_gorrino = juego.timestamp()+400;
                }
            }
        }

        //Posiciones
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        //velocidades
        this.dx = juego.bound(this.dx + (dt * this.ddx), -this.maxdx, this.maxdx);
        this.dy = juego.bound(this.dy + (dt * this.ddy), -this.maxdy, this.maxdy);

        //Cambiando la velocidad con el level, andando
        var multiplica = -1;
        if(this.CPU){
            if(this.dx > 0){
                multiplica = 1;
            }
            this.dx = this.dx - (10 - juego.level) * 7 * multiplica;
        }

        if(!this.jumping && this.tiempo_gorrino > juego.timestamp()){
            if(!this.haciendo_gorrino){
                if(this.left){
                    this.dx = -this.velocidad_gorrino;
                    this.haciendo_gorrino = true;
                    this.gorrino_left = true;
                    window.croqueta_audio.play();
                }
                if(this.right){
                    this.dx = this.velocidad_gorrino;
                    this.haciendo_gorrino = true;
                    this.gorrino_left = false;
                    window.croqueta_audio.play();
                }
            }
            else if(this.tiempo_gorrino > juego.timestamp() + 150){
                if(this.gorrino_left){
                    this.dx = -this.velocidad_gorrino;
                }
                else{
                    this.dx = this.velocidad_gorrino;
                }

            }

            //Cambiando la velocidad con el level, gorrino
            if(this.CPU){
                this.dx = this.dx - (10 - juego.level) * 25 * multiplica;
            }

        }

        if(this.tiempo_gorrino < juego.timestamp()){
            this.haciendo_gorrino = false;
        }
      
        
        if ((this.wasleft  && (this.dx > 0)) ||
            (this.wasright && (this.dx < 0))) {
          this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }


        //SI va pabajo
        if (this.dy >= 0) {
            if(this.y + this.alto > juego.alto_total){
                this.y = juego.alto_total - this.alto;
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
                if(this.x + this.alto + this.ancho/2 >= this.limite_derecha){
                    this.x = this.limite_derecha - this.alto - this.ancho/2;
                    this.dx = 0;

                } 
            }
            else if(this.x + this.ancho >= this.limite_derecha){
                this.x = this.limite_derecha - this.ancho;
                this.dx = 0;
            }
        }
        //Si va a la izquierda
        else if (this.dx < 0) {

            //Choco con la pared
            if(this.haciendo_gorrino){
                if(this.x - this.alto + this.ancho/2 <= this.limite_izquierda){
                    this.x = this.limite_izquierda + this.alto - this.ancho/2;
                    this.dx = 0;
                } 

            }
            else if(this.x <= this.limite_izquierda){
                this.x = this.limite_izquierda;
                this.dx = 0;
            }
        }
    };

    this.pinta_player = function(gorrino, dt, ball, ctx, counter) {

        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);
        var ancho_player = this.ancho;
        var alto_player = this.alto;


        var alto_pies = 12;
        var ancho_pies = 16;

        var ojo_size = 16;

        var boca_largo = ancho_player/3;
        var boca_ancho = 4;
        
        var diff_player_ball = (x_player + ancho_player/2) - (ball.x - ball.ancho/2);
        
        if(!gorrino){

            //cuerpo
            ctx.fillRect(x_player, y_player, ancho_player, alto_player - alto_pies);


            //pies
            var posicion_pie1 = 15;
            var posicion_pie2 = 50;
            if(this.tween_frames(counter, 40) < 0.5 && (this.left || this.right)){
                posicion_pie2 = 55;
            }
            if(this.tween_frames(counter, 50) < 0.5 && (this.left || this.right)){
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
            posicion_ojo1 = juego.bound(posicion_ojo1, x_player - 5, x_player + ancho_player/4);

            var posicion_ojo2 = x_player + ancho_player - ancho_player/8 - diff_player_ball/15;
            posicion_ojo2 = juego.bound(posicion_ojo2, x_player + ancho_player/2, x_player + ancho_player - ancho_player/8);

            var ojos_jumping = 0;
            if(this.jumping){
                ojos_jumping = 5;

            }
            ctx.fillRect(posicion_ojo1, y_player + ancho_player/15 - ojos_jumping, ojo_size, ojo_size);
            ctx.fillRect(posicion_ojo2, y_player + ancho_player/18 - ojos_jumping, ojo_size, ojo_size);

            //boca
            ctx.fillStyle = "#ba001f";
            var posicion_boca = x_player + ancho_player/2 - diff_player_ball/25;
            posicion_boca = juego.bound(posicion_boca, x_player + ancho_player/8, x_player + ancho_player/2 );

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
            ctx.fillRect(x_player + this.ancho/2, y_player + this.ancho/4, izq_gorrino * this.alto, this.ancho);

            //pies
            ctx.fillRect(x_player + this.ancho/2 - pies_izq, y_player + this.ancho/2, alto_pies, ancho_pies);
            ctx.fillRect(x_player + this.ancho/2 - pies_izq, y_player + this.ancho/2 + 30, alto_pies, ancho_pies);


            //ojos
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x_player + this.ancho/2 + izq_gorrino * (alto_player - ancho_player/8) - ojos_izq, y_player + this.ancho/2 - 10, ojo_size, ojo_size);
            ctx.fillRect(x_player + this.ancho/2 + izq_gorrino * (alto_player - ancho_player/8) - ojos_izq, y_player + this.ancho/2 + 20, ojo_size, ojo_size);


            //boca
            ctx.fillStyle = "#6e0808";
            boca_ancho = 12;

            ctx.fillRect(x_player + ancho_player/2 + izq_gorrino * (alto_player - ancho_player/2.5), y_player + alto_player/2.5, boca_ancho, boca_largo);

            
        }
    



    };

    this.tween_frames = function(frame, duration) {
        var half  = duration/2,
            pulse = frame%duration;
        return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
    };

};
