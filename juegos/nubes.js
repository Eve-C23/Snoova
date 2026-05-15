function juegoNubes(contenedor){

    contenedor.innerHTML = `
    <div id="nubesWrapper" style="
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

        <div id="nubesStage" style="
            width:1200px;
            height:920px;
            transform-origin:center center;
            display:flex;
            align-items:center;
            justify-content:center;
        ">

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
                        letter-spacing:5px;
                        text-transform:uppercase;
                        text-shadow:0 5px 12px rgba(0,0,0,.35);
                    ">
                        SNOOPY SKY JUMP ☁️
                    </h2>

                    <p style="
                        color:white;
                        margin:4px 0 0 0;
                        font-size:24px;
                        font-family:'Baloo 2', Arial;
                    ">
                        Salta entre las nubes ✨
                    </p>
                </div>

                <canvas id="nubesGame"
                width="1200"
                height="700"
                style="
                    width:1060px;
                    height:620px;
                    border-radius:35px;
                    border:4px solid rgba(255,255,255,0.85);
                    box-shadow:
                    0 0 20px #ff8fab,
                    0 0 45px rgba(168,85,247,0.55);
                    background:black;
                    cursor:pointer;
                    touch-action:none;
                    display:block;
                "></canvas>

            </div>
        </div>
    </div>
    `;

    const stage = document.getElementById("nubesStage");

    function ajustarPantalla(){

        const baseW = 1200;
        const baseH = 920;

        const disponibleW = window.innerWidth - 24;
        const disponibleH = window.innerHeight - 24;

        let escala = Math.min(
            disponibleW / baseW,
            disponibleH / baseH
        );

        stage.style.transform = `scale(${escala})`;
    }

    ajustarPantalla();

    window.addEventListener("resize", ajustarPantalla);
    window.addEventListener("orientationchange", ajustarPantalla);

    const canvas = document.getElementById("nubesGame");
    const ctx = canvas.getContext("2d");

    // =================================================
    // REINICIAR CON CLICK
    // =================================================

    canvas.addEventListener("click", ()=>{

        if(gameOver){

            sonidoGameOver.pause();
            sonidoGameOver.currentTime = 0;

            musicaFondo.pause();
            musicaFondo.currentTime = 0;

            juegoNubes(contenedor);
        }
    });

    // =================================================
    // IMAGENES
    // =================================================

    const snoopy = new Image();
    snoopy.src = "img/snoopyJump.png";

    const nube = new Image();
    nube.src = "img/nube.png";

    const estrella = new Image();
    estrella.src = "img/estrella.png";

    // =================================================
    // AUDIO
    // =================================================

    const sonidoMoneda = new Audio(
        "audio/coin.mp3"
    );

    sonidoMoneda.volume = 0.3;

    const sonidoGameOver = new Audio(
        "audio/gameover.mp3"
    );

    sonidoGameOver.volume = 0.4;

    // =================================================
    // MUSICA DE FONDO
    // =================================================

    const musicaFondo = new Audio(
        "audio/nubes.mp3"
    );

    musicaFondo.volume = 0.5;
    musicaFondo.loop = true;

    // =================================================
    // TOP SCORES
    // =================================================

    let mejoresPuntajes =
    JSON.parse(
        localStorage.getItem(
            "topScoresNubes"
        )
    ) || [];

    function guardarScore(){

        mejoresPuntajes.push(puntos);

        mejoresPuntajes.sort(
            (a,b)=> b-a
        );

        mejoresPuntajes =
        mejoresPuntajes.slice(0,5);

        localStorage.setItem(

            "topScoresNubes",

            JSON.stringify(
                mejoresPuntajes
            )
        );
    }

    // =================================================
    // JUGADOR
    // =================================================

    const jugador = {

        x: 560,
        y: 500,

        w: 120,
        h: 120,

        velY: 0,

        salto: -19,

        velocidad: 8
    };

    // =================================================
    // CONTROLES
    // =================================================

    let izquierda = false;
    let derecha = false;

    document.addEventListener("keydown", (e)=>{

        if(e.key === "ArrowLeft")
        izquierda = true;

        if(e.key === "ArrowRight")
        derecha = true;

        if(e.key === "Enter" && gameOver){

            sonidoGameOver.pause();
            sonidoGameOver.currentTime = 0;

            musicaFondo.pause();
            musicaFondo.currentTime = 0;

            juegoNubes(contenedor);
        }
    });

    document.addEventListener("keyup", (e)=>{

        if(e.key === "ArrowLeft")
        izquierda = false;

        if(e.key === "ArrowRight")
        derecha = false;
    });

    // =================================================
    // MOUSE
    // =================================================

    canvas.addEventListener("mousemove", (e)=>{

        const rect =
        canvas.getBoundingClientRect();

        const mouseX =
        (e.clientX - rect.left) *
        (1200 / rect.width);

        jugador.x =
        mouseX - jugador.w/2;
    });

    //=================================================
    // TOUCH CELULAR
    // =================================================

    canvas.addEventListener("touchmove", (e)=>{

        e.preventDefault();

        const rect =
        canvas.getBoundingClientRect();

        const touchX =
        (e.touches[0].clientX - rect.left) *
        (1200 / rect.width);

        jugador.x =
        touchX - jugador.w/2;

    }, { passive:false });

    canvas.addEventListener("touchstart", (e)=>{

        e.preventDefault();

        if(gameOver){

            sonidoGameOver.pause();
            sonidoGameOver.currentTime = 0;

            musicaFondo.pause();
            musicaFondo.currentTime = 0;

            juegoNubes(contenedor);
        }

    }, { passive:false });

    // =================================================
    // PLATAFORMAS
    // =================================================

    let plataformas = [];

    function crearPlataformas(){

        plataformas = [];

        plataformas.push({

            x: 520,
            y: 600,

            w: 180,
            h: 90
        });

        for(let i=1;i<8;i++){

            plataformas.push({

                x: Math.random()*850 + 100,

                y: i*95,

                w: 180,
                h: 90
            });
        }
    }

    crearPlataformas();

    // =================================================
    // MONEDAS
    // =================================================

    let monedas = [];
    let totalMonedas = 0;

    function crearMonedas(){

        monedas = [];

        plataformas.forEach((p, i)=>{

            if(i % 2 === 0){

                monedas.push({

                    x: p.x + 70,
                    y: p.y - 30,

                    size: 40,

                    tomada: false,

                    rotacion: Math.random()*10
                });
            }
        });
    }

    crearMonedas();

    // =================================================
    // ESTRELLAS
    // =================================================

    let estrellas = [];

    for(let i=0;i<40;i++){

        estrellas.push({

            x: Math.random()*1200,
            y: Math.random()*700,

            size: Math.random()*4 + 2,

            alpha: Math.random()*10
        });
    }

    // =================================================
    // PUNTOS
    // =================================================

    let puntos = 0;
    let altura = 0;

    // =================================================
    // DIFICULTAD
    // =================================================

    let velocidadMapa = 0.35;

    // =================================================
    // GAME OVER
    // =================================================

    let gameOver = false;

    let scoreGuardado = false;

    // =================================================
    // FONDO
    // =================================================

    function dibujarFondo(){

        let gradiente =
        ctx.createLinearGradient(
            0,0,0,700
        );

        gradiente.addColorStop(
            0,
            "#120458"
        );

        gradiente.addColorStop(
            0.5,
            "#5f0a87"
        );

        gradiente.addColorStop(
            1,
            "#a4508b"
        );

        ctx.fillStyle = gradiente;

        ctx.fillRect(
            0,
            0,
            1200,
            700
        );

        estrellas.forEach(s=>{

            s.alpha += 0.02;

            ctx.globalAlpha =
            Math.sin(s.alpha)*0.5 + 0.5;

            ctx.drawImage(
                estrella,
                s.x,
                s.y,
                s.size*4,
                s.size*4
            );
        });

        ctx.globalAlpha = 1;
    }

    // =================================================
    // PERSONAJE
    // =================================================

    function dibujarJugador(){

        ctx.drawImage(
            snoopy,
            jugador.x,
            jugador.y,
            jugador.w,
            jugador.h
        );
    }

    // =================================================
    // NUBES
    // =================================================

    function dibujarPlataformas(){

        plataformas.forEach(p=>{

            const escala = 0.20;

            ctx.drawImage(

                nube,

                p.x,

                p.y,

                nube.width * escala,

                nube.height * escala
            );
        });
    }

    // =================================================
    // MONEDAS
    // =================================================

    function dibujarMonedas(){

        monedas.forEach(m=>{

            if(m.tomada) return;

            m.rotacion += 0.08;

            ctx.fillStyle = "#ffd43b";

            ctx.beginPath();

            ctx.arc(
                m.x,
                m.y,
                m.size/2 +
                Math.sin(m.rotacion)*2,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.fillStyle = "#fff3bf";

            ctx.beginPath();

            ctx.arc(
                m.x,
                m.y,
                m.size/4,
                0,
                Math.PI*2
            );

            ctx.fill();
        });
    }

    // =================================================
    // INTERFAZ
    // =================================================

    function interfaz(){

        ctx.fillStyle =
        "rgba(255,255,255,0.08)";

        ctx.beginPath();

        ctx.roundRect(
            25,
            25,
            320,
            180,
            25
        );

        ctx.fill();

        ctx.fillStyle = "#ffd43b";

        ctx.font = "bold 28px Arial";

        ctx.fillText(
            "⭐ Puntos: " + puntos,
            45,
            70
        );

        ctx.fillStyle = "white";

        ctx.font = "bold 24px Arial";

        ctx.fillText(
            "☁️ Altura: " + altura + "m",
            45,
            115
        );

        ctx.fillStyle = "#ffd43b";

        ctx.fillText(
            "🪙 Monedas: " + totalMonedas,
            45,
            160
        );
    }

    // =================================================
    // MOVIMIENTO
    // =================================================

    function actualizar(){

        if(izquierda){

            jugador.x -=
            jugador.velocidad;
        }

        if(derecha){

            jugador.x +=
            jugador.velocidad;
        }

        if(jugador.x > 1200){

            jugador.x =
            -jugador.w;
        }

        if(jugador.x < -jugador.w){

            jugador.x = 1200;
        }

        jugador.velY += 0.42;

        jugador.y += jugador.velY;

        plataformas.forEach(p=>{

            if(

                jugador.velY > 0 &&

                jugador.x + jugador.w >
                p.x + 25 &&

                jugador.x <
                p.x + p.w &&

                jugador.y + jugador.h >
                p.y &&

                jugador.y + jugador.h <
                p.y + 25

            ){

                jugador.velY =
                jugador.salto;
            }
        });

        monedas.forEach(m=>{

            if(m.tomada) return;

            let dx =
            jugador.x +
            jugador.w/2 - m.x;

            let dy =
            jugador.y +
            jugador.h/2 - m.y;

            let distancia =
            Math.sqrt(dx*dx + dy*dy);

            if(distancia < 55){

                m.tomada = true;

                puntos += 150;

                totalMonedas++;

                sonidoMoneda.currentTime = 0;

                sonidoMoneda.play();
            }
        });

        if(jugador.y < 320){

            let diff =
            320 - jugador.y;

            jugador.y = 320;

            puntos +=
            Math.floor(diff);

            altura +=
            Math.floor(diff/12);

            plataformas.forEach(p=>{

                p.y +=
                diff * velocidadMapa;

                if(p.y > 750){

                    p.y = -90;

                    p.x =
                    Math.random()*850 + 100;
                }
            });

            monedas.forEach(m=>{

                m.y +=
                diff * velocidadMapa;

                if(m.y > 750){

                    m.y = -50;

                    m.x =
                    Math.random()*1000 + 50;

                    m.tomada = false;
                }
            });
        }

        velocidadMapa =
        0.35 +
        Math.pow(
            puntos / 4000,
            1.12
        );

        if(jugador.y > 750){

            gameOver = true;

            musicaFondo.pause();

            if(!scoreGuardado){

                guardarScore();

                scoreGuardado = true;

                sonidoGameOver.currentTime = 0;

                sonidoGameOver.play();
            }
        }
    }

    // =================================================
    // GAME OVER TRANSPARENTE
    // =================================================

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
        let panelY = 75;
        let panelW = 540;
        let panelH = 545;

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

        ctx.strokeStyle =
        "rgba(255,255,255,.35)";

        ctx.lineWidth = 2;

        ctx.stroke();

        ctx.textAlign = "center";

        ctx.fillStyle = "white";

        ctx.font =
        "bold 60px Arial";

        ctx.fillText(
            "GAME OVER",
            600,
            165
        );

        ctx.font =
        "bold 24px Arial";

        ctx.fillStyle =
        "rgba(255,255,255,.95)";

        ctx.fillText(
            "Puntos: " + puntos,
            600,
            215
        );

        ctx.fillText(
            "Monedas: " + totalMonedas,
            600,
            250
        );

        ctx.font =
        "bold 34px Arial";

        ctx.fillStyle =
        "#ffd43b";

        ctx.fillText(
            "🏆 TOP 5",
            600,
            315
        );

        ctx.font =
        "bold 25px Arial";

        ctx.fillStyle =
        "white";

        mejoresPuntajes.forEach((p,i)=>{

            ctx.fillText(
                (i+1) + ". " + p,
                600,
                360 + (i*35)
            );
        });

        ctx.font =
        "bold 18px Arial";

        ctx.fillStyle =
        "rgba(255,255,255,.92)";

        ctx.fillText(
            "Toca la pantalla o presiona Enter para reiniciar",
            600,
            585
        );

        ctx.textAlign = "start";
    }

    // =================================================
    // LOOP
    // =================================================

    function loop(){

        dibujarFondo();

        dibujarPlataformas();

        dibujarMonedas();

        dibujarJugador();

        interfaz();

        if(!gameOver){

            actualizar();

            requestAnimationFrame(loop);

        }else{

            mostrarGameOver();
        }
    }

    jugador.velY = 0;

    musicaFondo.play();

    loop();
}