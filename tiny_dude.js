(function() { // module pattern

  //-------------------------------------------------------------------------
  // POLYFILLS
  //-------------------------------------------------------------------------
  
  //Polify de requestanimationFrame

  if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                   window.mozRequestAnimationFrame    || 
                                   window.oRequestAnimationFrame      || 
                                   window.msRequestAnimationFrame     || 
                                   function(callback, element) {
                                     window.setTimeout(callback, 1000 / 60);
                                   };
  }

    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------
    //Devuelve timestamp
    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
  
    //Limite entre dos máximos
    function bound(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }

    //comprueba si algo está dentro de algo
    function overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(((x1 + w1 - 1) < x2) ||
                ((x2 + w2 - 1) < x1) ||
                ((y1 + h1 - 1) < y2) ||
                ((y2 + h2 - 1) < y1));
    }

    // Returns an random integer, positive or negative
    // between the given value
    function randInt(min, max, positive) {

        var num;
        if (positive === false) {
            num = Math.floor(Math.random() * max) - min;
            num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
        } else {
            num = Math.floor(Math.random() * max) + min;
        }

        return num;

    }

    function pinta_marcador(){
        var letras = {
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
        letra1 = letras[puntos1];
        letra2 = letras[puntos2];
        var size = 4;
        pinta_filas_columnas(ctx, 16, 16, letra1, size);
        pinta_filas_columnas(ctx, ancho_total - 16 - (size*3), 16, letra2, size);

        
    }

    function pinta_filas_columnas(ctx, x, y, letra, size){
        ctx.fillStyle = "#ffffff";
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
    }

  
    //-------------------------------------------------------------------------
    // GAME CONSTANTS AND VARIABLES
    //-------------------------------------------------------------------------

    //NUEVAS VARIABLES
    var     ancho_total = 840,
            alto_total  = 600,
            alto_red = 190,
            
            ancho_jugador = 80,
            alto_jugador = 110,
            g_jugador = 800,
            v_jugador = 400,
            v_saltando_jugador = 550,

            radio_pelota = 20,
            g_pelota = 900,
            gravedad_rebote_normal = 900,
            velocidad_rebote_normal = -600,

            velocidad_lateral1 = 800,
            velocidad_lateral_mate = 1000,
            velocidad_lateral3 = 300,
        
            velocidad_vertical1 = 700,
            velocidad_vertical_mate = 800,
            velocidad_vertical_dejada = -100,
            velocidad_vertical_arriba = -1000,

            gravedad_pika1 = 1500,
            gravedad_pika2 = 1400,
            gravedad_pika3 = 1400;



  
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
      
    var     fps      = 60,
            step     = 1/fps,
            canvas   = document.getElementById('canvas'),
            ctx      = canvas.getContext('2d'),
            width    = canvas.width  = ancho_total,
            height   = canvas.height = alto_total,
            player   = {},
            player2   = {},
            ball   = {},
            net   = {},
            tiempo_punto = timestamp(),
            hay_punto = false,
            puntos1 = 0,
            puntos2 = 0;



    var explosions            = [];
  
  
    //-------------------------------------------------------------------------
    // Teclas
    //-------------------------------------------------------------------------
    function onkey(ev, key, down) {
        switch(key) {
            case KEY.LEFT:  player.left  = down; ev.preventDefault(); return false;
            case KEY.RIGHT: player.right = down; ev.preventDefault(); return false;
            case KEY.UP: player.jump  = down; ev.preventDefault(); return false;
            case KEY.DOWN: player.down  = down; ev.preventDefault(); return false;
            case KEY.Z: player.accion  = down; ev.preventDefault(); return false;
        }
    }
  
    //-------------------------------------------------------------------------
    // UPDATE LOOP
    //-------------------------------------------------------------------------
    function update(dt) {

        procesa_punto();
        calculaDondeCae();
        player.update(dt);
        player2.update(dt);
        checkBallCollisionNet();
        checkBallCollision();
        ball.update(dt);
    }


    function checkBallCollisionNet() {
        if(overlap(net.x, net.y, net.width, net.height, ball.center_x - ball.ancho/2, ball.center_y - ball.alto/2, ball.ancho, ball.alto)){
            //Si la pelota está por encima de la red, rebota parriba
            //if((ball.y + ball.alto) < net.y && ball.dy > 0){
            if(ball.center_y < net.y){
                if(ball.dy > 0){
                    ball.dy = - ball.dy * FACTOR_REBOTE;
                }
            }
            //Sino rebota para el lado
            else{
                if(ball.x > ancho_total/2){
                    ball.x = ancho_total/2 + net.width;
                }
                else{
                    ball.x = ancho_total/2 - ball.ancho;

                }
                ball.dx = - ball.dx * FACTOR_REBOTE;
            }
        }
    }
    function checkBallCollision() {


        if(hay_punto){
            return;
        }
        
        var rebota = false;
        var jugador_rebota = false;

        //Si el player1 colisiona con la pelota...
        if(!player.jumping && player.haciendo_gorrino){
            var izq_gorrino = player.alto/2;
            if(player.gorrino_left){
                izq_gorrino = -1 * player.alto/2;
            }   
            if ((overlap(player.x + izq_gorrino, player.y + player.ancho/4, player.alto, player.ancho, ball.center_x - ball.ancho/2, ball.center_y - ball.alto/2, ball.ancho, ball.alto) &&
                 timestamp() > player.no_rebota_time)){
                    rebota = true;
                    jugador_rebota = player;
            }

        }
        else{
            if ((overlap(player.x, player.y, player.ancho, player.alto, ball.center_x - ball.ancho/2, ball.center_y - ball.alto/2, ball.ancho, ball.alto) &&
                 timestamp() > player.no_rebota_time)){
                    rebota = true;
                    jugador_rebota = player;
            }
        }

        

        //Si el player2 colisiona con la pelota...
        if(!player2.jumping && player2.haciendo_gorrino){
            var izq_gorrino2 = player2.alto/2;
            if(player2.gorrino_left){
                izq_gorrino2 = -1 * player2.alto/2;
            }   
            if ((overlap(player2.x + izq_gorrino2, player2.y + player2.ancho/4, player2.alto, player2.ancho, ball.center_x - ball.ancho/2, ball.center_y - ball.alto/2, ball.ancho, ball.alto) &&
                 timestamp() > player2.no_rebota_time)){
                    rebota = true;
                    jugador_rebota = player2;
            }

        }
        else{
            if ((overlap(player2.x, player2.y, player2.ancho, player2.alto, ball.center_x - ball.ancho/2, ball.center_y - ball.alto/2, ball.ancho, ball.alto) &&
                 timestamp() > player2.no_rebota_time)){
                    rebota = true;
                    jugador_rebota = player2;
            }
        }

        if(rebota){
            golpe_audio2.play();
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

            var x_explosion = ball.x + ball.ancho/2;
            var y_explosion = ball.y + ball.alto/2;


            //SI ESTÁ EN EL SUELO O NO ESTA ENFADADO
            if(!jugador_rebota.jumping || (jugador_rebota.tiempo_enfadado < timestamp())){
                ball.mate = false;
                //vuelve a la gravedad por defecto
                ball.gravity = 900;

                //Velocidad Y de la pelota... es la velocidad que lleve menos el impulso(parriba)
                var ball_dy = ball.dy/6 - IMPULSO_PELOTA;
                if(ball_dy < 0){
                    ball.dy = bound(Math.abs(ball.dy/6 - IMPULSO_PELOTA), IMPULSO_PELOTA/1.3, IMPULSO_PELOTA) * (-1);
                }
                else{
                    ball.dy = bound(ball.dy/6 - IMPULSO_PELOTA, IMPULSO_PELOTA/1.3, IMPULSO_PELOTA) ;
                }

                ball.dy = -IMPULSO_PELOTA;

                //La velocidad X de la pelota es igual a la que lleve +/- la diferencia de posicion que tienen en el eje X por un factor de alejado X
                ball.dx = ball.dx/4 + (ball.x - jugador_rebota.x) * F_ALEJA_X;

                //La velocidad Y del jugador se reduce a la mitad
                jugador_rebota.dy = jugador_rebota.dy/F_SALTO_COLISION;


                explosions.push(
                    new Explosion(x_explosion, y_explosion, false, false, ball)
                );
            }
            //SI ESTÁ EN EL AIRE Y ENFADADO
            else{
                ball.mate = true;

                jugador_rebota.no_rebota_time = timestamp() + 300;

                if(jugador_rebota === player){

                    //pulsado izquierda o derecha solo
                    if ((jugador_rebota.right || jugador_rebota.left) && !jugador_rebota.jump && !jugador_rebota.down)
                    {
                        ball.dy = -Math.abs(ball.dy)*0.3;
                        ball.dy = -300;
                        ball.dx = velocidad_lateral1;
                        ball.gravity = gravedad_mate1;
                    }
                    // arriba derecha
                    else if(jugador_rebota.right && jugador_rebota.jump && !jugador_rebota.down )
                    {
                        ball.dy = -velocidad_vertical1;
                        ball.dx = velocidad_lateral2;
                        ball.gravity = gravedad_mate2;
                    }
                    //arriba izquierda
                    else if(jugador_rebota.left && jugador_rebota.jump && !jugador_rebota.down)
                    {
                        ball.dy = -velocidad_vertical1;
                        ball.dx = -velocidad_lateral2;
                        ball.gravity = gravedad_mate2;
                    }
                    // abajo y a un lado
                    else if((jugador_rebota.right || jugador_rebota.left) && !jugador_rebota.jump && jugador_rebota.down){
                        ball.dy = velocidad_vertical_mate;
                        ball.dx = velocidad_lateral_mate;
                        ball.gravity = gravedad_mate3;
                    }
                    // abajo solo
                    else if(!jugador_rebota.right && !jugador_rebota.left && !jugador_rebota.jump && jugador_rebota.down){
                        ball.dy = velocidad_vertical_mate;
                        ball.dx = velocidad_lateral2;
                        ball.gravity = gravedad_mate2;
                    }
                    //sin pulsar ningun lado
                    else if(!jugador_rebota.right && !jugador_rebota.left && !jugador_rebota.jump && !jugador_rebota.down){
                        ball.dy = -velocidad_vertical_dejada;
                        ball.dx = velocidad_lateral3;
                        ball.gravity = gravedad_mate2;
                    }
                    //arriba solo
                    else if(!jugador_rebota.right && !jugador_rebota.left && jugador_rebota.jump && !jugador_rebota.down){
                        ball.dy = -velocidad_vertical_arriba;
                        ball.dx = velocidad_lateral3;
                        ball.gravity = gravedad_mate2;
                    }
                }
                else{
                    
                    //TODO: hacer tiro de la maquina aleatorio 
                    var ale = Math.random();
                    if(ale < 0.4){
                        ball.dy = -velocidad_vertical1;
                        ball.dx = -velocidad_lateral1;
                        ball.gravity = gravedad_mate2;
                    }
                    else if(ale >= 0.4 && ale < 0.8){
                        ball.dy = -Math.abs(ball.dy)*0.3;
                        ball.dy = -300;
                        ball.dx = -velocidad_lateral1;
                        ball.gravity = gravedad_mate1;
                    }
                    else{
                        if(player2.x < (3/4)*ancho_total){
                            if(ale < 0.9){
                                ball.dy = velocidad_vertical_mate;
                                ball.dx = -velocidad_lateral_mate;
                                ball.gravity = gravedad_mate3;
                            }
                            else{
                                ball.dy = -velocidad_vertical_arriba;
                                ball.dx = -velocidad_lateral3;
                                ball.gravity = gravedad_mate2;
                            }
                        }
                        else{
                            ball.dy = -IMPULSO_PELOTA;
                            ball.dx = ball.dx/4 + (ball.x - jugador_rebota.x) * F_ALEJA_X;
                            jugador_rebota.dy = jugador_rebota.dy/F_SALTO_COLISION;
                        }
                    }
                    
                }

                //La velocidad Y del jugador se reduce a la mitad
                jugador_rebota.dy = jugador_rebota.dy/F_SALTO_COLISION;

                explosions.push(
                    new Explosion(x_explosion, y_explosion, true, false, ball)
                );
            }

            if(jugador_rebota === player2 && jugador_rebota.jumping){
                player2.tiempo_enfadado = timestamp();
            }
        }


    }

    //-------------------------------------------------------------------------
    // CALCULOS
    //-------------------------------------------------------------------------
    function procesa_punto(){
        
        if(tiempo_punto > timestamp()){
            hay_punto = true;
        }
        else{
            if(hay_punto){
                empieza(empieza1);
            }
            hay_punto = false;
        }

    }

    function empieza(empieza1){
        
        player.x = 96;
        player.y = alto_total - player2.alto - 50;
        
        player2.x = ancho_total - 96 - player2.ancho;
        player2.y = alto_total - player2.alto - 50;

        if(empieza1){
            ball.x = 112;
        }
        else{
            ball.x = ancho_total - 112 - ball.ancho;
        }
        ball.y = 20;
        ball.dx = 0;
        ball.dy = 0;
        ball.center_x         = ball.x + ball.ancho/2;
        ball.center_y         = ball.y + ball.alto/2;

        hay_punto = false;
    }

    var dondecae = 0;
    var movia_left = false;
    function calculaDondeCae(){

        if(hay_punto){
            return;
        }
        // TODO:
        // Calcular donde cae... 
        // si cae en mi campo mover izq/der para ir a por ella
        // Si no cae en mi campo, mover de forma aleatorea


        var ancho_juego = ancho_total;
        var alto_juego = alto_total;
        var x = ball.center_x;
        //donde está la pelota en altura
        var H_b = alto_juego - ball.y + ball.alto/2;
        var H_p = alto_juego - ball.y + (ball.alto/2) - (alto_juego - player2.y);
        //var H = alto_juego - ball.y;
        var Vx = ball.dx;
        var Vy = ball.dy;

        //calcula donde cae
     
        if (Vy<=10){
            Vy = Vy*(-1);
            //Donde cae en relación a donde estoy
            dondecae = x + (Vx)/ball.ddy * Math.sqrt((2*ball.ddy*H_p)+(Vx));
            if (dondecae>ancho_juego){
                dondecae = ancho_juego - (dondecae-ancho_juego);
            }
            else if(dondecae<0){
                dondecae = - dondecae;
            }
        }else{
            //solo calculo donde cae si se mueve abajo(la pelota)
        }

        var player2_x = player2.x + (player2.ancho / 2);
        var player2_y = player2.y + (player2.alto / 2);


        var ball_y = ball.y + ball.alto/2;

        //si cae en mi campo
        if(player2.haciendo_gorrino){
            //nada
        }
        else if(dondecae > (ancho_juego/2 - 50) ||
                (dondecae > (ancho_juego/2 - 150) && Vy < (-100))){
            
            //si cae a mi izquierda, me muevo pallá
            //TODO: revisar el valor a la derecha 'factor_derecha'
            var factor_derecha = 0;
            if(dondecae < (player2_x - factor_derecha) && player2_x > ancho_juego/2){
                player2.left = true;
                player2.right = false;
            }
            //si cae a mi derecha, me muevo palla
            else{
                player2.right = true;
                player2.left = false;
            }

            if(Math.abs(dondecae - player2_x) < 110 && 
                x>ancho_juego/2 && 
                (player2_y > alto_juego-200) && 
                (Vx<100 && Vx>-100) && 
                (ball_y < alto_juego - 300) &&
                player2.tiempo_enfadado < timestamp()){

                player2.jump = true;

                player2.tiempo_enfadado = timestamp()+700;

            }
            else{
                player2.jump = false;
            }

        }
        else{
            player2.tiempo_enfadado = timestamp();
            var movimientos_aleatorios = counter % 50;
            
            if (movimientos_aleatorios > 48){
                ale = Math.random();

                if (ale>0.5 && player2_x > ancho_juego/2){
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

        var limite_gorrino_x = 100;
        var limite_gorrino_y = alto_total/3;
        if(!player2.jumping && H_b < limite_gorrino_y){
            if(dondecae < player2_x && player2_x > ancho_total/2){
                if(player2_x - dondecae > limite_gorrino_x && 
                    x > (ancho_total/2 - 50) && 
                    !player2.haciendo_gorrino){

                    player2.tiempo_gorrino = timestamp()+400;
                    player2.gorrino_left = true;
                }

            }
            else{
                if(dondecae - player2_x > limite_gorrino_x && 
                    x > ancho_total/2 && 
                    !player2.haciendo_gorrino){
                    
                    player2.tiempo_gorrino = timestamp()+400;
                    player2.gorrino_left = false;
                }

            }
        }
        
        
  


    }

    function game_over() {
        //TODO: Hacer game over
    }

    function siguiente_level() {
        //TODO: Hacer siguiente_level
        levelup_player.play();

    }

    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    function render(ctx, frame, dt) {
        ctx.clearRect(0, 0, width, height);
        renderPlayer(ctx, dt);
        renderplayer2(ctx, dt);
        ball.render(ctx, dt);
        renderNet(ctx);
        drawExplosion();
        pinta_marcador();
    }



    function renderNet(ctx) {
        ctx.fillStyle = COLOR.BRICK;
        ctx.fillRect(net.x, net.y, net.width, net.height);
    }

    function renderPlayer(ctx, dt) {
        if(player.haciendo_gorrino){
            ctx.fillStyle = COLOR.PINK;
            player.pinta_player(true, dt, ball, ctx, counter);
            
        }
        else{
            if(player.tiempo_enfadado > timestamp()){
                ctx.fillStyle = COLOR.PURPLE;
            }
            else{
                ctx.fillStyle = COLOR.YELLOW;                
            }
            player.pinta_player(false, dt, ball, ctx, counter);
        }
    }

  
    function renderplayer2(ctx, dt) {
        if(player2.haciendo_gorrino){
            ctx.fillStyle = COLOR.PINK;
            var izq_gorrino = 1;
            if(player2.gorrino_left){
                izq_gorrino = -1;
            }
            player2.pinta_player(true, dt, ball, ctx, counter);            
        }
        else{
            if(player2.tiempo_enfadado > timestamp()){
                ctx.fillStyle = COLOR.BLACK;
            }
            else{
                ctx.fillStyle = COLOR.GREY;
            }
            player2.pinta_player(false, dt, ball, ctx, counter);  
        }
    }


    function drawExplosion() {
        if (explosions.length === 0) {
            return;
        }

        for (var i = 0; i < explosions.length; i++) {

            var explosion = explosions[i];
            var particles = explosion.particles;

            if (particles.length === 0) {
                explosions.splice(i, 1);
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

            explosion.particles = particlesAfterRemoval;

        }
    }



    //-------------------------------------------------------------------------
    // LOAD THE MAP
    //-------------------------------------------------------------------------
  
    function setup() {

        player = new Player(false, 96, false, false, false, 1, false);
        player2 = new Player(false, 1850, false, false, false, 2, false);
        /*
        player.x                = 96;
        player.y                = 1107;
        player.alto             = 110;
        player.ancho            = 80;
        player.dx               = 0;
        player.dy               = 0;
        player.gravity          = 800;
        player.maxdx            = 150;
        player.maxdy            = 600;
        player.impulse          = 60000;
        player.accel            = player.maxdx / (ACCEL);
        player.friction         = player.maxdx / (FRICTION);
        player.player           = true;
        player.tiempo_enfadado  = timestamp();
        player.tiempo_gorrino   = timestamp();
        player.no_rebota_time   = timestamp();
        player.start            = { x: player.x, y: player.y };

        player2.x                = 1850;
        player2.y                = 1107;
        player2.alto             = 110;
        player2.ancho            = 80;
        player2.dx               = 0;
        player2.dy               = 0;
        player2.gravity          = 800;
        player2.maxdx            = 150;
        player2.maxdy            = 600;
        player2.impulse          = 60000;
        player2.accel            = player2.maxdx / (ACCEL);
        player2.friction         = player2.maxdx / (FRICTION);
        player2.player2          = true;
        player2.tiempo_enfadado  = timestamp();
        player2.tiempo_gorrino   = timestamp();
        player2.no_rebota_time   = timestamp();
        player2.start            = { x: player2.x, y: player2.y };

        ball.x                = 96;
        ball.y                = 0;
        ball.alto             = 50;
        ball.ancho            = 50;
        ball.center_x         = ball.x + ball.ancho/2;
        ball.center_y         = ball.y + ball.alto/2;
        ball.dx               = 0;
        ball.dy               = 0;
        ball.gravity          = 900;
        ball.maxdx            = 1500;
        ball.maxdy            = 1500;
        ball.impulse          = 550;
        ball.accel            = ball.maxdx / (ACCEL);
        ball.friction         = ball.maxdx / (FRICTION);
        ball.ball             = true;
        ball.start            = { x: ball.x, y: ball.y };
        */

        ball = new Ball();
        var alto_red = 220; 
        net = { "height":alto_red, "width":12, "x":(ancho_total)/2, "y":(alto_total) - alto_red};

    }


    //-------------------------------------------------------------------------
    // THE GAME LOOP
    //-------------------------------------------------------------------------
  
    var counter = 0, dt = 0, now,
        last = timestamp();
        fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  
    function frame() {
        fpsmeter.tickStart();
        now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > step) {
            dt = dt - step;
            update(step);
        }
        render(ctx, counter, dt);
        last = now;
        counter++;
        fpsmeter.tick();
        requestAnimationFrame(frame, canvas);
    }


    function muestra_logo() {
        var logo =  [
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1,  , 1,  ,  , 1,  ,  , 1, 1, 1,  ,  , 1,  , 1, 1,  ,  1, 1, 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  ,  1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  ],
                        [  , 1, 1,  ,  , 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  ,  1, 1,  , 1,  , 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  ,  , 1, 1,  ],
                        [  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  ,  1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  ],
                        [  , 1, 1,  ,  , 1, 1,  , 1,  ,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1,  ,  1, 1, 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
                ];

        var size_logo_px = 8;
        var x_logo = ancho_total/2 - (size_logo_px * logo[0].length)/2;

        pinta_filas_columnas(ctx, x_logo, 200, logo, size_logo_px);
        
    }

    //muestro el logo
    muestra_logo();


    function pinta_cargador($percent) {
        var ancho_cargador = 200;
        var alto_cargador = 80;
        ctx.fillRect((ancho_total - ancho_cargador)/2, alto_total/2 + 50, $percent * ancho_cargador, alto_cargador);

        ctx.strokeStyle="#ffffff";
        ctx.lineWidth=10;
        ctx.strokeRect((ancho_total - ancho_cargador)/2, alto_total/2 + 50, ancho_cargador - 5, alto_cargador);
    }


    function muestra_menu() {
        
        //TODO: Aquí muestro el menu: 1 player / 2 player?


        // Cuando está todo seleccionado, llamo al frame
        frame();
    }

  
    document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

    

    var music_player = new CPlayer();
    var flag_song = false;
    music_player.init(song);

    var croqueta_player = new CPlayer();
    croqueta_player.init(croqueta);
    var flag_croqueta = false;
    var croqueta_audio;

    var golpe_player2 = new CPlayer();
    golpe_player2.init(golpe);
    var flag_golpe2 = false;
    var golpe_audio2;

    var levelup_player = new CPlayer();
    levelup_player.init(levelup);
    var flag_levelup = false;
    var levelup_audio2;
    
    setup();
    

    var done = false;
    var intervalo_cancion = setInterval(function () {
        if (done) {
            

            muestra_menu();

            clearInterval(intervalo_cancion);
            return;

        }
        //console.log(croqueta_player.generate());

        if(!flag_song){
            var music_percent = music_player.generate();
            pinta_cargador(music_percent);
            if(music_percent >= 1){
                flag_song = true;
            }
        }

        if(!flag_croqueta){
            if(croqueta_player.generate() >= 1){
                flag_croqueta = true;
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
        

        done = (flag_song && flag_croqueta && flag_golpe2);
        //done = golpe2_player.generate() >= 1;

        if (done) {
          // Put the generated song in an Audio element.
          var wave = music_player.createWave();
          var audio = document.createElement("audio");
          audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
          audio.loop=true;
          audio.play();
          audio.volume = 0.3;


          var wave2 = croqueta_player.createWave();
          croqueta_audio = document.createElement("audio");
          croqueta_audio.src = URL.createObjectURL(new Blob([wave2], {type: "audio/wav"}));
          
          var wave3 = golpe_player2.createWave();
          golpe_audio2 = document.createElement("audio");
          golpe_audio2.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));
          
          var wave4 = levelup_player.createWave();
          levelup_player = document.createElement("audio");
          levelup_player.src = URL.createObjectURL(new Blob([wave4], {type: "audio/wav"}));
        

          //

        }
    }, 100);



    function is_touch_device() {
        return 'ontouchstart' in document.documentElement;
    }

    var canvas_mobile;
    var ctx_mobile;
    if(is_touch_device()){
        if (window.innerHeight > window.innerWidth) {
            pinta_cosas_mobile_gira();
        } else {
            pinta_cosas_mobile();
        }
        window.addEventListener('orientationchange', function (argument) {
            window.setTimeout(function () {
                if (window.innerHeight > window.innerWidth) {
                    pinta_cosas_mobile_gira();
                } else {
                    pinta_cosas_mobile();
                }
            },300);
        });

    }
  
    function pinta_cosas_mobile_gira() {

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
        pinta_filas_columnas(ctx_mobile_gira, x_gira, 200, gira_mobile, size_gira_px);
          
    }
  
    function pinta_cosas_mobile() {
        document.getElementById('canvas_mobile_gira').style.display = "none";

        canvas_mobile   = document.getElementById('canvas_mobile');
        ctx_mobile      = canvas_mobile.getContext('2d');
        canvas_mobile.style.display = "block";
        var ancho_window = window.innerWidth
        canvas_mobile.width  = ancho_total;
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

        pinta_filas_columnas(ctx_mobile, 20, 20, flecha_izq, size_flecha_px);
        pinta_filas_columnas(ctx_mobile, 120, 20, flecha_der, size_flecha_px);
        pinta_filas_columnas(ctx_mobile, ancho_window - 180, 20, flecha_arr, size_flecha_px);
        pinta_filas_columnas(ctx_mobile, ancho_window - 80, 20, accion_boton, size_flecha_px);

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

})();


