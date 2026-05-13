function juegoFrutas(container){

    // =========================
    // 🎨 HTML + CSS
    // =========================
    container.innerHTML = `
        <style>

            /* ✨ FUENTE */
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

            /* 🌸 CONTENEDOR */
            .contenedor{
                min-height:100vh;
                width:100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                background:transparent;
                font-family:'Quicksand', sans-serif;
                padding:40px 25px;
                position:relative;
                overflow:visible;
            }

            /* ✨ TITULO */
            h2{
                color:#ff7cff;

                font-size:
                    clamp(35px,5vw,70px);

                letter-spacing:5px;

                margin:0 0 25px 0;

                text-align:center;

                text-shadow:
                    0 0 8px #ff7cff,
                    0 0 18px #ff7cff,
                    0 0 35px #ff7cff;
            }

            /* 💜 MARCO */
            .marcoJuego{

                width:min(78vw,980px);

                padding:14px;

                border-radius:32px;

                background:
                    linear-gradient(
                        180deg,
                        #5b1784,
                        #3c0870,
                        #25004d
                    );

                box-shadow:
                    0 0 20px rgba(255,92,255,.75),
                    0 0 45px rgba(255,92,255,.35);

                border:
                    2px solid
                    rgba(255,120,255,.55);
            }

            /* 🎮 CANVAS */
            canvas{
                width:100%;
                height:auto;
                display:block;
                border-radius:22px;
                touch-action:none;
            }

            /* 🔄 BOTON */
            .btnReiniciar{

                position:absolute;

                top:165px;

                right:40px;

                transform:none;

                border:none;

                padding:14px 25px;

                border-radius:20px;

                background:
                    linear-gradient(
                        45deg,
                        #ff8df8,
                        #d779ff
                    );

                color:white;

                font-size:20px;

                font-weight:bold;

                cursor:pointer;

                box-shadow:
                    0 0 20px
                    rgba(255,120,255,.8);

                font-family:
                    'Quicksand',
                    sans-serif;

                white-space:nowrap;
            }

            /* 📱 RESPONSIVE */
            @media(max-width:700px){

                /* 💜 MARCO */
                .marcoJuego{
                    width:96vw;
                    padding:10px;
                }

                /* ✨ TITULO */
                h2{
                    font-size:32px;
                    letter-spacing:2px;
                    margin-top:45px;
                }

                /* 🔄 BOTON */
                .btnReiniciar{

                    position:absolute;

                    top:115px;

                    right:18px;

                    transform:none;

                    font-size:16px;

                    padding:10px 18px;
                }
            }

        </style>

        <!-- 🌸 CONTENEDOR -->
        <div class="contenedor">

            <!-- 🔄 BOTON -->
            <button
                class="btnReiniciar"
                id="btnReiniciar"
            >
                Reiniciar ↻
            </button>

            <!-- ✨ TITULO -->
            <h2>
                ✨ SNOOPY SWEET SNACKS ✨
            </h2>

            <!-- 💜 MARCO -->
            <div class="marcoJuego">

                <!-- 🎮 CANVAS -->
                <canvas id="canvas"></canvas>

            </div>

        </div>
    `;

    // =========================
    // 🔄 BOTON REINICIAR
    // =========================
    document
        .getElementById("btnReiniciar")
        .addEventListener("click", () => {

            juegoFrutas(container);
        });

    // =========================
    // 🎮 CANVAS
    // =========================
    const canvas =
        document.getElementById("canvas");

    const ctx =
        canvas.getContext("2d");

    // =========================
    // ☁️ IMAGEN NUBE
    // =========================
    const imgNube = new Image();

    imgNube.src = "img/nube.png";

    // =========================
    // 🐶 IMAGEN SNOOPY
    // =========================
    const imgSnoopy = new Image();

    imgSnoopy.src = "img/snoopyCanasta.png";

    // =========================
    // 📱 RESPONSIVE
    // =========================
    function resize(){

        canvas.width =
            Math.min(
                window.innerWidth * 0.72,
                980
            );

        canvas.height =
            canvas.width * 0.62;

        // 📱 CELULAR
        if(window.innerWidth < 700){

            canvas.width =
                window.innerWidth * 0.92;

            canvas.height =
                canvas.width * 0.70;
        }
    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );

    // =========================
    // 🍓 VARIABLES
    // =========================
    let frutas = [];

    let ultimoSpawn = 0;

    const MAX_FRUTAS = 5;

    // =========================
    // 🍇 EMOJIS
    // =========================
    const frutasEmoji = [
        "🍓","🍉","🍊","🍍",
        "🍎","🥭","🥝","🍒","🫐"
    ];

    // =========================
    // 🐶 JUGADOR
    // =========================
    let jugador = {

        x:100,

        w:canvas.width * 0.12,

        h:canvas.height * 0.08,

        vel:canvas.width * 0.012,

        canastaX:100,
        canastaY:100,

        canastaW:80,
        canastaH:50
    };

    // =========================
    // ↔️ DIRECCION
    // =========================
    let direccion = "derecha";

    // =========================
    // 💖 SCORE Y VIDAS
    // =========================
    let puntos = 0;

    let vidas = 3;

    let puntajeGuardado = false;

    // =========================
    // ⌨️ TECLAS
    // =========================
    let teclas = {};

    document.addEventListener(
        "keydown",
        e => {

            teclas[e.key] = true;
        }
    );

    document.addEventListener(
        "keyup",
        e => {

            teclas[e.key] = false;
        }
    );

    // =========================
    // ☁️ NUBES
    // =========================
    let nubes = [

        {x:.08, y:.25, w:.18, vel:.00025},
        {x:.38, y:.15, w:.14, vel:.00018},
        {x:.70, y:.22, w:.16, vel:.00022},
        {x:.82, y:.37, w:.14, vel:.00016},
        {x:-.18, y:.34, w:.15, vel:.00020},
        {x:.55, y:.30, w:.13, vel:.00017}
    ];

    // =========================
    // ✨ ESTRELLAS
    // =========================
    let estrellas = [];

    for(let i=0; i<28; i++){

        estrellas.push({

            x:Math.random(),

            y:Math.random() * 0.75,

            size:
                Math.random()*1.8 + 1,

            vel:
                Math.random()*0.00018
                + 0.00008,

            brillo:
                Math.random()*0.5
                + 0.45
        });
    }

    // =========================
    // 🏆 GUARDAR SCORE
    // =========================
    function guardarPuntaje(){

        let tabla =
            JSON.parse(
                localStorage.getItem(
                    "topFrutas"
                )
            ) || [];

        tabla.push(puntos);

        tabla.sort((a,b) => b - a);

        tabla = tabla.slice(0,5);

        localStorage.setItem(
            "topFrutas",
            JSON.stringify(tabla)
        );

        return tabla;
    }

    // =========================
    // 📋 OBTENER TABLA
    // =========================
    function obtenerTabla(){

        return JSON.parse(
            localStorage.getItem(
                "topFrutas"
            )
        ) || [];
    }

    // =========================
    // 📱 TOUCH
    // =========================
    function moverConDedo(e){

        e.preventDefault();

        let rect =
            canvas.getBoundingClientRect();

        let clienteX;

        if(e.touches){

            clienteX =
                e.touches[0].clientX;
        }
        else{

            clienteX = e.clientX;
        }

        let xCanvas =

            (clienteX - rect.left)

            *

            (canvas.width / rect.width);

        let anteriorX = jugador.x;

        jugador.x =
            xCanvas - jugador.w / 2;

        // 🚫 LIMITES
        if(jugador.x < 0){

            jugador.x = 0;
        }

        if(
            jugador.x >
            canvas.width - jugador.w
        ){

            jugador.x =
                canvas.width - jugador.w;
        }

        // ↔️ DIRECCION
        if(jugador.x > anteriorX){

            direccion = "derecha";
        }

        if(jugador.x < anteriorX){

            direccion = "izquierda";
        }
    }

    // =========================
    // 📱 EVENTOS TOUCH
    // =========================
    canvas.addEventListener(
        "touchstart",
        moverConDedo,
        {passive:false}
    );

    canvas.addEventListener(
        "touchmove",
        moverConDedo,
        {passive:false}
    );

    canvas.addEventListener(
        "pointerdown",
        moverConDedo
    );

    canvas.addEventListener(
        "pointermove",
        e => {

            if(
                e.pointerType === "touch"
                ||
                e.buttons === 1
            ){
                moverConDedo(e);
            }
        }
    );

    // =========================
    // 🍓 CREAR FRUTA
    // =========================
    function crearFruta(){

        let nuevaX;

        let intentos = 0;

        do{

            nuevaX =
                Math.random()
                *
                (canvas.width - 40);

            intentos++;

        }while(

            frutas.some(
                f =>
                Math.abs(
                    f.x - nuevaX
                ) < 75
            )

            &&

            intentos < 10
        );

        let dificultad =
            Math.min(
                puntos * 0.025,
                1.4
            );

        return {

            x:nuevaX,

            y:-20,

            size:
                canvas.width * 0.04,

            vel:
                1.25
                +
                Math.random()*0.65
                +
                dificultad,

            tipo:
                frutasEmoji[
                    Math.floor(
                        Math.random()
                        *
                        frutasEmoji.length
                    )
                ]
        };
    }

    // =========================
    // 🐶 DIBUJAR SNOOPY
    // =========================
    function dibujarSnoopy(j){

        let dibujoH =
            j.h * 2.15;

        let dibujoW =
            dibujoH * 1.05;

        let dibujoX =
            j.x +
            j.w / 2 -
            dibujoW / 2;

        let dibujoY =
            j.y -
            dibujoH * 0.52;

        ctx.save();

        // 🌑 SOMBRA
        ctx.fillStyle =
            "rgba(0,0,0,.22)";

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

        // 🐶 IMAGEN
        if(
            imgSnoopy.complete
            &&
            imgSnoopy.naturalWidth > 0
        ){

            // ⬅️ VOLTEAR
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

            // ➡️ NORMAL
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

        // 🧺 HITBOX
        if(direccion === "derecha"){

            j.canastaX =
                dibujoX +
                dibujoW * 0.48;
        }
        else{

            j.canastaX =
                dibujoX +
                dibujoW * 0.12;
        }

        j.canastaY =
            dibujoY +
            dibujoH * 0.46;

        j.canastaW =
            dibujoW * 0.42;

        j.canastaH =
            dibujoH * 0.26;
    }

    // =========================
    // ✨ ESTRELLAS
    // =========================
    function dibujarEstrellas(){

        for(let i=0; i<estrellas.length; i++){

            let e = estrellas[i];

            let x =
                canvas.width * e.x;

            let y =
                canvas.height * e.y;

            ctx.save();

            ctx.globalAlpha =
                e.brillo;

            ctx.fillStyle =
                "#ffffff";

            ctx.shadowColor =
                "#ffffff";

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

                e.y =
                    Math.random() * 0.75;
            }
        }
    }

    // =========================
    // ☁️ NUBES
    // =========================
    function dibujarNubes(){

        for(let i=0; i<nubes.length; i++){

            let nube = nubes[i];

            if(
                imgNube.complete
                &&
                imgNube.naturalWidth > 0
            ){

                let ancho =
                    canvas.width * nube.w;

                let proporcion =
                    imgNube.naturalHeight
                    /
                    imgNube.naturalWidth;

                let alto =
                    ancho * proporcion;

                let x =
                    canvas.width * nube.x;

                let y =
                    canvas.height * nube.y;

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

                if(
                    x >
                    canvas.width + ancho
                ){
                    nube.x = -nube.w;
                }
            }
        }
    }

    // =========================
    // 🔁 LOOP
    // =========================
    function loop(){

        let ANCHO = canvas.width;

        let ALTO = canvas.height;

        let SUELO =
            ALTO * 0.13;

        jugador.w =
            ANCHO * 0.15;

        jugador.h =
            ALTO * 0.11;

        jugador.vel =
            ANCHO * 0.012;

        jugador.y =
            ALTO -
            SUELO -
            jugador.h;

        // 🌌 FONDO
        let grad =
            ctx.createLinearGradient(
                0,0,0,ALTO
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

        // ✨ EFECTOS
        dibujarEstrellas();

        dibujarNubes();

        // 🌱 PASTO
        ctx.fillStyle =
            "#9ee36b";

        ctx.fillRect(
            0,
            ALTO-SUELO,
            ANCHO,
            SUELO
        );

        // 🌱 DETALLES
        ctx.strokeStyle =
            "#3b8f35";

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

        // ⌨️ MOVIMIENTO
        if(
            teclas["ArrowLeft"]
            &&
            jugador.x > 0
        ){

            jugador.x -= jugador.vel;

            direccion = "izquierda";
        }

        if(
            teclas["ArrowRight"]
            &&
            jugador.x < ANCHO-jugador.w
        ){

            jugador.x += jugador.vel;

            direccion = "derecha";
        }

        // 🐶 DIBUJAR
        dibujarSnoopy(jugador);

        // 🍓 SPAWN
        let tiempoSpawn =
            Math.max(
                520,
                850 - puntos*8
            );

        if(
            frutas.length < MAX_FRUTAS
            &&
            Date.now() - ultimoSpawn >
            tiempoSpawn
        ){

            if(Math.random() < 0.75){

                frutas.push(
                    crearFruta()
                );

                ultimoSpawn = Date.now();
            }
        }

        // 🍇 FRUTAS
        for(
            let i=frutas.length-1;
            i>=0;
            i--
        ){

            let f = frutas[i];

            f.y += f.vel;

            let tamFruta =
                ANCHO * 0.04;

            ctx.font =
            `${tamFruta}px Arial`;

            ctx.textAlign = "center";

            ctx.fillText(
                f.tipo,
                f.x,
                f.y
            );

            // 🧺 CANASTA
            let tocaCanasta =

                f.x > jugador.canastaX

                &&

                f.x <
                jugador.canastaX +
                jugador.canastaW

                &&

                f.y > jugador.canastaY

                &&

                f.y <
                jugador.canastaY +
                jugador.canastaH;

            // 🐶 SNOOPY
            let tocaSnoopy =

                f.x > jugador.x

                &&

                f.x <
                jugador.x +
                jugador.w

                &&

                f.y >
                jugador.y -
                jugador.h

                &&

                f.y <
                jugador.y +
                jugador.h;

            // ✅ PUNTO
            if(
                tocaCanasta
                ||
                tocaSnoopy
            ){

                puntos++;

                frutas.splice(i,1);
            }

            // 💔 VIDA
            else if(
                f.y >= ALTO-SUELO
            ){

                vidas--;

                frutas.splice(i,1);
            }
        }

        // 📊 HUD
        ctx.textAlign = "left";

        ctx.textBaseline =
            "alphabetic";

        ctx.shadowBlur = 0;

        // 🍓 TITULO
        ctx.font =
            "bold 13px Quicksand";

        ctx.fillStyle =
            "#ffd6ff";

        ctx.fillText(
            "PUNTOS",
            38,
            28
        );

        // 🍓 SCORE
        ctx.font =
            "bold 21px Quicksand";

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            "🍓 " + puntos,
            38,
            53
        );

        // 💖 TITULO
        ctx.font =
            "bold 13px Quicksand";

        ctx.fillStyle =
            "#ffd6ff";

        ctx.fillText(
            "VIDAS",
            38,
            85
        );

        // 💖 VIDAS
        ctx.font =
            "bold 21px Quicksand";

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            "💖 " + vidas,
            38,
            110
        );

        // 💀 GAME OVER
        if(vidas <= 0){

            if(!puntajeGuardado){

                guardarPuntaje();

                puntajeGuardado = true;
            }

            let tabla =
                obtenerTabla();

            let cajaW = 430;

            let cajaH = 360;

            let cajaX =
                ANCHO/2 - cajaW/2;

            let cajaY =
                ALTO/2 - cajaH/2;

            // 💜 CAJA
            ctx.fillStyle =
                "rgba(80,0,120,.55)";

            ctx.beginPath();

            ctx.roundRect(
                cajaX,
                cajaY,
                cajaW,
                cajaH,
                22
            );

            ctx.fill();

            // ✨ BORDE
            ctx.strokeStyle =
                "rgba(255,150,255,.9)";

            ctx.lineWidth = 3;

            ctx.stroke();

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            // 💀 TITULO
            ctx.fillStyle =
                "#ffffff";

            ctx.shadowColor =
                "#ff65ff";

            ctx.shadowBlur = 18;

            ctx.font =
                "bold 34px Quicksand";

            ctx.fillText(
                "GAME OVER",
                ANCHO/2,
                cajaY + 45
            );

            ctx.shadowBlur = 0;

            // 🏆 TOP
            ctx.fillStyle =
                "#ffd84d";

            ctx.font =
                "bold 24px Quicksand";

            ctx.fillText(
                "🏆 TOP 5",
                ANCHO/2,
                cajaY + 125
            );

            // 📋 SCORES
            ctx.font =
                "bold 19px Quicksand";

            for(let i=0; i<5; i++){

                let score =

                    tabla[i] !== undefined

                    ?

                    tabla[i]

                    :

                    "---";

                ctx.fillStyle =

                    i === 0

                    ?

                    "#ffd84d"

                    :

                    "#ffffff";

                ctx.fillText(
                    `${i+1}. ${score}`,
                    ANCHO/2,
                    cajaY + 165 + (i*33)
                );
            }

            return;
        }

        requestAnimationFrame(loop);
    }

    // 🚀 INICIAR
    loop();
}