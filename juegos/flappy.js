// =====================================
// JUEGO FLAPPY SNOOPY
// =====================================

function juegoFlappySnoopy(contenedor){

    contenedor.innerHTML = `
    <div id="skyWrapper" style="
        width:100%;
        min-height:100dvh;
        display:flex;
        justify-content:center;
        align-items:center;
        overflow:hidden;
        box-sizing:border-box;
        padding:12px;
        user-select:none;
        font-family:'Baloo 2', Arial;
    ">

        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" rel="stylesheet">

        <div id="skyStage" style="
            width:1200px;
            height:920px;
            transform-origin:center center;
            display:flex;
            align-items:center;
            justify-content:center;
        ">

            <!-- CUADRO PRINCIPAL -->
            <div style="
                width:1120px;
                padding:28px;
                border-radius:42px;
                background:linear-gradient(180deg,
                    rgba(16,0,34,.96),
                    rgba(41,5,86,.95),
                    rgba(26,9,74,.96)
                );
                border:5px solid rgba(236,72,255,.45);
                box-shadow:
                0 0 22px rgba(236,72,255,.45),
                inset 0 0 25px rgba(255,255,255,.04);
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:22px;
            ">

                <!-- TITULO -->
                <div style="
                    width:100%;
                    text-align:center;
                    background:#f472d0;
                    border-radius:28px;
                    padding:18px 10px 12px 10px;
                    box-sizing:border-box;
                    box-shadow:0 10px 30px rgba(0,0,0,.25);
                ">

                    <h2 style="
                        font-family:'Baloo 2', Arial;
                        color:white;
                        margin:0;
                        font-size:58px;
                        letter-spacing:6px;
                        text-transform:uppercase;
                        text-shadow:0 5px 12px rgba(0,0,0,.35);
                    ">
                        SNOOPY SKY ✨
                    </h2>

                    <p style="
                        color:white;
                        margin:4px 0 0 0;
                        font-size:24px;
                        font-family:'Baloo 2', Arial;
                    ">
                        Vuela en tu avión de papel
                    </p>
                </div>

                <!-- CANVAS -->
                <canvas id="flappySnoopy"
                width="1200"
                height="700"
                style="
                    width:1060px;
                    height:620px;
                    border-radius:35px;
                    border:4px solid rgba(255,255,255,.08);
                    box-shadow:
                    0 0 20px #ff8fab,
                    0 0 45px rgba(168,85,247,0.55);
                    background:rgba(255,255,255,.82);
                    display:block;
                    touch-action:none;
                "></canvas>

            </div>
        </div>
    </div>
    `;

    const stage =
    document.getElementById("skyStage");

    // =====================================
    // AJUSTAR PANTALLA
    // =====================================

    function ajustarPantalla(){

        const baseW = 1200;
        const baseH = 920;

        const disponibleW =
        window.innerWidth - 24;

        const disponibleH =
        window.innerHeight - 24;

        let escala = Math.min(
            disponibleW / baseW,
            disponibleH / baseH
        );

        stage.style.transform =
        `scale(${escala})`;
    }

    ajustarPantalla();

    window.addEventListener(
        "resize",
        ajustarPantalla
    );

    window.addEventListener(
        "orientationchange",
        ajustarPantalla
    );

    const canvas =
    document.getElementById(
        "flappySnoopy"
    );

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

    const musicaFondo =
    new Audio("audio/flappy.mp3");

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

        if(e.code === "Enter" && gameOver){

            sonidoGameOver.pause();

            sonidoGameOver.currentTime = 0;

            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            juegoFlappySnoopy(contenedor);
        }
    });

    canvas.addEventListener("click",()=>{

        if(gameOver){

            sonidoGameOver.pause();

            sonidoGameOver.currentTime = 0;

            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            juegoFlappySnoopy(contenedor);

            return;
        }

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

            sonidoGameOver.pause();

            sonidoGameOver.currentTime = 0;

            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            juegoFlappySnoopy(contenedor);

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
    // EDIFICIOS CON LUCES
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

            // LUCES SUPERIOR

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

            // LUCES INFERIOR

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
    // INTERFAZ
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

        // PANTALLA INICIAL

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

            if(

                !o.pasado &&
                o.x + o.ancho < jugador.x

            ){

                o.pasado = true;

                puntos++;

                sonidoPunto.currentTime = 0;

                sonidoPunto.play();
            }

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

        ctx.fillStyle =
        "rgba(0,0,0,.55)";

        ctx.fillRect(
            0,
            0,
            1200,
            700
        );

        let panelX = 330;
        let panelY = 95;
        let panelW = 540;
        let panelH = 500;

        // PANEL TRANSPARENTE

        let gradiente =
        ctx.createLinearGradient(
            panelX,
            panelY,
            panelX,
            panelY + panelH
        );

        gradiente.addColorStop(
            0,
            "rgba(115,70,170,.45)"
        );

        gradiente.addColorStop(
            1,
            "rgba(55,25,90,.38)"
        );

        ctx.fillStyle = gradiente;

        ctx.beginPath();

        ctx.roundRect(
            panelX,
            panelY,
            panelW,
            panelH,
            28
        );

        ctx.fill();

        // BORDE

        ctx.strokeStyle =
        "rgba(255,255,255,.35)";

        ctx.lineWidth = 2;

        ctx.stroke();

        // TITULO

        ctx.textAlign = "center";

        ctx.fillStyle = "white";

        ctx.font =
        "bold 60px Arial";

        ctx.fillText(
            "GAME OVER",
            600,
            185
        );

        // PUNTOS

        ctx.font =
        "bold 24px Arial";

        ctx.fillStyle =
        "rgba(255,255,255,.95)";

        ctx.fillText(
            "Puntos: " + puntos,
            600,
            235
        );

        // TOP 5

        ctx.font =
        "bold 34px Arial";

        ctx.fillStyle =
        "#ffd43b";

        ctx.fillText(
            "🏆 TOP 5",
            600,
            295
        );

        // TABLA

        ctx.font =
        "bold 25px Arial";

        ctx.fillStyle =
        "white";

        mejoresPuntajes.forEach((p,i)=>{

            ctx.fillText(
                (i+1) + ". " + p,
                600,
                340 + (i*35)
            );
        });

        // TEXTO FINAL

        ctx.font =
        "bold 18px Arial";

        ctx.fillStyle =
        "rgba(255,255,255,.92)";

        ctx.fillText(
            "Toca la pantalla o presiona Enter para reiniciar",
            600,
            560
        );

        ctx.textAlign = "start";
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