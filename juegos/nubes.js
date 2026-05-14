function juegoNubes(contenedor){

    contenedor.innerHTML = `
    <div style="text-align:center; position:relative;">
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" rel="stylesheet">

        <!-- TITULO MODERNO -->

        <div style="
            width:50%;
            margin:auto;
            margin-bottom:20px;

            background:linear-gradient(
                90deg,
                #c084fc,
                #f472b6
            );

            border-radius:35px;

            padding:8px;

            box-shadow:
            0 0 25px rgba(244,114,182,0.45);

        ">

        <h2 style="
                font-family:'Baloo 2', Arial;
                color:white;
                margin:0;
                font-size:50px;
                font-weight:bold;
                letter-spacing:2px;
                position:relative;
                text-shadow:
                5px 6px 0 rgba(0,0,0,.18),
                0 4px 10px rgba(0,0,0,0.25);
            ">
                SNOOPY SKY JUMP
            </h2>

            <p style="
                color:rgba(255,255,255,0.9);
                margin-top:10px;
                font-size:28px;
                font-family:'Baloo 2', Arial;
            ">
                Salta entre las nubes ☁️✨
            </p>

        </div>

        <canvas id="nubesGame"
        width="1200"
        height="700"
        style="
            border-radius:35px;
            border:4px solid rgba(255,255,255,0.85);

            box-shadow:
            0 0 20px #ff8fab,
            0 0 45px rgba(168,85,247,0.55);

            background:black;
            cursor:pointer;
            touch-action:none;
        "></canvas>

    </div>
    `;

    const canvas = document.getElementById("nubesGame");
    const ctx = canvas.getContext("2d");

    // =================================================
    // REINICIAR CON CLICK
    // =================================================

    canvas.addEventListener("click", ()=>{

        if(gameOver){

            // detener sonido game over
        sonidoGameOver.pause();

        // regresar al inicio del audio
        sonidoGameOver.currentTime = 0;

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
            "audio/musica.mp3"
        );

        musicaFondo.volume = 0.5;

        // para que se repita sola
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
    // GAME OVER
    // =================================================

    function mostrarGameOver(){

        ctx.fillStyle =
        "rgba(0,0,0,.78)";

        ctx.fillRect(
            0,
            0,
            1200,
            700
        );

        let panelX = 180;
        let panelY = 60;

        let panelW = 840;
        let panelH = 560;

        let gradiente =
        ctx.createLinearGradient(

            panelX,

            panelY,

            panelX + panelW,

            panelY
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

            panelX,

            panelY,

            panelW,

            panelH,

            35
        );

        ctx.fill();

        ctx.textAlign = "center";

        ctx.fillStyle = "white";

        ctx.font =
        "bold 76px Arial";

        ctx.fillText(

            "GAME OVER",

            600,

            145
        );

        ctx.font =
        "30px Arial";

        ctx.fillText(

            "Sigue intentando ☁️✨",

            600,

            195
        );

        ctx.font =
        "bold 42px Arial";

        ctx.fillStyle =
        "#fff3bf";

        ctx.fillText(

            "⭐ Puntos: " + puntos,

            600,

            270
        );

        ctx.fillText(

            "🪙 Monedas: " + totalMonedas,

            600,

            325
        );

    

        // =================================================
        // TOP SCORES
        // =================================================

        ctx.fillStyle = "white";

        ctx.font =
        "bold 36px Arial";

        ctx.fillText(

            "🏆 Mejores Puntajes",

            600,

            430
        );

        let tablaX = 385;
        let tablaY = 455;

        let tablaW = 430;
        let tablaH = 150;

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

        ctx.font =
        "bold 25px Arial";

mejoresPuntajes.forEach((p,i)=>{

    ctx.fillStyle =
    "rgba(255,255,255,.10)";

    ctx.fillRect(

        tablaX + 20,

        tablaY + 12 + (i*28),

        tablaW - 40,

        2
    );

    ctx.fillStyle = "white";

    ctx.fillText(

        (i+1) +
        ".   " +
        p +
        " pts",

        600,

        tablaY + 38 + (i*28)
    );
});

// =====================================
// REINICIAR ABAJO DE LA TABLA
// =====================================

ctx.font =
"bold 26px Arial";

ctx.fillStyle =
"rgba(255,255,255,.85)";

ctx.fillText(

    "Haz click para reiniciar",

    600,

    655
);
        
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