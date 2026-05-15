function juegoFlappySnoopy(contenedor){

    contenedor.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

        .flappy-wrapper{
            width:100%;
            min-height:100dvh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-start;
            padding:12px;
            box-sizing:border-box;
            overflow:hidden;
            user-select:none;
            font-family:'Quicksand', sans-serif;
        }

        .flappy-title{
            width:min(92vw, 1200px);
            margin-bottom:12px;
            text-align:center;

            background:
            linear-gradient(
                135deg,
                #ff8fc7,
                #ea74c8,
                #d86dff
            );

            border-radius:30px;

            padding:14px;

            box-shadow:
            0 0 25px rgba(255,105,180,.45);

            border:
            4px solid rgba(255,255,255,.18);

            box-sizing:border-box;
        }

        .flappy-title h2{
            margin:0;
            color:white;

            font-size:
            clamp(24px,5vw,58px);

            letter-spacing:3px;

            text-shadow:
            0 4px 10px rgba(0,0,0,.28);
        }

        .flappy-title p{
            margin:2px 0 0;

            color:white;

            font-size:
            clamp(15px,2.8vw,26px);
        }

        .flappy-area{
            width:1200px;
            height:700px;

            transform-origin:
            top center;
        }

        #flappySnoopy{
            width:1200px;
            height:700px;

            display:block;

            border-radius:35px;

            border:
            4px solid rgba(255,255,255,.08);

            box-shadow:
            0 0 20px #ff8fab,
            0 0 45px rgba(168,85,247,0.55);

            background:
            rgba(255,255,255,.82);

            touch-action:none;
        }
    </style>

    <div class="flappy-wrapper">

        <!-- TITULO -->

        <div class="flappy-title">

            <h2>
                SNOOPY SKY ✨
            </h2>

            <p>
                Vuela en tu avión de papel ✨
            </p>

        </div>

        <!-- CANVAS -->

        <div class="flappy-area" id="flappyArea">

            <canvas
            id="flappySnoopy"
            width="1200"
            height="700"></canvas>

        </div>

    </div>
    `;

    const canvas =
    document.getElementById("flappySnoopy");

    const ctx =
    canvas.getContext("2d");

    const area =
    document.getElementById("flappyArea");

    // =====================================
    // ADAPTAR A CELULAR Y LAP
    // =====================================

    function ajustarPantalla(){

        const escalaX =
        (window.innerWidth - 24) / 1200;

        const escalaY =
        (window.innerHeight - 150) / 700;

        const escala =
        Math.min(
            escalaX,
            escalaY,
            1
        );

        area.style.transform =
        `scale(${escala})`;

        area.style.height =
        `${700 * escala}px`;
    }

    ajustarPantalla();

    window.addEventListener(
        "resize",
        ajustarPantalla
    );

    // =====================================
    // IMAGENES
    // =====================================

    const snoopy =
    new Image();

    snoopy.src =
    "img/snoopyFly3.png";

    const nube =
    new Image();

    nube.src =
    "img/nube2.png";

    // =====================================
    // AUDIO
    // =====================================

    const sonidoPunto =
    new Audio("audio/coin.mp3");

    sonidoPunto.volume = 0.3;

    const sonidoGameOver =
    new Audio("audio/gameover.mp3");

    sonidoGameOver.volume = 0.4;

    const musicaFondo =
    new Audio("audio/musica.mp3");

    musicaFondo.volume = 0.5;

    musicaFondo.loop = true;

    // =====================================
    // TOP SCORES
    // =====================================

    let mejoresPuntajes =
    JSON.parse(

        localStorage.getItem(
            "topScoresSnoopy"
        )

    ) || [];

    function guardarScore(){

        mejoresPuntajes.push(
            puntos
        );

        mejoresPuntajes.sort(
            (a,b)=> b-a
        );

        mejoresPuntajes =
        mejoresPuntajes.slice(0,5);

        localStorage.setItem(

            "topScoresSnoopy",

            JSON.stringify(
                mejoresPuntajes
            )
        );
    }

    // =====================================
    // JUGADOR
    // =====================================

    const jugador = {

        x: 170,
        y: 300,

        w: 260,
        h: 260,

        gravedad: 0.26,

        fuerza: -7.6,

        velY: 0
    };

    // =====================================
    // VARIABLES
    // =====================================

    let puntos = 0;

    let gameOver = false;

    let iniciado = false;

    let obstaculos = [];

    let estrellas = [];

    let nubes = [];

    // =====================================
    // ESTRELLAS
    // =====================================

    for(let i=0;i<80;i++){

        estrellas.push({

            x:
            Math.random()*1200,

            y:
            Math.random()*700,

            size:
            Math.random()*2 + 1,

            alpha:
            Math.random()*10
        });
    }

    // =====================================
    // NUBES
    // =====================================

    for(let i=0;i<8;i++){

        nubes.push({

            x:
            Math.random()*1400,

            y:
            Math.random()*420,

            escala:
            Math.random()*0.15 + 0.20,

            velocidad:
            Math.random()*0.4 + 0.15
        });
    }

    // =====================================
    // CREAR OBSTACULOS
    // =====================================

    function crearObstaculo(){

        let espacio = 430;

        let arriba =
        Math.random()*180 + 80;

        obstaculos.push({

            x:1300,

            ancho:170,

            arriba:arriba,

            abajo:
            700 - arriba - espacio,

            pasado:false
        });
    }

    const intervaloObstaculos =
    setInterval(()=>{

        if(iniciado && !gameOver){

            crearObstaculo();
        }

    },3000);

    // =====================================
    // CONTROLES
    // =====================================

    if(contenedor._flappyKeydown){

        document.removeEventListener(

            "keydown",

            contenedor._flappyKeydown
        );
    }

    contenedor._flappyKeydown =
    function(e){

        if(e.code === "Space"){

            e.preventDefault();

            saltar();
        }

        if(
            e.code === "Enter"
            &&
            gameOver
        ){

            reiniciarJuego();
        }
    };

    document.addEventListener(

        "keydown",

        contenedor._flappyKeydown
    );

    canvas.addEventListener("click",()=>{

        if(gameOver){

            reiniciarJuego();

            return;
        }

        if(!iniciado){

            musicaFondo.play();
        }

        saltar();
    });

    canvas.addEventListener(

        "touchstart",

        (e)=>{

        e.preventDefault();

        if(gameOver){

            reiniciarJuego();

            return;
        }

        if(!iniciado){

            musicaFondo.play();
        }

        saltar();

    }, { passive:false });

    function saltar(){

        if(gameOver) return;

        iniciado = true;

        jugador.velY =
        jugador.fuerza;
    }

    function reiniciarJuego(){

        clearInterval(
            intervaloObstaculos
        );

        sonidoGameOver.pause();

        sonidoGameOver.currentTime = 0;

        musicaFondo.pause();

        musicaFondo.currentTime = 0;

        window.removeEventListener(
            "resize",
            ajustarPantalla
        );

        juegoFlappySnoopy(contenedor);
    }

    // =====================================
    // FONDO
    // =====================================

    function dibujarFondo(){

        let gradiente =
        ctx.createLinearGradient(
            0,
            0,
            0,
            700
        );

        gradiente.addColorStop(
            0,
            "#14002e"
        );

        gradiente.addColorStop(
            0.35,
            "#2b0560"
        );

        gradiente.addColorStop(
            0.7,
            "#4c0dbd"
        );

        gradiente.addColorStop(
            1,
            "#f54291"
        );

        ctx.fillStyle =
        gradiente;

        ctx.fillRect(
            0,
            0,
            1200,
            700
        );

        // ESTRELLAS

        estrellas.forEach(s=>{

            s.alpha += 0.02;

            ctx.globalAlpha =
            Math.sin(s.alpha)*0.5 + 0.5;

            ctx.fillStyle =
            "white";

            ctx.beginPath();

            ctx.arc(
                s.x,
                s.y,
                s.size,
                0,
                Math.PI*2
            );

            ctx.fill();
        });

        ctx.globalAlpha = 1;

        // NUBES

        ctx.globalAlpha = 0.28;

        nubes.forEach(n=>{

            n.x -= n.velocidad;

            if(n.x < -350){

                n.x = 1300;

                n.y =
                Math.random()*420;
            }

            const ancho =
            nube.width * n.escala;

            const alto =
            nube.height * n.escala;

            ctx.drawImage(

                nube,

                n.x,

                n.y,

                ancho,

                alto
            );
        });

        ctx.globalAlpha = 1;

        // PISO

        ctx.fillStyle =
        "#234516";

        ctx.fillRect(
            0,
            615,
            1200,
            90
        );

        // BORDE PASTO

        for(let i=0;i<1200;i+=24){

            ctx.strokeStyle =
            "#1e3a12";

            ctx.lineWidth = 4;

            ctx.beginPath();

            ctx.arc(
                i,
                620,
                12,
                Math.PI,
                0
            );

            ctx.stroke();
        }
    }

    // =====================================
    // JUGADOR
    // =====================================

    function dibujarJugador(){

        ctx.save();

        ctx.translate(

            jugador.x + jugador.w/2,

            jugador.y + jugador.h/2
        );

        ctx.rotate(
            jugador.velY * 0.012
        );

        ctx.shadowColor =
        "rgba(0,0,0,.45)";

        ctx.shadowBlur = 25;

        ctx.drawImage(

            snoopy,

            -jugador.w/2,

            -jugador.h/2,

            jugador.w,

            jugador.h
        );

        ctx.restore();
    }

    // =====================================
    // OBSTACULOS
    // =====================================

    function dibujarObstaculos(){

        obstaculos.forEach(o=>{

            const gradienteSuperior =
            ctx.createLinearGradient(
                o.x,
                0,
                o.x + o.ancho,
                0
            );

            gradienteSuperior.addColorStop(
                0,
                "#33215a"
            );

            gradienteSuperior.addColorStop(
                1,
                "#6d4aff"
            );

            const gradienteInferior =
            ctx.createLinearGradient(
                o.x,
                0,
                o.x + o.ancho,
                0
            );

            gradienteInferior.addColorStop(
                0,
                "#2b124a"
            );

            gradienteInferior.addColorStop(
                1,
                "#b65cff"
            );

            // SUPERIOR

            ctx.fillStyle =
            gradienteSuperior;

            ctx.beginPath();

            ctx.roundRect(
                o.x,
                0,
                o.ancho,
                o.arriba,
                10
            );

            ctx.fill();

            // INFERIOR

            ctx.fillStyle =
            gradienteInferior;

            ctx.beginPath();

            ctx.roundRect(
                o.x,
                700 - o.abajo,
                o.ancho,
                o.abajo,
                10
            );

            ctx.fill();
        });
    }

    // =====================================
    // UI
    // =====================================

    function interfaz(){

        ctx.fillStyle =
        "rgba(255,255,255,.08)";

        ctx.beginPath();

        ctx.roundRect(
            20,
            20,
            240,
            90,
            22
        );

        ctx.fill();

        ctx.strokeStyle =
        "rgba(255,255,255,.25)";

        ctx.stroke();

        ctx.fillStyle =
        "#ffd93d";

        ctx.font =
        "bold 52px Quicksand";

        ctx.fillText(
            "⭐ " + puntos,
            48,
            82
        );

        if(!iniciado){

            ctx.textAlign = "center";

            ctx.fillStyle =
            "white";

            ctx.font =
            "bold 60px Quicksand";

            ctx.fillText(
                "PRESIONA ESPACIO",
                600,
                280
            );

            ctx.font =
            "bold 28px Quicksand";

            ctx.fillStyle =
            "rgba(255,255,255,.85)";

            ctx.fillText(
                "o toca la pantalla para empezar",
                600,
                335
            );

            ctx.textAlign = "start";
        }
    }

    // =====================================
    // ACTUALIZAR
    // =====================================

    function actualizar(){

        if(!iniciado) return;

        jugador.velY +=
        jugador.gravedad;

        jugador.y +=
        jugador.velY;

        obstaculos.forEach(o=>{

            o.x -= 3;

            // PUNTOS

            if(

                !o.pasado
                &&
                o.x + o.ancho <
                jugador.x

            ){

                o.pasado = true;

                puntos++;

                sonidoPunto.currentTime = 0;

                sonidoPunto.play();
            }

            // HITBOX

            let hitboxX =
            jugador.x + 70;

            let hitboxY =
            jugador.y + 70;

            let hitboxW =
            jugador.w - 140;

            let hitboxH =
            jugador.h - 140;

            if(

                hitboxX + hitboxW > o.x
                &&

                hitboxX < o.x + o.ancho

                &&

                (

                    hitboxY < o.arriba

                    ||

                    hitboxY + hitboxH >
                    700 - o.abajo

                )
            ){

                if(!gameOver){

                    gameOver = true;

                    musicaFondo.pause();

                    sonidoGameOver.currentTime = 0;

                    sonidoGameOver.play();

                    guardarScore();
                }
            }
        });

        obstaculos =
        obstaculos.filter(
            o => o.x > -250
        );

        // TECHO Y PISO

        if(

            jugador.y < -100

            ||

            jugador.y + jugador.h > 790

        ){

            if(!gameOver){

                gameOver = true;

                musicaFondo.pause();

                sonidoGameOver.currentTime = 0;

                sonidoGameOver.play();

                guardarScore();
            }
        }
    }

    // =====================================
    // GAME OVER
    // =====================================

    function mostrarGameOver(){

        // OSCURECER FONDO

        ctx.fillStyle =
        "rgba(10,0,20,.45)";

        ctx.fillRect(
            0,
            0,
            1200,
            700
        );

        // PANEL

        let gradiente =
        ctx.createLinearGradient(
            330,
            120,
            870,
            610
        );

        gradiente.addColorStop(
            0,
            "rgba(48,10,70,.92)"
        );

        gradiente.addColorStop(
            0.5,
            "rgba(78,22,108,.94)"
        );

        gradiente.addColorStop(
            1,
            "rgba(106,42,136,.95)"
        );

        ctx.fillStyle =
        gradiente;

        ctx.beginPath();

        ctx.roundRect(
            330,
            110,
            540,
            500,
            38
        );

        ctx.fill();

        // BORDE

        ctx.strokeStyle =
        "rgba(255,255,255,.28)";

        ctx.lineWidth = 4;

        ctx.stroke();

        // BRILLO

        let glow =
        ctx.createLinearGradient(
            330,
            110,
            330,
            610
        );

        glow.addColorStop(
            0,
            "rgba(255,255,255,.08)"
        );

        glow.addColorStop(
            1,
            "transparent"
        );

        ctx.fillStyle =
        glow;

        ctx.beginPath();

        ctx.roundRect(
            340,
            120,
            520,
            120,
            30
        );

        ctx.fill();

        // TITULO

        ctx.textAlign =
        "center";

        ctx.fillStyle =
        "white";

        ctx.font =
        "bold 70px Quicksand";

        ctx.shadowColor =
        "rgba(255,255,255,.18)";

        ctx.shadowBlur = 10;

        ctx.fillText(
            "GAME OVER",
            600,
            220
        );

        ctx.shadowBlur = 0;

        // PUNTOS

        ctx.font =
        "bold 34px Quicksand";

        ctx.fillStyle =
        "#f6b3e7";

        ctx.fillText(
            "Puntos: " + puntos,
            600,
            290
        );

        // TOP 5

        ctx.font =
        "bold 46px Quicksand";

        ctx.fillStyle =
        "#ffd93d";

        ctx.fillText(
            "🏆 TOP 5",
            600,
            370
        );

        // SCORES

        ctx.font =
        "bold 25px Quicksand";

        mejoresPuntajes.forEach((p,i)=>{

            ctx.fillStyle =

            i === 0

            ?

            "#ffe066"

            :

            "white";

            ctx.fillText(

                (i+1) + ". " +
                p + " pts",

                600,

                420 + (i*40)
            );
        });

        // TEXTO

        ctx.font =
        "24px Quicksand";

        ctx.fillStyle =
        "rgba(255,255,255,.92)";

        ctx.fillText(

            "Toca la pantalla o presiona Enter para reiniciar",

            600,

            585
        );

        ctx.textAlign =
        "start";
    }

    // =====================================
    // LOOP
    // =====================================

    function loop(){

        dibujarFondo();

        dibujarObstaculos();

        dibujarJugador();

        interfaz();

        if(!gameOver){

            actualizar();

            requestAnimationFrame(loop);

        }else{

            mostrarGameOver();
        }
    }

    loop();
}