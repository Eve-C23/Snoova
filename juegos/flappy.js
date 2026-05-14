function juegoFlappySnoopy(contenedor){

    contenedor.innerHTML = `
    <div style="
        text-align:center;
        position:relative;
        user-select:none;
    ">

    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" rel="stylesheet">

    <!-- TITULO -->

    <div style="
        width:40%;
        margin:auto;
        margin-bottom:18px;

        background:
        linear-gradient(
            135deg,
            rgba(22,6,45,.95),
            rgba(58,13,122,.95),
            rgba(124,58,237,.92)
        );

        border-radius:25px;

        padding:8px;

        border:
        2px solid rgba(255,255,255,.08);

        box-shadow:
        0 10px 45px rgba(0,0,0,.45),
        inset 0 0 20px rgba(255,255,255,.04);
    ">

        <h2 style="
            font-family:'Baloo 2', Arial;
            color:white;

            margin:0;

            font-size:50px;

            letter-spacing:4px;

            text-transform:uppercase;

            text-shadow:
            0 8px 18px rgba(0,0,0,.45);
        ">
            SNOOPY SKY
        </h2>

        <p style="
            color:rgba(255,255,255,.82);
            touch-action:none;
            cursor:pointer;

            margin-top:5px;

            font-size:28px;

            font-family:'Baloo 2', Arial;
        ">
            Vuela en tu avión de papel ✨
        </p>

    </div>

    <!-- CANVAS -->

    <canvas id="flappySnoopy"
    width="1200"
    height="700"
    style="
        border-radius:35px;

        border:
        4px solid rgba(255,255,255,.08);

        box-shadow:
        0 0 20px #ff8fab,
        0 0 45px rgba(168,85,247,0.55);
        background:rgba(255,255,255,.82);
    "></canvas>

    </div>
    `;

    const canvas =
    document.getElementById("flappySnoopy");

    const ctx =
    canvas.getContext("2d");

    // =====================================
    // IMAGENES
    // =====================================

    const snoopy = new Image();

    snoopy.src =
    "img/snoopyFly3.png";

    const nube = new Image();

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

    // =================================================
    // MUSICA DE FONDO
    // =================================================

        const musicaFondo = new Audio(
            "audio/musica.mp3"
        );

        musicaFondo.volume = 0.7;

        // para que se repita sola
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

            x: Math.random()*1200,

            y: Math.random()*700,

            size: Math.random()*2 + 1,

            alpha: Math.random()*10
        });
    }

    // =====================================
    // NUBES
    // =====================================

    for(let i=0;i<8;i++){

        nubes.push({

            x: Math.random()*1400,

            y: Math.random()*420,

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

            x: 1300,

            ancho: 170,

            arriba: arriba,

            abajo:
            700 - arriba - espacio,

            pasado:false
        });
    }

    setInterval(()=>{

        if(iniciado && !gameOver){

            crearObstaculo();
        }

    },3000);

    // =====================================
    // CONTROLES
    // =====================================

    document.addEventListener("keydown",(e)=>{

        if(e.code === "Space"){

            saltar();
        }
    });

    canvas.addEventListener("click",()=>{

    if(gameOver){

        // detener game over
        sonidoGameOver.pause();

        sonidoGameOver.currentTime = 0;

        // detener musica vieja
        musicaFondo.pause();

        musicaFondo.currentTime = 0;

        juegoFlappySnoopy(contenedor);

        return;
    }

    // iniciar musica solo al empezar
    if(!iniciado){

        musicaFondo.play();
    }

    saltar();
});


     // =====================================
    // TOUCH CELULAR
    // =====================================

    canvas.addEventListener("touchstart",(e)=>{

    e.preventDefault();

    if(gameOver){

        // detener game over
        sonidoGameOver.pause();

        sonidoGameOver.currentTime = 0;

        // detener musica vieja
        musicaFondo.pause();

        musicaFondo.currentTime = 0;

        juegoFlappySnoopy(contenedor);

        return;
    }

    // iniciar musica al tocar
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
            "#f39adb"
        );

        ctx.fillStyle = gradiente;

        ctx.fillRect(
            0,
            0,
            1200,
            700
        );

        // GLOW

        let glow =
        ctx.createRadialGradient(
            600,
            350,
            50,
            600,
            350,
            650
        );

        glow.addColorStop(
            0,
            "rgba(255,255,255,.08)"
        );

        glow.addColorStop(
            1,
            "transparent"
        );

        ctx.fillStyle = glow;

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

            ctx.fillStyle = "white";

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

        ctx.globalAlpha = 0.35;

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

        let piso =
        ctx.createLinearGradient(
            0,
            560,
            0,
            700
        );

        piso.addColorStop(
            0,
            "rgba(255,255,255,.04)"
        );

        piso.addColorStop(
            1,
            "rgba(255,255,255,.16)"
        );

        ctx.fillStyle = piso;

        ctx.fillRect(
            0,
            580,
            1200,
            120
        );
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
    // EDIFICIOS
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
                "#18181b"
            );

            gradienteSuperior.addColorStop(
                0.5,
                "#312e81"
            );

            gradienteSuperior.addColorStop(
                1,
                "#7c3aed"
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
                "#0f172a"
            );

            gradienteInferior.addColorStop(
                0.5,
                "#581c87"
            );

            gradienteInferior.addColorStop(
                1,
                "#db2777"
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

            // VENTANAS

            for(let y=22; y<o.arriba-28; y+=40){

                for(let x=18; x<o.ancho-25; x+=34){

                    const prendida =
                    Math.random() > 0.25;

                    ctx.fillStyle =
                    prendida
                    ?
                    "rgba(255,230,120,.95)"
                    :
                    "rgba(255,255,255,.05)";

                    ctx.beginPath();

                    ctx.roundRect(
                        o.x + x,
                        y,
                        18,
                        24,
                        2
                    );

                    ctx.fill();
                }
            }

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

            for(let y=700-o.abajo+22; y<685; y+=40){

                for(let x=18; x<o.ancho-25; x+=34){

                    const prendida =
                    Math.random() > 0.25;

                    ctx.fillStyle =
                    prendida
                    ?
                    "rgba(255,220,120,.95)"
                    :
                    "rgba(255,255,255,.05)";

                    ctx.beginPath();

                    ctx.roundRect(
                        o.x + x,
                        y,
                        18,
                        24,
                        2
                    );

                    ctx.fill();
                }
            }
        });
    }

    // =====================================
    // UI
    // =====================================

    function interfaz(){

        ctx.fillStyle =
        "rgba(255,255,255,.05)";

        ctx.beginPath();

        ctx.roundRect(
            25,
            25,
            250,
            95,
            24
        );

        ctx.fill();

        ctx.strokeStyle =
        "rgba(255,255,255,.08)";

        ctx.stroke();

        ctx.fillStyle = "#ffcc00";

        ctx.font =
        "bold 50px Arial";

        ctx.fillText(
            "⭐ " + puntos,
            48,
            88
        );

        if(!iniciado){

            ctx.textAlign = "center";

            ctx.fillStyle = "white";

            ctx.font =
            "bold 60px Arial";

            ctx.fillText(
                "PRESIONA ESPACIO",
                600,
                280
            );

            ctx.font =
            "bold 30px Arial";

            ctx.fillStyle =
            "rgba(255,255,255,.85)";

            ctx.fillText(
                "o haz click para empezar",
                600,
                340
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

                !o.pasado &&
                o.x + o.ancho < jugador.x

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

                hitboxX + hitboxW > o.x &&
                hitboxX < o.x + o.ancho &&

                (

                    hitboxY < o.arriba ||

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

            jugador.y < -100 ||

            jugador.y + jugador.h > 790

        ){

            if(!gameOver){

                gameOver = true;

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

    ctx.fillStyle =
    "rgba(0,0,0,.74)";

    ctx.fillRect(
        0,
        0,
        1200,
        700
    );

    // PANEL

    let gradiente =
    ctx.createLinearGradient(
        260,
        120,
        950,
        620
    );

    gradiente.addColorStop(
        0,
        "transparent"
    );

    gradiente.addColorStop(
        1,
        "transparent"
    );

    ctx.fillStyle = gradiente;

    ctx.beginPath();

    ctx.roundRect(
        260,
        80,
        680,
        560,
        40
    );

    ctx.fill();

    // BORDE

    ctx.strokeStyle =
    "transparent";

    ctx.lineWidth = 3;

    ctx.stroke();

    // TITULO

    ctx.textAlign = "center";

    ctx.fillStyle = "white";

    ctx.font =
    "bold 72px Arial";

    ctx.fillText(
        "GAME OVER",
        600,
        170
    );

    // TEXTO

    ctx.font =
    "30px Arial";

    ctx.fillStyle =
    "rgba(255,255,255,.88)";

    ctx.fillText(
        "Snoopy chocó ⌯⌲",
        600,
        220
    );

    // PUNTAJE

    ctx.font =
    "bold 48px Arial";

    ctx.fillStyle =
    "#ffd43b";

    ctx.fillText(
        "⭐ " + puntos + " pts",
        600,
        290
    );

    // =====================================
    // TOP 5
    // =====================================

    ctx.font =
    "bold 36px Arial";

    ctx.fillStyle = "white";

    ctx.fillText(
        "🏆 Mejores Puntajes",
        600,
        360
    );

    // TABLA

    let tablaX = 390;

    let tablaY = 390;

    let tablaW = 420;

    let tablaH = 165;

    ctx.fillStyle =
    "rgba(0,0,0,.18)";

    ctx.beginPath();

    ctx.roundRect(
        tablaX,
        tablaY,
        tablaW,
        tablaH,
        20
    );

    ctx.fill();

    ctx.fillText(

        "Haz click para reiniciar",

        600,

        370
    );

    // PUNTAJES

    ctx.font =
    "bold 26px Arial";

    mejoresPuntajes.forEach((p,i)=>{

        // LINEA

        ctx.fillStyle =
        "rgba(255,255,255,.08)";

        ctx.fillRect(
            tablaX + 20,
            tablaY + 15 + (i*30),
            tablaW - 40,
            2
        );

        // TEXTO

        ctx.fillStyle = "white";

        ctx.fillText(

            (i+1) + ".   " +
            p + " pts",

            600,

            tablaY + 42 + (i*30)
        );

        
    });
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

        ctx.fillText(

            "Haz click para reiniciar",

            600,

            370
        );
        
    }

    

    loop();
}