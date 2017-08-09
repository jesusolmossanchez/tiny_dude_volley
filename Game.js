

/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {


    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------

    this.is_touch_device_ = function() {
        return 'ontouchstart' in document.documentElement;
    };

    this.onkey_ = function(ev, key, down) {
        switch(key) {
            case this.KEY.LEFT:  
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player1_selected_){
                            this.mueve_selec_player_(true, "left");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.left  = down; 
                    }
                    else{
                        player2.left  = down; 
                    }
                }
                return false;
            case this.KEY.RIGHT: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player1_selected_){
                            this.mueve_selec_player_(true, "right");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.right  = down; 
                    }
                    else{
                        player2.right  = down; 
                    } 
                } 
                return false;
            case this.KEY.UP: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(false);
                        }
                        else if(!this.player1_selected_){
                            this.mueve_selec_player_(true, "up");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.jump  = down; 
                    }
                    else{
                        player2.jump  = down; 
                    } 
                }
                return false;
            case this.KEY.DOWN: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(true);
                        }
                        else if(!this.player1_selected_){
                            this.mueve_selec_player_(true, "down");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.down  = down; 
                    }
                    else{
                        player2.down  = down; 
                    }
                }
                return false;
            case this.KEY.ENTER: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.selecciona_menu_();
                        }
                        else{
                            this.selec_player_(true);
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.accion  = down; 
                    }
                    else{
                        player2.accion  = down; 
                    }
                }
                return false;
            case this.KEY.Z: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.selecciona_menu_();
                        }
                        else{
                            this.selec_player_(false);
                        }
                    }
                }
                else{
                    player.accion  = down; 
                }
                return false;
            case this.KEY.R: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(false);
                        }
                        else if(!this.player2_selected_){
                            this.mueve_selec_player_(false, "up");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.jump  = down; 
                    }
                }
                return false;
            case this.KEY.D: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player2_selected_){
                            this.mueve_selec_player_(false, "left");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.left  = down; 
                    }
                }
                return false;
            case this.KEY.F: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(true);
                        }
                        else if(!this.player2_selected_){
                            this.mueve_selec_player_(false, "down");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.down  = down; 
                    }
                }
                return false;
            case this.KEY.G: 
                ev.preventDefault();  
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player2_selected_){
                            this.mueve_selec_player_(false, "right");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.right  = down; 
                    }
                }
                return false;
        }
    };

    this.timestamp_ = function() {
        return new Date().getTime();
    };

    //Limite entre dos máximos
    this.bound_ = function(x, min, max) {
        return Math.max(min, Math.min(max, x));
    };

    //comprueba si algo está dentro de algo
    this.overlap_ = function(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(((x1 + w1 - 1) < x2) ||
                ((x2 + w2 - 1) < x1) ||
                ((y1 + h1 - 1) < y2) ||
                ((y2 + h2 - 1) < y1));
    };

    this.pinta_marcador_ = function(ctx){
        
        marcador_1 = this.numeros_[this.puntos1_];
        marcador_2 = this.numeros_[this.puntos2_];

        this.pinta_filas_columnas_(ctx, 16, 16, marcador_1, this.marcador_size_);
        this.pinta_filas_columnas_(ctx, this.ancho_total_ - 16 - (this.marcador_size_*3), 16, marcador_2, this.marcador_size_);

        
    };

    this.pinta_level_ = function(ctx){
        if(this.modo_ === 2){
            return;
        }
        var level_logo =  [
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  1, 1,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  1, 1,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  1, 1,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  , 1,  , 1,  , 1, 1,  ,  ,  ,  1, 1,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  1, 1, 1, 1]
                    ];

        this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 50, 16, level_logo, this.marcador_size_);
        this.pinta_filas_columnas_(ctx, this.ancho_total_/2 + 50, 16, this.numeros_[this.level_], this.marcador_size_);



        var level_up =  [
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  1,  , 1 ],
                        [ 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  1,  , 1 ],
                        [ 1, 1,  ,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  1,  , 1 ],
                        [ 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  , 1,  , 1,  , 1, 1,  ,  ,  ,  1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,   ,  ,   ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  ,  1,  , 1 ]
                    ];

        if(this.timestamp_() < this.tiempo_level_up_){
            this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 300, 250, level_up, this.marcador_size_ * 4);
        }

        
    };


    this.pinta_filas_columnas_ = function(ctx, x, y, letra, size, color){
        if(!color){
            ctx.fillStyle = "#ffffff";
        }
        else{
            ctx.fillStyle = color;
        }
        var currX = x;
        var currY = y;
        var addX = 0;
        for (var i_y = 0; i_y < letra.length; i_y++) {
            var row = letra[i_y];
            for (var i_x = 0; i_x < row.length; i_x++) {
                if (row[i_x]) {
                    ctx.fillRect(currX + i_x * size, currY, size, size);
                }
            }
            addX = Math.max(addX, row.length * size);
            currY += size;
        }
        currX += size + addX;
    };




    /***UPDATE***/
    this.update_ = function(dt) {
        if(this.is_game_over_){
            return;
        }
        this.procesa_punto_();
        this.calcula_donde_cae_();
        player.update(dt);
        player2.update(dt);
        this.check_ball_collision_net_();
        this.check_ball_collision_players_();
        ball.update(dt);
    };

    this.check_ball_collision_net_ = function() {
        if(this.overlap_(this.net_.x, this.net_.y, this.net_.width, this.net_.height, ball.center_x_ - ball.ancho_/2, ball.center_y_ - ball.alto_/2, ball.ancho_, ball.alto_)){
            //Si la pelota está por encima de la red, rebota parriba
            //if((ball.y + ball.alto_) < this.net_.y && ball.dy > 0){
            if(ball.center_y_ < this.net_.y){
                if(ball.dy > 0){
                    ball.dy = - ball.dy * this.FACTOR_REBOTE_;
                }
            }
            //Sino rebota para el lado
            else{
                if(ball.x > this.ancho_total_/2){
                    ball.x = this.ancho_total_/2 + this.net_.width;
                }
                else{
                    ball.x = this.ancho_total_/2 - ball.ancho_;

                }
                ball.dx = - ball.dx * this.FACTOR_REBOTE_;
            }
        }
    };


    this.check_ball_collision_players_ = function() {


        if(this.hay_punto_){
            return;
        }
        
        var rebota = false;
        var jugador_rebota = false;

        //Si el player1 colisiona con la pelota...
        if(!player.jumping && player.haciendo_gorrino){
            var izq_gorrino = player.alto_/2;
            if(player.gorrino_left){
                izq_gorrino = -1 * player.alto_/2;
            }   
            if ((this.overlap_(player.x + izq_gorrino, player.y + player.ancho_/4, player.alto_, player.ancho_, ball.center_x_ - ball.ancho_/2, ball.center_y_ - ball.alto_/2, ball.ancho_, ball.alto_) &&
                 this.timestamp_() > player.no_rebota_time_)){
                    rebota = true;
                    jugador_rebota = player;
                    this.ultimo_rebote_ = 1;
            }

        }
        else{
            if ((this.overlap_(player.x, player.y, player.ancho_, player.alto_, ball.center_x_ - ball.ancho_/2, ball.center_y_ - ball.alto_/2, ball.ancho_, ball.alto_) &&
                 this.timestamp_() > player.no_rebota_time_)){
                    rebota = true;
                    jugador_rebota = player;
                    this.ultimo_rebote_ = 1;
            }
        }

        

        //Si el player2 colisiona con la pelota...
        if(!player2.jumping && player2.haciendo_gorrino){
            var izq_gorrino2 = player2.alto_/2;
            if(player2.gorrino_left){
                izq_gorrino2 = -1 * player2.alto_/2;
            }   
            if ((this.overlap_(player2.x + izq_gorrino2, player2.y + player2.ancho_/4, player2.alto_, player2.ancho_, ball.center_x_ - ball.ancho_/2, ball.center_y_ - ball.alto_/2, ball.ancho_, ball.alto_) &&
                 this.timestamp_() > player2.no_rebota_time_)){
                    rebota = true;
                    jugador_rebota = player2;
                    this.ultimo_rebote_ = 2;
            }

        }
        else{
            if ((this.overlap_(player2.x, player2.y, player2.ancho_, player2.alto_, ball.center_x_ - ball.ancho_/2, ball.center_y_ - ball.alto_/2, ball.ancho_, ball.alto_) &&
                 this.timestamp_() > player2.no_rebota_time_)){
                    rebota = true;
                    jugador_rebota = player2;
                    this.ultimo_rebote_ = 2;
            }
        }

        if(rebota){

            //TODO: Parametrizar con el tamaño de los tiles
            var velocidad_lateral1 = 800;
            var velocidad_lateral2 = 800;
            var velocidad_lateral3 = 300;
            var velocidad_lateral_mate = 1000;
            
            var velocidad_vertical1 = 700;
            var velocidad_vertical_mate = 1000;
            var velocidad_vertical_arriba = 1000;
            
            var velocidad_vertical_dejada = 100;

            var gravedad_mate1 = 1500;
            var gravedad_mate2 = 1400;
            var gravedad_mate3 = 1400;

            var x_explosion = ball.x + ball.ancho_/2;
            var y_explosion = ball.y + ball.alto_/2;


            //SI ESTÁ EN EL SUELO O NO ESTA ENFADADO
            if(!jugador_rebota.jumping || (jugador_rebota.tiempo_enfadado_ < this.timestamp_())){

                //TODO SONIDOS
                window.golpe_audio.play();


                ball.mate = false;
                //vuelve a la gravedad por defecto
                ball.gravity_ = 900;

                //Velocidad Y de la pelota... es la velocidad que lleve menos el impulso(parriba)
                var ball_dy = ball.dy/6 - this.IMPULSO_PELOTA_;
                if(ball_dy < 0){
                    ball.dy = this.bound_(Math.abs(ball.dy/6 - this.IMPULSO_PELOTA_), this.IMPULSO_PELOTA_/1.3, this.IMPULSO_PELOTA_) * (-1);
                }
                else{
                    ball.dy = this.bound_(ball.dy/6 - this.IMPULSO_PELOTA_, this.IMPULSO_PELOTA_/1.3, this.IMPULSO_PELOTA_) ;
                }

                ball.dy = - this.IMPULSO_PELOTA_;

                //La velocidad X de la pelota es igual a la que lleve +/- la diferencia de posicion que tienen en el eje X por un factor de alejado X
                ball.dx = ball.dx/4 + (ball.x - jugador_rebota.x) * this.F_ALEJA_X_;

                //La velocidad Y del jugador se reduce a la mitad
                jugador_rebota.dy = jugador_rebota.dy/this.F_SALTO_COLISION_;


                this.explosions_.push(
                    new Explosion(x_explosion, y_explosion, false, false, ball)
                );
            }
            //SI ESTÁ EN EL AIRE Y ENFADADO
            else{


                //TODO SONIDOS
                window.golpe_audio2.play();
                ball.mate = true;

                //tiempo rebota para efecto shacke
                //this.tiempo_shacke_ = this.timestamp_() + 200;

                jugador_rebota.no_rebota_time_ = this.timestamp_() + 300;

                if(jugador_rebota === player || this.modo_ === 2){

                    var nega_player = 1;
                    if(jugador_rebota === player2){
                        nega_player = -1;
                    }
                    //pulsado izquierda o derecha solo
                    if (((jugador_rebota.right || jugador_rebota.left) && !jugador_rebota.jump && !jugador_rebota.down) ||
                        this.is_touch_device_())
                    {
                        ball.dy = -Math.abs(ball.dy)*0.3;
                        ball.dy = -300;
                        ball.dx = nega_player * velocidad_lateral1;
                        ball.gravity_ = gravedad_mate1;
                    }
                    // arriba derecha
                    else if(jugador_rebota.right && jugador_rebota.jump && !jugador_rebota.down )
                    {
                        ball.dy = -velocidad_vertical1;
                        ball.dx = velocidad_lateral2;
                        ball.gravity_ = gravedad_mate2;
                    }
                    //arriba izquierda
                    else if(jugador_rebota.left && jugador_rebota.jump && !jugador_rebota.down)
                    {
                        ball.dy = -velocidad_vertical1;
                        ball.dx = -velocidad_lateral2;
                        ball.gravity_ = gravedad_mate2;
                    }
                    // abajo y a un lado
                    else if((jugador_rebota.right || jugador_rebota.left) && !jugador_rebota.jump && jugador_rebota.down){
                        ball.dy = velocidad_vertical_mate;
                        ball.dx = nega_player * velocidad_lateral_mate;
                        ball.gravity_ = gravedad_mate3;
                    }
                    // abajo solo
                    else if(!jugador_rebota.right && !jugador_rebota.left && !jugador_rebota.jump && jugador_rebota.down){
                        ball.dy = velocidad_vertical_mate;
                        ball.dx = nega_player * velocidad_lateral2;
                        ball.gravity_ = gravedad_mate2;
                    }
                    //sin pulsar ningun lado
                    else if(!jugador_rebota.right && !jugador_rebota.left && !jugador_rebota.jump && !jugador_rebota.down){
                        ball.dy = -velocidad_vertical_dejada;
                        ball.dx = nega_player * velocidad_lateral3;
                        ball.gravity_ = gravedad_mate2;
                    }
                    //arriba solo
                    else if(!jugador_rebota.right && !jugador_rebota.left && jugador_rebota.jump && !jugador_rebota.down){
                        ball.dy = -velocidad_vertical_arriba;
                        ball.dx = nega_player * velocidad_lateral3;
                        ball.gravity_ = gravedad_mate2;
                    }

                    switch (jugador_rebota.tipo){
                        case 2:
                            ball.dy = ball.dy * 0.7;
                            ball.dx = ball.dx * 0.5;
                            ball.gravity_ = ball.gravity_ * 0.7;
                            break;
                        case 3:
                            ball.dy = ball.dy * 0.8;
                            ball.dx = ball.dx * 0.8;
                            ball.gravity_ = ball.gravity_ * 0.8;
                            break;
                        case 4:
                            ball.dy = ball.dy * 1.3;
                            ball.dx = ball.dx * 1.3;
                            ball.gravity_ = ball.gravity_ * 1.3;
                            break;
                    }


                }
                else{
                    
                    //TODO: hacer tiro de la maquina aleatorio 

                    var ale = Math.random();
                    if(ale < 0.4){
                        ball.dy = -velocidad_vertical1;
                        ball.dx = -velocidad_lateral1;
                        ball.gravity_ = gravedad_mate2;
                    }
                    else if(ale >= 0.4 && ale < 0.8){
                        ball.dy = -Math.abs(ball.dy)*0.3;
                        ball.dy = -300;
                        ball.dx = -velocidad_lateral1;
                        ball.gravity_ = gravedad_mate1;
                    }
                    else{
                        if(player2.x < (3/4)*this.ancho_total_){
                            if(ale < 0.9){
                                ball.dy = velocidad_vertical_mate;
                                ball.dx = -velocidad_lateral_mate;
                                ball.gravity_ = gravedad_mate3;
                            }
                            else{
                                ball.dy = -velocidad_vertical_arriba;
                                ball.dx = -velocidad_lateral3;
                                ball.gravity_ = gravedad_mate2;
                            }
                        }
                        else{
                            ball.dy = -this.IMPULSO_PELOTA_;
                            ball.dx = ball.dx/4 + (ball.x - jugador_rebota.x) * this.F_ALEJA_X_;
                            jugador_rebota.dy = jugador_rebota.dy/this.F_SALTO_COLISION_;
                        }
                    }

                    //FACTOR DE FUERZA PARA NIVELES
                    var level_factor_x = 0.5 + this.level_/9;
                    var level_factor_y = 0.5 + this.level_/9;
                    ball.dx = ball.dx * level_factor_x;
                    if(ball.dy < -600 || ball.dy > 600){
                        ball.dy = ball.dy * level_factor_y;
                    }
                    else{
                        ball.dy = ball.dy / level_factor_y;
                    }
                    ball.gravity_ = ball.gravity_ * level_factor_y;
                    
                }

                //La velocidad Y del jugador se reduce a la mitad
                jugador_rebota.dy = jugador_rebota.dy/this.F_SALTO_COLISION_;

                this.explosions_.push(
                    new Explosion(x_explosion, y_explosion, true, false, ball)
                );
            }

            if(jugador_rebota === player2 && jugador_rebota.jumping){
                player2.tiempo_enfadado_ = this.timestamp_();
            }
        }


    };

    this.procesa_punto_ = function(){
        
        if(this.tiempo_punto_ > this.timestamp_()){
            this.hay_punto_ = true;
        }
        else{
            if(this.hay_punto_){
                this.empieza_(this.empieza1_);
            }
            this.hay_punto_ = false;
        }

    };



    this.empieza_ = function(empieza1){
        
        //TODO: parametrizar donde empiezan los jugadores

        player.x = 96;
        player.y = this.alto_total_ - player2.alto_ - 50;
        
        player2.x = this.ancho_total_ - 96 - player2.ancho_;
        player2.y = this.alto_total_ - player2.alto_ - 50;

        if(empieza1){
            ball.x = 112;
        }
        else{
            ball.x = this.ancho_total_ - 112 - ball.ancho_;
        }
        ball.y = 20;
        ball.dx = 0;
        ball.dy = 0;
        ball.center_x_         = ball.x + ball.ancho_/2;
        ball.center_y_         = ball.y + ball.alto_/2;

        this.hay_punto_ = false;
    };

    //TODO: ver donde pongo esta funcion y que hago con estas variables sueltas
    var dondecae = 0;
    var movia_left = false;
    this.calcula_donde_cae_ = function(){

        if(this.hay_punto_ || this.modo_ === 2){
            return;
        }


        var x = ball.center_x_;
        //donde está la pelota en altura
        var H_b = this.alto_total_ - ball.y + ball.alto_/2;
        var H_p = this.alto_total_ - ball.y + (ball.alto_/2) - (this.alto_total_ - player2.y);
        //var H = this.alto_total_ - ball.y;
        var Vx = ball.dx;
        var Vy = ball.dy;

        //calcula donde cae
     
        if (Vy<=10){
            Vy = Vy*(-1);
            //Donde cae en relación a donde estoy
            dondecae = x + (Vx)/ball.ddy * Math.sqrt((2*ball.ddy*H_p)+(Vx));
            if (dondecae>this.ancho_total_){
                dondecae = this.ancho_total_ - (dondecae-this.ancho_total_);
            }
            else if(dondecae<0){
                dondecae = - dondecae;
            }
        }else{
            //solo calculo donde cae si se mueve abajo(la pelota)
        }

        var player2_x = player2.x + (player2.ancho_ / 2);
        var player2_y = player2.y + (player2.alto_ / 2);


        var ball_y = ball.y + ball.alto_/2;


        //TODO: REVISAR FACTOR DE TONTUNA--NIVEL
        //var factor_tontuna = Math.floor((10 - this.level_)/4.5) + 1;
        var factor_tontuna = this.level_ + 1;



        //si cae en mi campo
        if(player2.haciendo_gorrino){
            //nada
        }
        else if( ( (dondecae > (this.ancho_total_/2 - 50)) || (dondecae > (this.ancho_total_/2 - 350) && Vy < (-100)) )  &&
                (this.ultimo_rebote_ === 2 || this.counter % factor_tontuna !== 0)){
               
            //si cae a mi izquierda, me muevo pallá
            //TODO: revisar el valor a la derecha 'factor_derecha'
            var factor_derecha = 20;
            if(dondecae < (player2_x - factor_derecha) && player2_x > this.ancho_total_/2){
                player2.left = true;
                player2.right = false;
            }
            //si cae a mi derecha, me muevo palla
            else{
                player2.right = true;
                player2.left = false;
            }

        }
        else{
            player2.tiempo_enfadado_ = this.timestamp_();
            var movimientos_aleatorios = this.counter % 50;
            
            if (movimientos_aleatorios > 48){
                ale = Math.random();

                if (ale>0.5 && player2_x > this.ancho_total_/2){
                    player2.left = true;
                    player2.right = false;
                    movia_left = true;
                }
                else if(ale <0.5){
                    player2.right = true;
                    player2.left = false;
                    movia_left = false;
                }

            }
            else{
                if(movia_left){
                    player2.left = true;
                    player2.right = false;
                }
                else{
                    player2.right = true;
                    player2.left = false;

                }
            }
            
        }



        if(Math.abs(dondecae - player2_x) < 110 && 
            x>this.ancho_total_/2 && 
            (player2_y > this.alto_total_-200) && 
            (Vx<100 && Vx>-100) && 
            (ball_y < this.alto_total_ - 300) &&
            player2.tiempo_enfadado_ < this.timestamp_() &&
            this.counter % factor_tontuna !== 0){

            player2.jump = true;

            player2.tiempo_enfadado_ = this.timestamp_()+700;

        }
        else{
            player2.jump = false;
        }

        var limite_gorrino_x = 100;
        var limite_gorrino_y = this.alto_total_/3;
        if(!player2.jumping && H_b < limite_gorrino_y){
            if(dondecae < player2_x && player2_x > this.ancho_total_/2){
                if(player2_x - dondecae > limite_gorrino_x && 
                    x > (this.ancho_total_/2 - 50) && 
                    !player2.haciendo_gorrino &&
                    this.counter % factor_tontuna !== 0){

                    player2.tiempo_gorrino_ = this.timestamp_()+400;
                    player2.gorrino_left = true;
                }

            }
            else{
                if(dondecae - player2_x > limite_gorrino_x && 
                    x > this.ancho_total_/2 && 
                    !player2.haciendo_gorrino &&
                    this.counter % factor_tontuna !== 0){
                    
                    player2.tiempo_gorrino_ = this.timestamp_()+400;
                    player2.gorrino_left = false;
                }

            }
        }

    };

    this.game_over_ = function(ctx) {
        //TODO: Hacer algo más guay si ganas
        var game_over;
        if(this.ganador_ === "1_cpu"){
            game_over =  [
                            [ 1, 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ],
                            [  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ]
                        ];
        }
        else if(this.ganador_ === "cpu"){

            game_over =  [
                            [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1],
                            [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  , 1,  , 1,  , 1, 1,  ,  ,  , 1, 1, 1,  ],
                            [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1]
                        ];
        }
        else if(this.ganador_ === "1"){

            game_over =  [
                            [ 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ],
                            [ 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ]
                        ];
        }
        else if(this.ganador_ === "2"){

            game_over =  [
                            [ 1, 1, 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1, 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ],
                            [ 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ]
                        ];
        }


        this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 330, 250, game_over, this.marcador_size_ * 4);
        
        this.is_game_over_ = true;

    };

    this.siguiente_level_ = function() {
        this.level_++;
        if(this.level_ >= 9){
            player2.ancho_ = player2.ancho_*1.2;
            player2.alto_ = player2.alto_*1.2;
        }
        this.tiempo_level_up_ = this.timestamp_() + 4000;
        this.puntos1_ = 0;
        this.puntos2_ = 0;
        
        window.levelup_audio2.play();
    };

    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    this.render = function(ctx, frame, dt) {

        if(this.is_game_over_){
            this.draw_explosion_(ctx);
            return;
        }
        ctx.clearRect(0, 0, this.ancho_total_, this.alto_total_);

        

        this.render_player_(ctx, dt);
        this.render_player2_(ctx, dt);
        
        ball.render(ctx, dt);
        this.render_net_(ctx);
        this.draw_explosion_(ctx);
        this.pinta_marcador_(ctx);
        this.pinta_level_(ctx);

        
    };



    this.dx_shacke = 0;
    this.dy_shacke = 0;

    this.pre_shake_ = function() {
        if(this.tiempo_shacke_ > this.timestamp_()){
            this.ctx.save();
            if(!this.dx_shacke && !this.dy_shacke){
                this.dx_shacke = (Math.random() - 0.5) * 20;
                this.dy_shacke = (Math.random() - 0.5) * 20;

            }
            else{
                this.dy_shacke = this.dy_shacke * (-0.9);
                this.dx_shacke = this.dx_shacke * (-0.9);
            }
            
            this.ctx.translate(this.dx_shacke, this.dy_shacke); 
        }
        else{
                this.dx_shacke = 0;
                this.dy_shacke = 0;

        }
    };

    this.post_shake_ = function() {
        this.ctx.restore();
    };

    this.render_net_ = function(ctx) {
        ctx.fillStyle = this.COLOR_.BRICK;
        ctx.fillRect(this.net_.x, this.net_.y, this.net_.width, this.net_.height);
    };

    this.render_player_ = function(ctx, dt) {
        if(player.haciendo_gorrino){
            ctx.fillStyle = this.COLOR_.PINK;
            //TODO: ojo con el this.counter
            player.pinta_player_(true, dt, ball, ctx, this.counter);
            
        }
        else{
            if(player.tiempo_enfadado_ > this.timestamp_()){
                ctx.fillStyle = this.COLOR_.PURPLE;
            }
            else{
                ctx.fillStyle = this.COLOR_.YELLOW;          
            }
            player.pinta_player_(false, dt, ball, ctx, this.counter);
        }
    };

  
    this.render_player2_ = function(ctx, dt) {
        if(player2.haciendo_gorrino){
            ctx.fillStyle = this.COLOR_.PINK;
            var izq_gorrino = 1;
            if(player2.gorrino_left){
                izq_gorrino = -1;
            }
            player2.pinta_player_(true, dt, ball, ctx, this.counter);            
        }
        else{
            if(player2.tiempo_enfadado_ > this.timestamp_()){
                ctx.fillStyle = this.COLOR_.BLACK;
            }
            else{
                //ctx.fillStyle = this.COLOR_.GREY;
                ctx.fillStyle = this.LEVEL_COLORS_[this.level_]; 
            }
            player2.pinta_player_(false, dt, ball, ctx, this.counter);  
        }
    };


    this.draw_explosion_ = function(ctx) {

        if (this.explosions_.length === 0) {
            return;
        }

        for (var i = 0; i < this.explosions_.length; i++) {

            var explosion = this.explosions_[i];
            var particles = explosion.particles_;

            if (particles.length === 0) {
                this.explosions_.splice(i, 1);
                return;
            }

            var particlesAfterRemoval = particles.slice();
            for (var ii = 0; ii < particles.length; ii++) {

                var particle = particles[ii];

                // Check particle size
                // If 0, remove
                if (particle.size <= 0) {
                    particlesAfterRemoval.splice(ii, 1);
                    continue;
                }

                ctx.beginPath();
                //ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
                ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

                ctx.closePath();
                ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
                ctx.fill();

                // Update
                particle.x += particle.xv;
                particle.y += particle.yv;
                particle.size -= 0.1;
            }

            explosion.particles_ = particlesAfterRemoval;

        }
    };




    this.muestra_logo_ = function(ctx) {
        var logo =  [
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1,  , 1,  ,  , 1,  ,  , 1, 1, 1,  ,  , 1,  , 1, 1,  ,  1, 1, 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  ,  1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  ],
                        [  , 1, 1,  ,  , 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  ,  1, 1,  , 1,  , 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  ,  , 1, 1,  ],
                        [  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  ,  1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  ],
                        [  , 1, 1,  ,  , 1, 1,  , 1,  ,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1,  ,  1, 1, 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
                ];

        var size_logo_px = 8;
        var x_logo = this.ancho_total_/2 - (size_logo_px * logo[0].length)/2;

        this.pinta_filas_columnas_(ctx, x_logo, 200, logo, size_logo_px);
        
    };


    this.pinta_cargador_ = function(percent, ctx) {
        var ancho_cargador = 200;
        var alto_cargador = 80;
        ctx.fillRect((this.ancho_total_ - ancho_cargador)/2, this.alto_total_/2 + 50, percent * ancho_cargador, alto_cargador);

        ctx.strokeStyle="#ffffff";
        ctx.lineWidth=10;
        ctx.strokeRect((this.ancho_total_ - ancho_cargador)/2, this.alto_total_/2 + 50, ancho_cargador - 5, alto_cargador);
    };


    this.muestra_menu_ = function(ctx, select_player) {
        //TODO mobile
        if(this.is_touch_device_()){
            this.setup_();
            this.empieza_(true);
            this.empezado_ = true;
            return
        }
        ctx.clearRect(0, 0, this.ancho_total_, this.alto_total_);

        
        //TODO: muestro el menu de 1 player / 2 player
        menu =  [
                    [  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
                    [ 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  ,  ,  ,  ],
                    [  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  ,  ,  ,  ,  ],
                    [  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  ,  ,  ,  ,  ],
                    [ 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [ 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                    [  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ],
                    [ 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1],
                    [ 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  ,  ,  , 1, 1],
                    [ 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1]
            ];

        

        // Cuando está todo seleccionado, cambio el empieza y debería rular
        var size_menu_px = 8;
        var largo_menu = size_menu_px * menu[0].length;
        var largo_menu = size_menu_px * menu[0].length;
        var x_menu = this.ancho_total_/2 - largo_menu/2;
        var y_menu = 200;



        if(select_player){
            fake_ball = new Ball(this);
            var size_caract = 6;

            fake_player = new Player(this, 60, 100, 0, 60000, 1, false, 1);
            fake_player.pinta_player_(false, 0, fake_ball, ctx, this.counter);

            caracteristicas1 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 160, 100, caracteristicas1, size_caract);


            
            fake_player2 = new Player(this, 60, 300, 0, 60000, 1, false, 3);
            fake_player2.pinta_player_(false, 0, fake_ball, ctx, this.counter);

            caracteristicas2 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 160, 300, caracteristicas2, size_caract);

            fake_ball.x = 480;
            
            fake_player3 = new Player(this, 440, 100, 0, 60000, 1, false, 2);
            fake_player3.pinta_player_(false, 0, fake_ball, ctx, this.counter);

            caracteristicas3 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 540, 100, caracteristicas3, size_caract);


            
            fake_player4 = new Player(this, 440, 300, 0, 60000, 1, false, 4);
            fake_player4.pinta_player_(false, 0, fake_ball, ctx, this.counter);

            caracteristicas4 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 540, 300, caracteristicas4, size_caract);


        }
        



        var usa_keys  =  [
                    [  1, 1,  , 1,  ,  1, 1, 1,  , 1,  , 1,  , 1, 1, 1,  ,  ],
                    [  1, 1, 1,  ,  ,  1, 1,  ,  ,  , 1,  ,  , 1,  ,  ,  , 1],
                    [  1, 1,  ,  ,  ,  1, 1, 1,  ,  , 1,  ,  , 1, 1, 1,  ,  ],
                    [  1, 1, 1,  ,  ,  1, 1,  ,  ,  , 1,  ,  ,  ,  , 1,  , 1],
                    [  1, 1,  , 1,  ,  1, 1, 1,  ,  , 1,  ,  , 1, 1, 1,  ,  ], 
            ];

        var flecha_der =  [
                    [  , 1,  ,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  , 1,  ,  ]
            ];
        var flecha_izq =  [
                    [  ,  , 1,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  ,  , 1,  ]
            ];
        var flecha_arr=  [
                    [  ,  , 1,  ,  ],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  ,  , 1,  ,  ]
            ];
        var flecha_abj=  [
                    [  ,  , 1,  ,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [  ,  , 1,  ,  ]
            ];
        var zeta=  [
                    [ 1, 1, 1, 1, ],
                    [  ,  ,  , 1, ],
                    [  ,  , 1,  , ],
                    [  , 1,  ,  , ],
                    [ 1,  ,  ,  , ],
                    [ 1, 1, 1, 1, ]
            ];
        var erre=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  , 1,  , ],
                    [ 1, 1, 1,  , ],
                    [ 1,  , 1,  , ],
                    [ 1,  ,  , 1, ]
            ];
        var de=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1, 1, 1,  , ]
            ];
        var efe=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  ,  , ],
                    [ 1,  ,  ,  , ],
                    [ 1, 1, 1,  , ],
                    [ 1,  ,  ,  , ],
                    [ 1,  ,  ,  , ]
            ];
        var ge=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  ,  , ],
                    [ 1,  ,  ,  , ],
                    [ 1,  , 1, 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1, 1, 1, 1, ]
            ];
        var enter_key=  [
                    [  ,  ,  , 1, ],
                    [  ,  ,  , 1, ],
                    [  , 1,  , 1, ],
                    [ 1, 1, 1, 1, ],
                    [  , 1,  ,  , ]
            ];


        var size_flecha_px = 5;


        this.pinta_filas_columnas_(ctx, 50, this.alto_total_ - 130, usa_keys, 3);
        var y_select = y_menu - (size_menu_px * 4);
        if(this.modo_ == 2){
            y_select = y_select + size_menu_px * 14;


            size_flecha_px = size_flecha_px/1.8;
            this.pinta_filas_columnas_(ctx, 50, this.alto_total_ - 50, de, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 105, this.alto_total_ - 50, ge, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 80, this.alto_total_ - 75, erre, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 80, this.alto_total_ - 50, efe, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 160, this.alto_total_ - 50, zeta, size_flecha_px);


            this.pinta_filas_columnas_(ctx, this.ancho_total_ - 170, this.alto_total_ - 50, flecha_izq, size_flecha_px*1.4);
            this.pinta_filas_columnas_(ctx, this.ancho_total_ - 105, this.alto_total_ - 50, flecha_der, size_flecha_px*1.4);
            this.pinta_filas_columnas_(ctx, this.ancho_total_ - 140, this.alto_total_ - 70, flecha_arr, size_flecha_px*1.4);
            this.pinta_filas_columnas_(ctx, this.ancho_total_ - 140, this.alto_total_ - 45, flecha_abj, size_flecha_px*1.4);
            this.pinta_filas_columnas_(ctx, this.ancho_total_ - 60, this.alto_total_ - 60, enter_key, size_flecha_px*1.5);
        }
        else{

            this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 90, this.alto_total_ - 50, flecha_izq, size_flecha_px);
            this.pinta_filas_columnas_(ctx, this.ancho_total_/2 + 5, this.alto_total_ - 50, flecha_der, size_flecha_px);
            this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 45, this.alto_total_ - 80, flecha_arr, size_flecha_px);
            this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 45, this.alto_total_ - 45, flecha_abj, size_flecha_px);
            this.pinta_filas_columnas_(ctx, this.ancho_total_/2 + 75, this.alto_total_ - 50, zeta, size_flecha_px/1.5);

        }


        if(!select_player){
            ctx.strokeRect(x_menu - (size_menu_px * 4), y_select, largo_menu + (size_menu_px * 8), 12 * size_menu_px);
            this.pinta_filas_columnas_(ctx, x_menu, y_menu, menu, size_menu_px);
        }
        else{





            if(this.modo_ === 2){
                p2 =  [
                            [ 1, 1, 1, 1,  ,  , 1, 1, 1],
                            [ 1, 1,  , 1,  ,  ,  ,  , 1],
                            [ 1, 1, 1, 1,  ,  , 1, 1, 1],
                            [ 1, 1,  ,  ,  ,  , 1,  ,  ],
                            [ 1, 1,  ,  ,  ,  , 1, 1, 1]
                        ];

                var x_p2 = 340;
                var y_p2 = 52;

                var x_selec_player = 40;
                var y_selec_player = 80;
                var ancho_selec_player = 370;
                var alto_selec_player = 140;
                switch(this.player2_tipo_) {
                
                    case 2: 
                        x_selec_player = 420;
                        y_selec_player = 80;
                        x_p2 = 720;
                        y_p2 = 52;
                        break;
                    case 3: 
                        x_selec_player = 40;
                        y_selec_player = 280;
                        x_p2 = 340;
                        y_p2 = 252;

                        break;
                    case 4: 
                        x_selec_player = 420;
                        y_selec_player = 280;
                        x_p2 = 720;
                        y_p2 = 252;

                        break;
                }
                this.pinta_filas_columnas_(ctx, x_p2, y_p2, p2, 4, this.COLOR_.PURPLE);
                ctx.strokeStyle = this.COLOR_.PURPLE;
                ctx.strokeRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
                if(this.player2_selected_){
                    this.ctx.globalAlpha = 0.5;
                    this.ctx.fillStyle = this.COLOR_.YELLOW;
                    this.ctx.fillRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
                    this.ctx.globalAlpha = 1.0;
                }
            }



            p1 =  [
                        [ 1, 1, 1, 1,  ,  ,  , 1, 1],
                        [ 1, 1,  , 1,  ,  , 1, 1, 1],
                        [ 1, 1, 1, 1,  ,  ,  , 1, 1],
                        [ 1, 1,  ,  ,  ,  ,  , 1, 1],
                        [ 1, 1,  ,  ,  ,  ,  , 1, 1]
                    ];

            var x_p1 = 70;
            var y_p1 = 52;

            var x_selec_player = 40;
            var y_selec_player = 80;
            var ancho_selec_player = 370;
            var alto_selec_player = 140;
            switch(this.player1_tipo_) {
            
                case 2: 
                    x_selec_player = 420;
                    y_selec_player = 80;
                    x_p1 = 450;
                    y_p1 = 52;
                    break;
                case 3: 
                    x_selec_player = 40;
                    y_selec_player = 280;
                    x_p1 = 70;
                    y_p1 = 252;

                    break;
                case 4: 
                    x_selec_player = 420;
                    y_selec_player = 280;
                    x_p1 = 450;
                    y_p1 = 252;

                    break;
            }
            this.pinta_filas_columnas_(ctx, x_p1, y_p1, p1, 4, this.COLOR_.YELLOW);
            ctx.strokeStyle = this.COLOR_.YELLOW;
            ctx.strokeRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
            if(this.player1_selected_){
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = this.COLOR_.YELLOW;
                this.ctx.fillRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
                this.ctx.globalAlpha = 1.0;
            }


        }


    };

    this.mueve_menu_ = function (abajo) {

        window.croqueta_audio.play();
        if(abajo){
            this.modo_ = 2;
        }
        else{
            this.modo_ = 1;
        }
        this.muestra_menu_(this.ctx, false);
    }

    this.mueve_selec_player_ = function (player1, dir) {

        window.croqueta_audio.play();

        var player_mover = this.player1_tipo_;
        if(player1){
            switch(dir) {
                case "up":  
                    if(this.player1_tipo_ > 2){
                        this.player1_tipo_ = this.player1_tipo_ - 2;
                    }
                    break;
                case "down":  
                    if(this.player1_tipo_ < 3){
                        this.player1_tipo_ = this.player1_tipo_ + 2;
                    }
                    break;
                case "left":  
                    if(this.player1_tipo_ === 2 || this.player1_tipo_ === 4){
                        this.player1_tipo_ = this.player1_tipo_ - 1;
                    }
                    break;
                case "right":  
                    if(this.player1_tipo_ === 1 || this.player1_tipo_ === 3){
                        this.player1_tipo_ = this.player1_tipo_ + 1;
                    }
                    break;
            }
        }
        else{
            switch(dir) {
                case "up":  
                    if(this.player2_tipo_ > 2){
                        this.player2_tipo_ = this.player2_tipo_ - 2;
                    }
                    break;
                case "down":  
                    if(this.player2_tipo_ < 3){
                        this.player2_tipo_ = this.player2_tipo_ + 2;
                    }
                    break;
                case "left":  
                    if(this.player2_tipo_ === 2 || this.player2_tipo_ === 4){
                        this.player2_tipo_ = this.player2_tipo_ - 1;
                    }
                    break;
                case "right":  
                    if(this.player2_tipo_ === 1 || this.player2_tipo_ === 3){
                        this.player2_tipo_ = this.player2_tipo_ + 1;
                    }
                    break;
            }

        }

        this.muestra_menu_(this.ctx, true);
    }

    this.selecciona_menu_ = function () {
        window.golpe_audio2.play();
        this.muestra_menu_(this.ctx, true);
        this.numero_jugadores_ = this.modo_;

        //this.setup_();
        //this.empieza_(true);
        //this.empezado_ = true;
    }

    this.selec_player_ = function (player1) {

        var x_selec_player = 40;
        var y_selec_player = 80;
        var ancho_selec_player = 370;
        var alto_selec_player = 140;

        var player_pinta = this.player1_tipo_;
        var color = this.COLOR_.YELLOW;
        if(!player1){
            this.player2_selected_ = true;
            player_pinta = this.player2_tipo_;
            color = this.COLOR_.PURPLE;
        }
        else{
            this.player1_selected_ = true;
        }

        switch(player_pinta) {
        
            case 2: 
                x_selec_player = 420;
                y_selec_player = 80;
                break;
            case 3: 
                x_selec_player = 40;
                y_selec_player = 280;

                break;
            case 4: 
                x_selec_player = 420;
                y_selec_player = 280;
                break;
        }

       
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
        this.ctx.globalAlpha = 1.0;

        if(this.modo_ === 1 || this.player1_selected_ && this.player2_selected_){
            this.setup_();
            this.empieza_(true);
            this.empezado_ = true;
            
        }
    }
    


    this.setup_ = function() {

        this.net_ = { "height":this.alto_red_, "width":12, "x":(this.ancho_total_)/2, "y":(this.alto_total_) - this.alto_red_};
        player = new Player(this, 96, 1107, 800, 60000, 1, false, this.player1_tipo_);
        var cpu = true;
        var tipo2 = false;
        if(this.modo_ == 2){
            cpu = false;
            tipo2 = this.player2_tipo_;
        }
        player2 = new Player(this, 1850, 1107, 800, 60000, 2, cpu, tipo2);
        ball = new Ball(this);

    };





    /***** LANZAAAAA ****/
    //muestro el logo

    this.modo_ = 1; // modo=1 -> 1player + modo=2 -> 2 players
    this.level_ = 1;
    this.empezado_ = false;
    this.pausa_ = false;
    this.is_game_over_ = false;
    this.numero_jugadores_ = false;
    this.player1_tipo_ = 1;
    this.player2_tipo_ = 1;
    this.player1_selected_ = false;
    this.player2_selected_ = false;

    this.ultimo_rebote_ = 1;

    this.ancho_total_ = 840,
    this.alto_total_  = 600,
    this.alto_red_ = 220,
  
    this.GRAVITY_  = 800, // default (exagerated) gravity
    this.ACCEL_    = 0.001,     // default take 1/2 second to reach maxdx (horizontal acceleration)
    this.FRICTION_ = 0.001,     // default take 1/6 second to stop from maxdx (horizontal friction)
    this.IMPULSE_  = 2400,    // default player jump impulse
    this.IMPULSO_PELOTA_  = 600,    // impulso de la pelota
    this.FACTOR_REBOTE_  = 0.9,    // impulso de la pelota
    this.F_ALEJA_X_  = 2,    // factor que se aleja la pelota en el ejeX
    this.F_SALTO_COLISION_ = 1.5, // factor en el que se reduce la velocidadY del jugador al colisionar con la pelota
    this.COLOR_    = { BLACK: '#000000', 
                      YELLOW: '#ECD078', 
                      BRICK: '#D95B43', 
                      PINK: '#C02942', 
                      PURPLE: '#542437', 
                      GREY: '#333', 
                      SLATE: '#53777A', 
                      GOLD: 'gold'
                  },
    this.LEVEL_COLORS_ = [],
    this.LEVEL_COLORS_[1] = '#f4a693',
    this.LEVEL_COLORS_[2] = '#e5775c',
    this.LEVEL_COLORS_[3] = '#d03d3d',
    this.LEVEL_COLORS_[4] = '#72210c',
    this.LEVEL_COLORS_[5] = '#3e1212',
    this.LEVEL_COLORS_[6] = '#3e1212',
    this.LEVEL_COLORS_[7] = '#3e1212',
    this.LEVEL_COLORS_[8] = '#3e1212',
    this.LEVEL_COLORS_[9] = '#3e1212',
    this.KEY      = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, Z: 90, R: 82, D: 68, F: 70, G: 71 },
      
    this.fps_            = 60,
    this.step_           = 1/this.fps_,
    this.canvas_         = document.getElementById('canvas'),
    this.ctx            = this.canvas_.getContext('2d'),
    this.canvas_.width  = this.ancho_total_,
    this.canvas_.height = this.alto_total_,
    this.net_            = {},
    this.tiempo_punto_   = this.timestamp_(),
    this.tiempo_level_up_    = this.timestamp_(),
    this.hay_punto_      = false,
    this.puntos1_        = 0,
    this.puntos2_        = 0,

    this.tiempo_shacke_ = this.timestamp_(),

    this.explosions_     = [],


    this.marcador_size_ = 4,

    this.numeros_ = {
                '0': [
                    [1, 1, 1],
                    [1, ,  1],
                    [1, ,  1],
                    [1, ,  1],
                    [1, 1, 1]
                ],
                '1': [
                    [ , , 1],
                    [ , , 1],
                    [ , , 1],
                    [ , , 1],
                    [ , , 1]
                ],
                '2': [
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1],
                    [ 1,  ,  ],
                    [ 1, 1, 1]
                ],
                '3': [
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1]
                ],
                '4': [
                    [ 1,  , 1],
                    [ 1,  , 1],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [  ,  , 1]
                ],
                '5': [
                    [ 1, 1, 1],
                    [ 1,  ,  ],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1]
                ],
                '6': [
                    [ 1, 1, 1],
                    [ 1,  ,  ],
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1]
                ],
                '7': [
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [  ,  , 1],
                    [  ,  , 1],
                    [  ,  , 1]
                ],
                '8': [
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1]
                ],
                '9': [
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1]
                ],
            };



    this.muestra_logo_(this.ctx);




    

     /*******************/
    /*******************/
    /***** MOBILE ******/
    /*******************/
    /*******************/


    this.pinta_cosas_mobile_gira_ = function() {

        document.getElementById('controles_mobile').style.display = "none";
        document.getElementById('canvas_mobile').style.display = "none";
        var ancho_window = window.innerWidth;
        var alto_window = window.innerHeight;


        canvas_mobile_gira   = document.getElementById('canvas_mobile_gira');
        canvas_mobile_gira.style.display = "block";
        ctx_mobile_gira      = canvas_mobile_gira.getContext('2d');
        canvas_mobile_gira.width  = ancho_window;
        canvas_mobile_gira.height = alto_window;


        var gira_mobile=  [
                    [  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
                    [  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ],
                    [  , 1,  ,  ,  ,  ,  ,  , 1,  , 1],
                    [  , 1,  ,  ,  ,  ,  ,  ,  , 1, 1],
                    [ 1, 1, 1,  ,  ,  ,  ,  , 1, 1, 1],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1,  , 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];

        var size_gira_px = 12;
        var x_gira = ancho_window/2 - (size_gira_px * gira_mobile[0].length)/2;
        this.pinta_filas_columnas_(ctx_mobile_gira, x_gira, 200, gira_mobile, size_gira_px);
          
    }
  
    this.pinta_cosas_mobile_ = function() {
        document.getElementById('canvas_mobile_gira').style.display = "none";

        canvas_mobile   = document.getElementById('canvas_mobile');
        ctx_mobile      = canvas_mobile.getContext('2d');
        canvas_mobile.style.display = "block";
        var ancho_window = window.innerWidth
        canvas_mobile.width  = this.ancho_total_;
        canvas_mobile.height = 100;


        var flecha_der =  [
                    [  , 1,  ,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  , 1,  ,  ]
            ];
        var flecha_izq =  [
                    [  ,  , 1,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  ,  , 1,  ]
            ];
        var flecha_arr=  [
                    [  ,  , 1,  ,  ],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [  , 1, 1, 1,  ]
            ];
        var accion_boton=  [
                    [ 1,  , 1,  , 1],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [ 1,  , 1,  , 1]
            ];


        var size_flecha_px = 12;

        this.pinta_filas_columnas_(ctx_mobile, 20, 20, flecha_izq, size_flecha_px);
        this.pinta_filas_columnas_(ctx_mobile, 120, 20, flecha_der, size_flecha_px);
        this.pinta_filas_columnas_(ctx_mobile, ancho_window - 180, 20, flecha_arr, size_flecha_px);
        this.pinta_filas_columnas_(ctx_mobile, ancho_window - 80, 20, accion_boton, size_flecha_px);

        document.getElementById('controles_mobile').style.display = "block";

        document.getElementById('der_mobile').addEventListener('touchstart', function(e){
            player.right = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
            player.left = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchstart', function(e){ 
            player.jump = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchstart', function(e){ 
            player.accion = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });



        document.getElementById('der_mobile').addEventListener('touchend', function(e){
            player.right = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
            player.left = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
            player.jump = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
            player.accion = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });
          
    }


    var canvas_mobile;
    var ctx_mobile;
    var self = this;
    this.controla_orientacion_ = function(){
        if(this.is_touch_device_()){
            if (window.innerHeight > window.innerWidth) {
                self.pinta_cosas_mobile_gira_();
            } else {
                self.pinta_cosas_mobile_();
            }
            window.addEventListener('orientationchange', function (argument) {
                window.setTimeout(function () {
                    if (window.innerHeight > window.innerWidth) {
                        self.pinta_cosas_mobile_gira_();
                    } else {
                        self.pinta_cosas_mobile_();
                    }
                },300);
            });
        }
    };


    /*******************/
    /*******************/
    /***** MOBILE ******/
    /*******************/
    /*******************/




};

(function() { // module pattern
    var juego = new Game();

    juego.controla_orientacion_();
    juego.counter = 0; 

    var dt = 0, 
        now,
        last = juego.timestamp_();

    var fpsInterval = 1000 / 30;

    var then = juego.timestamp_();
    function frame() {
        if(!juego.empezado_ || juego.pausa_){
            requestAnimationFrame(frame, canvas);
            return;
        }
        now = juego.timestamp_();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > juego.step_) {
            dt = dt - juego.step_;
            if(!juego.hay_punto_){
                juego.update_(juego.step_);
            }
        }
        if(juego.hay_punto_){
            var elapsed = now - then;

            if (elapsed > fpsInterval) {
                juego.pre_shake_();
                juego.render(juego.ctx, juego.counter, dt);
                juego.post_shake_();
                juego.update_(juego.step_);
                then = now - (elapsed % fpsInterval);
            }
        }
        else{
            juego.pre_shake_();
            juego.render(juego.ctx, juego.counter, dt);
            juego.post_shake_();
        }

        last = now;
        juego.counter++;
        requestAnimationFrame(frame, canvas);
    }

    document.addEventListener('keydown', function(ev) { return juego.onkey_(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return juego.onkey_(ev, ev.keyCode, false); }, false);

    function handleVisibilityChange() {
        if (document.hidden) {
            juego.pausa_ = true;
        } else  {
            juego.pausa_ = false;
            juego.controla_orientacion_();
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange, false);

    var music_player = new CPlayer();
    var flag_song = false;
    music_player.init(song);

    var croqueta_player = new CPlayer();
    croqueta_player.init(croqueta);
    var flag_croqueta = false;
    window.croqueta_audio;

    var golpe_player = new CPlayer();
    golpe_player.init(golpe);
    var flag_golpe = false;
    window.golpe_audio;

    var golpe_player2 = new CPlayer();
    golpe_player2.init(golpe2);
    var flag_golpe2 = false;
    window.golpe_audio2;

    var punto_player = new CPlayer();
    punto_player.init(punto);
    var flag_punto = false;
    window.punto_audio;

    var levelup_player = new CPlayer();
    levelup_player.init(levelup);
    var flag_levelup = false;
    window.levelup_audio2;


    var done = false;
    var intervalo_cancion = setInterval(function () {
        if (done) {
            juego.controla_orientacion_();
            juego.muestra_menu_(juego.ctx, false);
            frame();
            clearInterval(intervalo_cancion);
            return;
        }

        if(!flag_song){
            var music_percent = music_player.generate();
            juego.pinta_cargador_(music_percent, juego.ctx);
            if(music_percent >= 1){
                flag_song = true;
            }
        }

        if(!flag_croqueta){
            if(croqueta_player.generate() >= 1){
                flag_croqueta = true;
            }
        }
        
        if(!flag_golpe){
            if(golpe_player.generate() >= 1){
                flag_golpe = true;
            }
        }
        
        if(!flag_golpe2){
            if(golpe_player2.generate() >= 1){
                flag_golpe2 = true;
            }
        }
        
        if(!flag_levelup){
            if(levelup_player.generate() >= 1){
                flag_levelup = true;
            }
        }
        
        if(!flag_punto){
            if(punto_player.generate() >= 1){
                flag_punto = true;
            }
        }
        

        done = (flag_song && flag_croqueta && flag_golpe && flag_golpe2);

        if (done) {
          // Put the generated song in an Audio element.
          var wave = music_player.createWave();
          var audio = document.createElement("audio");
          audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
          audio.loop=true;
          audio.play();
          audio.volume = 0.3;


          var wave2 = croqueta_player.createWave();
          window.croqueta_audio = document.createElement("audio");
          window.croqueta_audio.src = URL.createObjectURL(new Blob([wave2], {type: "audio/wav"}));
          window.croqueta_audio.volume = 0.7;
          
          var wave3 = golpe_player.createWave();
          window.golpe_audio = document.createElement("audio");
          window.golpe_audio.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));
          
          var wave4 = golpe_player2.createWave();
          window.golpe_audio2 = document.createElement("audio");
          window.golpe_audio2.src = URL.createObjectURL(new Blob([wave4], {type: "audio/wav"}));
          
          var wave5 = levelup_player.createWave();
          window.levelup_audio2 = document.createElement("audio");
          window.levelup_audio2.src = URL.createObjectURL(new Blob([wave5], {type: "audio/wav"}));
          
          var wave6 = punto_player.createWave();
          window.punto_audio = document.createElement("audio");
          window.punto_audio.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));
        
        }
    }, 40);


})();
