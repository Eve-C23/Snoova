function juegoFrutas(container){

    // =========================
    // 🎨 HTML Y CSS RESPONSIVE
    // =========================
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

            *{
                box-sizing:border-box;
            }

            .contenedorFrutas{
                width:100%;
                min-height:100dvh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:10px;
                overflow:hidden;
                font-family:'Quicksand',sans-serif;
            }

            .marcoGeneralFrutas{
                width:min(96vw,1200px);
                padding:38px;
                border-radius:38px;
                background:rgba(25,8,55,.88);
                border:4px solid rgba(255,122,246,.35);
                box-shadow:
                    0 0 25px rgba(255,0,255,.45),
                    0 0 80px rgba(138,43,226,.25);
            }

            .tituloFrutas{
                width:100%;
                padding:22px 20px;
                margin-bottom:28px;
                border-radius:32px;
                text-align:center;
                background:linear-gradient(90deg,#ff8ed6,#d974ff,#ff7ac8);
                color:white;
                font-size:clamp(26px,4vw,48px);
                font-weight:700;
                letter-spacing:2px;
                text-shadow:0 3px 8px rgba(0,0,0,.28);
            }

            .subtituloFrutas{
                display:block;
                margin-top:6px;
                font-size:clamp(13px,2vw,18px);
                opacity:.9;
                letter-spacing:0;
            }

            .marcoJuegoFrutas{
                padding:0;
                border-radius:30px;
                overflow:hidden;
                background:#12072c;
            }

            canvas{
                display:block;
                width:100%;
                height:auto;
                aspect-ratio:1200 / 700;
                border-radius:30px;
                touch-action:none;
            }

            @media (max-width:700px){

                .contenedorFrutas{
                    padding:6px;
                }

                .marcoGeneralFrutas{
                    width:96vw;
                    padding:14px;
                    border-radius:28px;
                }

                .tituloFrutas{
                    padding:14px 10px;
                    margin-bottom:14px;
                    border-radius:22px;
                    font-size:clamp(22px,7vw,34px);
                }

                .subtituloFrutas{
                    font-size:12px;
                }

                canvas{
                    border-radius:20px;
                }
            }

            @media (max-height:500px){

                .contenedorFrutas{
                    align-items:flex-start;
                    padding:5px;
                }

                .marcoGeneralFrutas{
                    width:min(96vw, calc((100dvh - 20px) * 1.714));
                    padding:10px;
                    border-radius:24px;
                }

                .tituloFrutas{
                    padding:8px;
                    margin-bottom:8px;
                    border-radius:18px;
                    font-size:22px;
                }

                .subtituloFrutas{
                    display:none;
                }
            }
        </style>

        <div class="contenedorFrutas">

            <div class="marcoGeneralFrutas">

                <div class="tituloFrutas">
                    SNOOPY SWEET SNACKS ✨
                    <span class="subtituloFrutas">
                        Atrapa todas las frutas 🍓
                    </span>
                </div>

                <div class="marcoJuegoFrutas">
                    <canvas id="canvasFrutas"></canvas>
                </div>

            </div>

        </div>
    `;

    // =========================
    // 🖼️ CONFIGURACIÓN DEL CANVAS
    // =========================
    const canvas = document.getElementById("canvasFrutas");
    const ctx = canvas.getContext("2d");

    const ANCHO = 1200;
    const ALTO = 700;

    canvas.width = ANCHO;
    canvas.height = ALTO;

    // =========================
    // 🖼️ CARGA DE IMÁGENES
    // =========================
    const imgNube = new Image();
    imgNube.src = "nube.png";

    const imgSnoopy = new Image();
    imgSnoopy.src = "snoopyCanasta.png";

    // =========================
    // 🔊 AUDIOS
    // =========================

    // MUSICA DE FONDO
    const musicaFondo = new Audio(
        "audio/musica.mp3"
    );

    musicaFondo.volume = 0.5;
    musicaFondo.loop = true;

    // GAME OVER
    const sonidoGameOver = new Audio(
        "audio/gameover.mp3"
    );

    sonidoGameOver.volume = 0.7;

    // MONEDA
    const sonidoCoin = new Audio(
        "audio/coon.mp3"
    );

    sonidoCoin.volume = 0.7;

    // =========================
    // 🍓 VARIABLES DEL JUEGO
    // =========================
    let frutas = [];
    let ultimoSpawn = 0;
    const MAX_FRUTAS = 5;

    const frutasEmoji = [
        "🍓","🍉","🍊","🍍","🍎","🥭","🥝","🍒","🫐"
    ];

    let jugador = {
        x:100,
        y:0,
        w:ANCHO * 0.15,
        h:ALTO * 0.11,
        vel:ANCHO * 0.012,
        canastaX:100,
        canastaY:100,
        canastaW:80,
        canastaH:50
    };

    let direccion = "derecha";
    let puntos = 0;
    let vidas = 3;
    let juegoActivo = true;
    let puntajeGuardado = false;
    let teclas = {};

    // =========================
    // ☁️ NUBES
    // =========================
    let nubes = [
        {x:.08, y:.38, w:.18, vel:.00025},
        {x:.38, y:.30, w:.14, vel:.00018},
        {x:.70, y:.35, w:.16, vel:.00022},
        {x:.82, y:.45, w:.14, vel:.00016},
        {x:-.18, y:.43, w:.15, vel:.00020},
        {x:.55, y:.28, w:.13, vel:.00017}
    ];

    // =========================
    // ⭐ ESTRELLAS
    // =========================
    let estrellas = [];

    for(let i=0; i<28; i++){
        estrellas.push({
            x:Math.random(),
            y:Math.random() * 0.75,
            size:Math.random()*1.8 + 1,
            vel:Math.random()*0.00018 + 0.00008,
            brillo:Math.random()*0.5 + 0.45
        });
    }

    // =========================
    // ⌨️ CONTROLES CON TECLADO
    // =========================
    document.addEventListener("keydown", e => {

        teclas[e.key] = true;

        if(e.code === "Enter" && !juegoActivo){

    // CORTAR GAME OVER
    sonidoGameOver.pause();

    sonidoGameOver.currentTime = 0;

    // REINICIAR MUSICA
    musicaFondo.currentTime = 0;

    musicaFondo.play();

    juegoFrutas(container);
}
    });

    document.addEventListener("keyup", e => {
        teclas[e.key] = false;
    });

    // =========================
    // 🏆 GUARDAR PUNTAJE
    // =========================
    function guardarPuntaje(){

        let tabla = JSON.parse(
            localStorage.getItem("topFrutas")
        ) || [];

        tabla.push(puntos);

        tabla = [...new Set(tabla)];

        tabla.sort((a,b) => b - a);

        tabla = tabla.slice(0,5);

        localStorage.setItem(
            "topFrutas",
            JSON.stringify(tabla)
        );
    }

    // =========================
    // 🏆 OBTENER PUNTAJES
    // =========================
    function obtenerTabla(){

        return JSON.parse(
            localStorage.getItem("topFrutas")
        ) || [];
    }

    // =========================
    // 💀 GAME OVER IGUAL AL DINO ADAPTADO A FRUTAS
    // =========================
    function mostrarGameOver(){

        if(!puntajeGuardado){

            guardarPuntaje();
            puntajeGuardado = true;
        }

        let mejoresPuntajes = obtenerTabla();

        ctx.fillStyle = "rgba(0,0,0,.74)";

        ctx.fillRect(
            0,
            0,
            ANCHO,
            ALTO
        );

        // PANEL

        let gradiente = ctx.createLinearGradient(
            260,
            120,
            950,
            620
        );

        gradiente.addColorStop(
            0,
            "rgba(255,122,246,.20)"
        );

        gradiente.addColorStop(
            1,
            "rgba(184,77,255,.20)"
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

        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // TÍTULO

        ctx.textAlign = "center";

        ctx.fillStyle = "white";
        ctx.font = "bold 72px Quicksand";

        ctx.fillText(
            "GAME OVER",
            ANCHO/2,
            190
        );

        // PUNTAJE

        ctx.fillStyle = "#ffb3f5";
        ctx.font = "bold 30px Quicksand";

        ctx.fillText(
            "Puntos: " + puntos,
            ANCHO/2,
            250
        );

        // TOP 5

        ctx.fillStyle = "#ffe066";
        ctx.font = "bold 34px Quicksand";

        ctx.fillText(
            "🏆 TOP 5",
            ANCHO/2,
            320
        );

        // LISTA DE PUNTAJES

        mejoresPuntajes.slice(0,5).forEach((p,i)=>{

            ctx.fillStyle = i===0 ? "#ffd43b" : "#ffffff";
            ctx.font = "bold 26px Quicksand";

            ctx.fillText(
                (i+1)+". "+p+" pts",
                ANCHO/2,
                370 + i*42
            );
        });

        // TEXTO REINICIAR

        ctx.fillStyle = "#ffffff";
        ctx.font = "22px Quicksand";

        ctx.fillText(
            "Toca la pantalla o presiona Enter para reiniciar",
            ANCHO/2,
            615
        );
    }

    // =========================
    // 📱 MOVER CON DEDO O MOUSE
    // =========================
    function moverConDedo(e){

        e.preventDefault();

        if(!juegoActivo){
            juegoFrutas(container);
            return;
        }

        let rect = canvas.getBoundingClientRect();
        let clienteX;

        if(e.touches){
            clienteX = e.touches[0].clientX;
        }
        else{
            clienteX = e.clientX;
        }

        let xCanvas =
            (clienteX - rect.left) *
            (canvas.width / rect.width);

        let anteriorX = jugador.x;

        jugador.x = xCanvas - jugador.w / 2;

        if(jugador.x < 0){
            jugador.x = 0;
        }

        if(jugador.x > ANCHO - jugador.w){
            jugador.x = ANCHO - jugador.w;
        }

        if(jugador.x > anteriorX){
            direccion = "derecha";
        }

        if(jugador.x < anteriorX){
            direccion = "izquierda";
        }
    }

canvas.addEventListener(
    "touchstart",
    e => {

        // INICIAR MUSICA
        if(musicaFondo.paused){

            musicaFondo.play();
        }

        // SI ESTÁ EN GAME OVER
        if(!juegoActivo){

            sonidoGameOver.pause();
            sonidoGameOver.currentTime = 0;

            musicaFondo.currentTime = 0;
            musicaFondo.play();

            juegoFrutas(container);
            return;
        }

        moverConDedo(e);

    },
    {passive:false}
);

canvas.addEventListener(
    "touchmove",
    moverConDedo,
    {passive:false}
);

    canvas.addEventListener(
        "pointerdown",
        e => {

            // INICIAR MUSICA
            if(musicaFondo.paused){

                musicaFondo.play();
            }

            // SI ESTÁ EN GAME OVER
            if(!juegoActivo){

                sonidoGameOver.pause();
                sonidoGameOver.currentTime = 0;

                musicaFondo.currentTime = 0;
                musicaFondo.play();

                juegoFrutas(container);
                return;
            }

            moverConDedo(e);
        }
    );

    canvas.addEventListener("pointermove", e => {

        if(e.pointerType === "touch" || e.buttons === 1){
            moverConDedo(e);
        }
    });

    // =========================
    // 🍓 CREAR FRUTA
    // =========================
    function crearFruta(){

        let nuevaX;
        let intentos = 0;

        do{

            nuevaX = Math.random() * (ANCHO - 40);
            intentos++;

        }while(
            frutas.some(f => Math.abs(f.x - nuevaX) < 75) &&
            intentos < 10
        );

        let dificultad = Math.min(
            puntos * 0.025,
            1.4
        );

        return {
            x:nuevaX,
            y:-20,
            size:ANCHO * 0.04,
            vel:1.25 + Math.random()*0.65 + dificultad,
            tipo:frutasEmoji[
                Math.floor(Math.random() * frutasEmoji.length)
            ]
        };
    }

    // =========================
    // 🐶 DIBUJAR SNOOPY
    // =========================
    function dibujarSnoopy(j){

        let dibujoH = j.h * 2.15;
        let dibujoW = dibujoH * 1.05;
        let dibujoX = j.x + j.w / 2 - dibujoW / 2;
        let dibujoY = j.y - dibujoH * 0.52;

        ctx.save();

        ctx.fillStyle = "rgba(0,0,0,.22)";

        ctx.beginPath();

        ctx.ellipse(
            j.x + j.w / 2,
            j.y + j.h + 9,
            j.w * .58,
            10,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        if(imgSnoopy.complete && imgSnoopy.naturalWidth > 0){

            if(direccion === "izquierda"){

                ctx.translate(
                    dibujoX + dibujoW,
                    dibujoY
                );

                ctx.scale(-1, 1);

                ctx.drawImage(
                    imgSnoopy,
                    0,
                    0,
                    dibujoW,
                    dibujoH
                );
            }
            else{

                ctx.drawImage(
                    imgSnoopy,
                    dibujoX,
                    dibujoY,
                    dibujoW,
                    dibujoH
                );
            }
        }

        ctx.restore();

        if(direccion === "derecha"){
            j.canastaX = dibujoX + dibujoW * 0.48;
        }
        else{
            j.canastaX = dibujoX + dibujoW * 0.12;
        }

        j.canastaY = dibujoY + dibujoH * 0.46;
        j.canastaW = dibujoW * 0.42;
        j.canastaH = dibujoH * 0.26;
    }

    // =========================
    // ⭐ DIBUJAR ESTRELLAS
    // =========================
    function dibujarEstrellas(){

        for(let i=0; i<estrellas.length; i++){

            let e = estrellas[i];

            let x = ANCHO * e.x;
            let y = ALTO * e.y;

            ctx.save();

            ctx.globalAlpha = e.brillo;
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 8;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                e.size,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.restore();

            e.x += e.vel;

            if(e.x > 1.05){

                e.x = -0.05;
                e.y = Math.random() * 0.75;
            }
        }
    }

    // =========================
    // ☁️ DIBUJAR NUBES
    // =========================
    function dibujarNubes(){

        for(let i=0; i<nubes.length; i++){

            let nube = nubes[i];

            if(imgNube.complete && imgNube.naturalWidth > 0){

                let ancho = ANCHO * nube.w;
                let proporcion =
                    imgNube.naturalHeight /
                    imgNube.naturalWidth;

                let alto = ancho * proporcion;

                let x = ANCHO * nube.x;
                let y = ALTO * nube.y;

                ctx.save();
                ctx.globalAlpha = 0.68;

                ctx.drawImage(
                    imgNube,
                    x,
                    y,
                    ancho,
                    alto
                );

                ctx.restore();

                nube.x += nube.vel;

                if(x > ANCHO + ancho){
                    nube.x = -nube.w;
                }
            }
        }
    }

    // =========================
    // 🔄 LOOP PRINCIPAL
    // =========================
    function loop(){

        let SUELO = ALTO * 0.13;

        jugador.w = ANCHO * 0.15;
        jugador.h = ALTO * 0.11;
        jugador.vel = ANCHO * 0.012;
        jugador.y = ALTO - SUELO - jugador.h;

        // FONDO

        let grad = ctx.createLinearGradient(
            0,
            0,
            0,
            ALTO
        );

        grad.addColorStop(0,"#160034");
        grad.addColorStop(0.45,"#5715cf");
        grad.addColorStop(1,"#ff4fd2");

        ctx.fillStyle = grad;

        ctx.fillRect(
            0,
            0,
            ANCHO,
            ALTO
        );

        // DECORACIÓN

        dibujarEstrellas();
        dibujarNubes();

        // PISO

        ctx.fillStyle = "#9ee36b";

        ctx.fillRect(
            0,
            ALTO-SUELO,
            ANCHO,
            SUELO
        );

        ctx.strokeStyle = "#3b8f35";
        ctx.lineWidth = 4;

        for(let x=0; x<ANCHO; x+=22){

            ctx.beginPath();

            ctx.arc(
                x,
                ALTO-SUELO+5,
                12,
                Math.PI,
                Math.PI*2
            );

            ctx.stroke();
        }

        // SI YA PERDIÓ

        if(!juegoActivo){

            mostrarGameOver();
            requestAnimationFrame(loop);
            return;
        }

        // MOVIMIENTO CON FLECHAS

        if(teclas["ArrowLeft"] && jugador.x > 0){

            jugador.x -= jugador.vel;
            direccion = "izquierda";
        }

        if(teclas["ArrowRight"] && jugador.x < ANCHO-jugador.w){

            jugador.x += jugador.vel;
            direccion = "derecha";
        }

        // JUGADOR

        dibujarSnoopy(jugador);

        // CREAR FRUTAS

        let tiempoSpawn = Math.max(
            520,
            850 - puntos*8
        );

        if(
            frutas.length < MAX_FRUTAS &&
            Date.now() - ultimoSpawn > tiempoSpawn
        ){

            if(Math.random() < 0.75){

                frutas.push(crearFruta());
                ultimoSpawn = Date.now();
            }
        }

        // FRUTAS

        for(let i=frutas.length-1; i>=0; i--){

            let f = frutas[i];

            f.y += f.vel;

            let tamFruta = ANCHO * 0.04;

            ctx.font = `${tamFruta}px Arial`;
            ctx.textAlign = "center";

            ctx.fillText(
                f.tipo,
                f.x,
                f.y
            );

            let tocaCanasta =
                f.x > jugador.canastaX &&
                f.x < jugador.canastaX + jugador.canastaW &&
                f.y > jugador.canastaY &&
                f.y < jugador.canastaY + jugador.canastaH;

            let tocaSnoopy =
                f.x > jugador.x &&
                f.x < jugador.x + jugador.w &&
                f.y > jugador.y - jugador.h &&
                f.y < jugador.y + jugador.h;

            if(tocaCanasta || tocaSnoopy){

                puntos++;

                // SONIDO COIN
                sonidoCoin.currentTime = 0;

                sonidoCoin.play();

                frutas.splice(i,1);
            }
            else if(f.y >= ALTO-SUELO){

                vidas--;
                frutas.splice(i,1);
            }
        }

        // MARCADOR

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.shadowBlur = 0;

        ctx.font = "bold 18px Quicksand";
        ctx.fillStyle = "#ffd6ff";

        ctx.fillText(
            "PUNTOS",
            38,
            34
        );

        ctx.font = "bold 30px Quicksand";
        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            "🍓 " + puntos,
            38,
            70
        );

        ctx.font = "bold 18px Quicksand";
        ctx.fillStyle = "#ffd6ff";

        ctx.fillText(
            "VIDAS",
            38,
            112
        );

        ctx.font = "bold 30px Quicksand";
        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            "💖 " + vidas,
            38,
            148
        );

        // PERDER

        if(vidas <= 0){

            juegoActivo = false;

            // CORTAR MUSICA DE FONDO
            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            // EVITAR QUE SIGA SONANDO
            musicaFondo.loop = false;

            // SONIDO GAME OVER
            sonidoGameOver.currentTime = 0;

            sonidoGameOver.play();
        }

        requestAnimationFrame(loop);
    }

    // =========================
    // ▶️ INICIAR JUEGO
    // =========================

    // REINICIAR MUSICA
    musicaFondo.loop = true;

    musicaFondo.currentTime = 0;

    musicaFondo.play();
    loop();
}