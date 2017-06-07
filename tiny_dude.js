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

    //pilla por get cosas
    function get(url, onsuccess) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
        if ((request.readyState == 4) && (request.status == 200))
            onsuccess(request);
        };
        request.open("GET", url, true);
        request.send();
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
    function calcula_rotacion(x, y) {

        var centro_balon_x = ball.x + (ball.dx * dt) + TILE*ball.x_tiles/2;
        var centro_balon_y = ball.y + (ball.dy * dt) + TILE*ball.y_tiles/2;

        theta += ball.dx/10000;

        //ROTACION VERTICE 1
        var tempX = x - centro_balon_x;
        var tempY = y - centro_balon_y;

        var rotatedX = tempX*Math.cos(theta) - tempY*Math.sin(theta);
        var rotatedY = tempX*Math.sin(theta) + tempY*Math.cos(theta);

        var ret = {};
        ret.x = rotatedX + centro_balon_x;
        ret.y = rotatedY + centro_balon_y;
        return ret;

    }
  
    //-------------------------------------------------------------------------
    // GAME CONSTANTS AND VARIABLES
    //-------------------------------------------------------------------------
  
    var     MAP      = { tw: 64, th: 40 },
            TILE     = 32,
            METER    = TILE,
            GRAVITY  = 9.8 * 6, // default (exagerated) gravity
            MAXDX    = 12,      // default max horizontal speed (15 tiles per second)
            MAXDY    = 60,      // default max vertical speed   (60 tiles per second)
            ACCEL    = 0.001,     // default take 1/2 second to reach maxdx (horizontal acceleration)
            FRICTION = 0.001,     // default take 1/6 second to stop from maxdx (horizontal friction)
            IMPULSE  = 2800,    // default player jump impulse
            IMPULSO_PELOTA  = 1000,    // impulso de la pelota
            FACTOR_REBOTE  = 0.7,    // impulso de la pelota
            F_ALEJA_X  = 2,    // factor que se aleja la pelota en el ejeX
            F_SALTO_COLISION = 2, // factor en el que se reduce la velocidadY del jugador al colisionar con la pelota
            COLOR    = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
            COLORS   = [ COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ],
            KEY      = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, Z: 90 };
      
    var     fps      = 60,
            step     = 1/fps,
            canvas   = document.getElementById('canvas'),
            ctx      = canvas.getContext('2d'),
            width    = canvas.width  = MAP.tw * TILE,
            height   = canvas.height = MAP.th * TILE,
            player   = {},
            ball   = {},
            cells    = [];



    //TOdO: Cambiar esto para que sea relativo a la velocidad de la pelota o algo así
    var particlesPerExplosion = 15;
    var particlesMinSpeed     = 3;
    var particlesMaxSpeed     = 8;
    var particlesMinSize      = 1;
    var particlesMaxSize      = 8;
    var explosions            = [];
  
    var     t2p      = function(t)     { return t*TILE;                  },
            p2t      = function(p)     { return Math.floor(p/TILE);      },
            cell     = function(x,y)   { return tcell(p2t(x),p2t(y));    },
            tcell    = function(tx,ty) { return cells[tx + (ty*MAP.tw)]; };
  
  
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
        calculaDondeCae();

        updatePlayer1(dt);
        updatePlayerCPU(dt);
        checkBallCollision();
        updateBall(dt);
    }


    function checkBallCollision() {
        //Si el player1 colisiona con la pelota...
        if (overlap(player.x, player.y, TILE*player.x_tiles, TILE*player.y_tiles, ball.x, ball.y, TILE*ball.x_tiles, TILE*ball.y_tiles) &&
             timestamp() > player.no_rebota_time){


            //TODO: Parametrizar con el tamaño de los tiles
            var velocidad_lateral1 = 1600;
            var velocidad_lateral2 = 600;
            var velocidad_vertical1 = 1400;
            var velocidad_vertical_mate = 1600;
            var velocidad_lateral_mate = 2000;
            var velocidad_vertical_dejada = -200;
            var velocidad_vertical_arriba = -2000;

            var gravedad_mate1 = METER * 80;
            var gravedad_mate2 = METER * 70;
            var gravedad_mate3 = METER * 70;


            //SI ESTÁ EN EL SUELO O NO ESTA ENFADADO
            if(!player.jumping || (player.tiempo_enfadado < timestamp())){
                ball.mate = false;
                //vuelve a la gravedad por defecto
                ball.gravity = METER * 50;

                //Velocidad Y de la pelota... es la velocidad que lleve menos el impulso(parriba)
                ball.dy = ball.dy/6 - IMPULSO_PELOTA;
                //ball.dy = -ball.dy * FACTOR_REBOTE;

                //La velocidad X de la pelota es igual a la que lleve +/- la diferencia de posicion que tienen en el eje X por un factor de alejado X
                ball.dx = ball.dx/4 + (ball.x - player.x) * F_ALEJA_X;

                //La velocidad Y del jugador se reduce a la mitad
                player.dy = player.dy/F_SALTO_COLISION;

                var x_explosion = ball.x + TILE*ball.x_tiles/2;
                var y_explosion = ball.y + TILE*ball.y_tiles/2;

                explosions.push(
                    new explosion(x_explosion, y_explosion, false)
                );
            }
            //SI ESTÁ EN EL AIRE Y ENFADADO
            else{
                ball.mate = true;

                player.no_rebota_time = timestamp() + 200;

                //pulsado izquierda o derecha solo
                if ((player.right || player.left) && !player.jump && !player.down)
                {
                    ball.dy = -ball.dy*0.3;
                    ball.dx = velocidad_lateral1;
                    ball.gravity = gravedad_mate1;
                }
                // arriba derecha
                else if(player.right && player.jump && !player.down )
                {
                    ball.dy = -velocidad_vertical1;
                    ball.dx = velocidad_lateral1;
                    ball.gravity = gravedad_mate2;
                }
                //arriba izquierda
                else if(player.left && player.jump && !player.down)
                {
                    ball.dy = -velocidad_vertical1;
                    ball.dx = -velocidad_lateral1;
                    ball.gravity = gravedad_mate2;
                }
                // abajo y a un lado
                else if((player.right || player.left) && !player.jump && player.down){
                    ball.dy = velocidad_vertical_mate;
                    ball.dx = velocidad_lateral_mate;
                    ball.gravity = gravedad_mate3;
                }
                // abajo solo
                else if(!player.right && !player.left && !player.jump && player.down){
                    ball.dy = velocidad_vertical_mate;
                    ball.dx = velocidad_lateral2;
                    ball.gravity = gravedad_mate2;
                }
                //sin pulsar ningun lado
                else if(!player.right && !player.left && !player.jump && !player.down){
                    ball.dy = velocidad_vertical_dejada;
                    ball.dx = velocidad_lateral2;
                    ball.gravity = gravedad_mate2;
                }
                //arriba solo
                else if(!player.right && !player.left && player.jump && !player.down){
                    ball.dy = velocidad_vertical_arriba;
                    ball.dx = velocidad_lateral2;
                    ball.gravity = gravedad_mate2;
                }


                var x_explosion = ball.x + TILE*ball.x_tiles/2;
                var y_explosion = ball.y + TILE*ball.y_tiles/2;

                explosions.push(
                    new explosion(x_explosion, y_explosion, true)
                );
            }
        }
    }


    function updatePlayer1(dt){
        //COntrol de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        var wasleft    = player.dx  < 0,
            wasright   = player.dx  > 0,
            friction   = player.friction,
            accel      = player.accel;
      
        //reseteo las aceleraciones
        player.ddx = 0;
        player.ddy = player.gravity;

        //movimientos
        if (player.left)
            player.ddx = player.ddx - accel;
        else if (wasleft)
            player.ddx = player.ddx + friction;
      
        if (player.right)
            player.ddx = player.ddx + accel;
        else if (wasright)
            player.ddx = player.ddx - friction;
      

        //Salto
        if (player.jump && !player.jumping) {
            player.ddy = player.ddy - player.impulse; // an instant big force impulse
            player.jumping = true;
        }

        //Si se pulsa acción
        if(player.accion && (timestamp() > player.tiempo_enfadado + 300)){
            player.tiempo_enfadado = timestamp()+400;
        }

        //Posiciones
        player.x  = player.x  + (dt * player.dx);
        player.y  = player.y  + (dt * player.dy);

        //velocidades
        player.dx = bound(player.dx + (dt * player.ddx), -player.maxdx, player.maxdx);
        player.dy = bound(player.dy + (dt * player.ddy), -player.maxdy, player.maxdy);
      
        
        if ((wasleft  && (player.dx > 0)) ||
            (wasright && (player.dx < 0))) {
          player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }

      
        

        var tx        = p2t(player.x),
            ty        = p2t(player.y),
            nx        = player.x%TILE,
            ny        = player.y%TILE,
            cell      = tcell(tx,     ty),
            cellright = tcell(tx + player.x_tiles, ty),
            celldown  = tcell(tx,     ty + player.y_tiles),
            celldiag  = tcell(tx + player.x_tiles, ty + player.y_tiles);


        //SI va pabajo
        if (player.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
           
                player.y = t2p(ty);
                player.dy = 0;
                player.jumping = false;
                ny = 0;       
            }
        }
        //Si va parriba
        else if (player.dy < 0) {
            if ((cell      && !celldown) ||
                (cellright && !celldiag && nx)) {
                player.y = t2p(ty + 1);
                player.dy = 0;
                cell      = celldown;
                cellright = celldiag;
                ny        = 0;
            }
        }
      
        //Si va a la derecha
        if (player.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag  && !celldown && ny)) {
                player.x = t2p(tx);
                player.dx = 0;
            }
            if(tx + player.x_tiles >= MAP.tw/2){
                player.x = t2p(tx);
                player.dx = 0;

            }
        }
        //Si va a la izquierda
        else if (player.dx < 0) {
            if ((cell     && !cellright) ||
                (celldown && !celldiag && ny)) {
                player.x = t2p(tx + 1);
                player.dx = 0;
            }
        }
    }


    function updatePlayerCPU(dt){
        //COntrol de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        var wasleft    = playerCPU.dx  < 0,
            wasright   = playerCPU.dx  > 0,
            friction   = playerCPU.friction,
            accel      = playerCPU.accel;
  
        //reseteo las aceleraciones
        playerCPU.ddx = 0;
        playerCPU.ddy = playerCPU.gravity;
  
        if (playerCPU.left)
            playerCPU.ddx = playerCPU.ddx - accel;
        else if (wasleft)
            playerCPU.ddx = playerCPU.ddx + friction;
      
        if (playerCPU.right)
            playerCPU.ddx = playerCPU.ddx + accel;
        else if (wasright)
            playerCPU.ddx = playerCPU.ddx - friction;
      
        if (playerCPU.jump && !playerCPU.jumping) {
            playerCPU.ddy = playerCPU.ddy - playerCPU.impulse; // an instant big force impulse
            playerCPU.jumping = true;
        }
  
        playerCPU.x  = playerCPU.x  + (dt * playerCPU.dx);
        playerCPU.y  = playerCPU.y  + (dt * playerCPU.dy);
       
        playerCPU.dx = bound(playerCPU.dx + (dt * playerCPU.ddx), -playerCPU.maxdx, playerCPU.maxdx);
        playerCPU.dy = bound(playerCPU.dy + (dt * playerCPU.ddy), -playerCPU.maxdy, playerCPU.maxdy);
      
        if ((wasleft  && (playerCPU.dx > 0)) ||
            (wasright && (playerCPU.dx < 0))) {
            playerCPU.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }
  
    

        var tx        = p2t(playerCPU.x),
            ty        = p2t(playerCPU.y),
            nx        = playerCPU.x%TILE,
            ny        = playerCPU.y%TILE,
            cell      = tcell(tx,     ty),
            cellright = tcell(tx + playerCPU.x_tiles, ty),
            celldown  = tcell(tx,     ty + playerCPU.y_tiles),
            celldiag  = tcell(tx + playerCPU.x_tiles, ty + playerCPU.y_tiles);
  

        if (playerCPU.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
                
                playerCPU.y = t2p(ty);
                playerCPU.dy = 0;
                playerCPU.jumping = false;
                ny = 0;

            }
        }
        else if (playerCPU.dy < 0) {
            if ((cell      && !celldown) ||
                (cellright && !celldiag && nx)) {
                playerCPU.y = t2p(ty + 1);
                playerCPU.dy = 0;
                cell      = celldown;
                cellright = celldiag;
                ny        = 0;
            }
        }
  
        if (playerCPU.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag  && !celldown && ny)) {
                playerCPU.x = t2p(tx);
                playerCPU.dx = 0;
            }
        }
        else if (playerCPU.dx < 0) {
            if ((cell     && !cellright) ||
                (celldown && !celldiag && ny)) {
                playerCPU.x = t2p(tx + 1);
                playerCPU.dx = 0;  

            }
        }
    }


    function updateBall(dt) {
        //COntrol de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        var wasleft    = ball.dx  < 0,
            wasright   = ball.dx  > 0,
            friction   = ball.friction,
            accel      = ball.accel;
  
        //reseteo las aceleraciones
        ball.ddx = 0;
        ball.ddy = ball.gravity;
  
        //Posicion
        ball.x  = ball.x  + (dt * ball.dx);
        ball.y  = ball.y  + (dt * ball.dy);

        //Velocidad
        ball.dy = bound(ball.dy + (dt * ball.ddy), -ball.maxdy, ball.maxdy);
        ball.dx = ball.dx/1.0004;
  

        var tx        = p2t(ball.x),
            ty        = p2t(ball.y),
            nx        = ball.x%TILE,
            ny        = ball.y%TILE,
            cell      = tcell(tx,     ty),
            cellright = tcell(tx + ball.x_tiles, ty),
            celldown  = tcell(tx,     ty + ball.y_tiles),
            celldiag  = tcell(tx + ball.x_tiles, ty + ball.y_tiles);
  

        if (ball.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
      
                ball.dy = -ball.dy * FACTOR_REBOTE;
            
            }
        }
        else if (ball.dy < 0) {
            if ((cell      && !celldown) ||
                (cellright && !celldiag && nx)) {
                ball.y      = t2p(ty + 1);
                ball.dy     = - ball.dy * FACTOR_REBOTE;
                cell        = celldown;
                cellright   = celldiag;
                ny          = 0;
            }
        }
  
        if (ball.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag  && !celldown && ny)) {
                ball.x = t2p(tx);
                ball.dx = -ball.dx * FACTOR_REBOTE;
            }
        }
        else if (ball.dx < 0) {
            if ((cell     && !cellright) ||
                (celldown && !celldiag && ny)) {
                ball.x = t2p(tx + 1);
                ball.dx = -ball.dx *FACTOR_REBOTE;
            }
        }
    }

    //-------------------------------------------------------------------------
    // CALCULOS
    //-------------------------------------------------------------------------
    function calculaDondeCae(){
        // TODO:
        // Calcular donde cae... 
        // si cae en mi campo mover izq/der para ir a por ella
        // Si no cae en mi campo, mover de forma aleatorea

        //console.log(counter);
        //playerCPU.left = true;
    }

    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    function render(ctx, frame, dt) {
        ctx.clearRect(0, 0, width, height);
        renderMap(ctx);
        renderPlayer(ctx, dt);
        renderPlayerCPU(ctx, dt);
        renderBall(ctx, dt);
        drawExplosion();
    }

    function renderMap(ctx) {
        var x, y, cell;

        for(y = 0 ; y < MAP.th ; y++) {
            for(x = 0 ; x < MAP.tw ; x++) {
                cell = tcell(x, y);
                if (cell) {
                    ctx.fillStyle = COLORS[cell - 1];
                    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                }
            }
        }
    }

    function renderPlayer(ctx, dt) {
        if(player.tiempo_enfadado > timestamp()){
            ctx.fillStyle = COLOR.PURPLE;
        }
        else{
            ctx.fillStyle = COLOR.YELLOW;

        }
        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), TILE*player.x_tiles, TILE*player.y_tiles);
    }

  
    function renderPlayerCPU(ctx, dt) {
        ctx.fillStyle = COLOR.GREY;
        ctx.fillRect(playerCPU.x + (playerCPU.dx * dt), playerCPU.y + (playerCPU.dy * dt), TILE*playerCPU.x_tiles, TILE*playerCPU.y_tiles);
    }
  
    var theta = 0;
    function renderBall(ctx, frame) {
        
        if(ball.mate){
            ctx.fillStyle   = COLOR.SLATE;
        }
        else{
            ctx.fillStyle   = COLOR.GOLD;
        }
        //ctx.globalAlpha = 0.25 + tweenBall(frame, 60);




        var v1 = calcula_rotacion(ball.x + (ball.dx * dt), ball.y + (ball.dy * dt));
        var v2 = calcula_rotacion(ball.x + (ball.dx * dt) + TILE*ball.x_tiles, ball.y + (ball.dy * dt));
        var v3 = calcula_rotacion(ball.x + (ball.dx * dt) + TILE*ball.x_tiles, ball.y + (ball.dy * dt) + TILE*ball.y_tiles);
        var v4 = calcula_rotacion(ball.x + (ball.dx * dt), ball.y + (ball.dy * dt) + TILE*ball.y_tiles);
       

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.lineTo(v4.x, v4.y);
        ctx.closePath();
        ctx.fill();
        //ctx.fillRect(ball.x + (ball.dx * dt), ball.y + (ball.dy * dt), TILE*ball.x_tiles, TILE*ball.y_tiles);


    
    
        ctx.globalAlpha = 1;
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


    function explosion(x, y, supertiro) {

        this.particles = [];

        var particulas_por_explosion = particlesPerExplosion;
        if(supertiro){
            particulas_por_explosion = particlesPerExplosion * 3;
        }

        for (var i = 0; i < particulas_por_explosion; i++) {
            this.particles.push(
                new particle(x, y, supertiro)
            );
        }
    }

    function particle(x, y, supertiro) {

        var max_particulas_size = particlesMaxSize;
        if(supertiro){
            max_particulas_size = particlesMaxSize * 1.5;
        }

        this.x    = x;
        this.y    = y;
        this.xv   = randInt(particlesMinSpeed, particlesMaxSpeed, false) + ball.dx/300;
        this.yv   = randInt(particlesMinSpeed/2, particlesMaxSpeed/2, false) + ball.dy/300;
        this.size = randInt(particlesMinSize, max_particulas_size, true);
        this.r    = '255';
        this.g    = '255';
        this.b    = randInt(0, 255);
    }


    /* Hacer algo guay con la pelota
    function tweenBall(frame, duration) {
        var half  = duration/2,
            pulse = frame%duration;
        return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
    }
    */

    //-------------------------------------------------------------------------
    // LOAD THE MAP
    //-------------------------------------------------------------------------
  
    function setup(map) {
        var data    = map.layers[0].data,
            objects = map.layers[1].objects,
            n, obj, entity;

        for(n = 0 ; n < objects.length ; n++) {
            obj = objects[n];
            entity = setupEntity(obj);
            switch(obj.type) {
                case "player"   : player = entity; break;
                case "ball"     : ball = entity; break;
                case "playerCPU"     : playerCPU = entity; break;
            }
        }

        cells = data;
    }

    function setupEntity(obj) {
        var entity              = {};
        entity.x                = obj.x;
        entity.y                = obj.y;
        entity.x_tiles          = obj.properties.x_tiles;
        entity.y_tiles          = obj.properties.y_tiles;
        entity.dx               = 0;
        entity.dy               = 0;
        entity.gravity          = METER * (obj.properties.gravity || GRAVITY);
        entity.maxdx            = METER * (obj.properties.maxdx   || MAXDX);
        entity.maxdy            = METER * (obj.properties.maxdy   || MAXDY);
        entity.impulse          = METER * (obj.properties.impulse || IMPULSE);
        entity.accel            = entity.maxdx / (obj.properties.accel    || ACCEL);
        entity.friction         = entity.maxdx / (obj.properties.friction || FRICTION);
        entity.player           = obj.type == "player";
        entity.playerCPU        = obj.type == "playerCPU";
        entity.ball             = obj.type == "ball";
        entity.left             = obj.properties.left;
        entity.right            = obj.properties.right;
        entity.tiempo_enfadado  = timestamp();
        entity.no_rebota_time   = timestamp();
        entity.start            = { x: obj.x, y: obj.y };

        return entity;
    }

    //-------------------------------------------------------------------------
    // THE GAME LOOP
    //-------------------------------------------------------------------------
  
    var counter = 0, dt = 0, now,
        last = timestamp(),
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
  
    document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

    get("level.json", function(req) {
        setup(JSON.parse(req.responseText));
        frame();
    });

})();

