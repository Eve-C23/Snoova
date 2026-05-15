function juegoCarrera(container){

    // =========================
    // DISEÑO HTML Y CSS RESPONSIVE
    // =========================
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

            *{ box-sizing:border-box; }

            .carrera-wrap{
                width:100%;
                min-height:100dvh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:10px;
                overflow:hidden;
                font-family:'Quicksand', sans-serif;
                background:transparent;
            }

            .marcoGeneralCarrera{
                width:min(96vw,1200px);
                padding:38px;
                border-radius:38px;
                background:rgba(25,8,55,.88);
                border:4px solid rgba(255,122,246,.35);
                box-shadow:
                    0 0 25px rgba(255,0,255,.45),
                    0 0 80px rgba(138,43,226,.25);
            }

            .tituloCarrera{
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

            .subtituloCarrera{
                display:block;
                margin-top:6px;
                font-size:clamp(13px,2vw,18px);
                opacity:.9;
                letter-spacing:0;
            }

            .marcoJuegoCarrera{
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

            @media(max-width:700px){
                .carrera-wrap{ padding:6px; }

                .marcoGeneralCarrera{
                    width:96vw;
                    padding:14px;
                    border-radius:28px;
                }

                .tituloCarrera{
                    padding:14px 10px;
                    margin-bottom:14px;
                    border-radius:22px;
                    font-size:clamp(22px,7vw,34px);
                }

                .subtituloCarrera{ font-size:12px; }

                canvas{ border-radius:20px; }
            }

            @media(max-height:500px){
                .carrera-wrap{
                    align-items:flex-start;
                    padding:5px;
                }

                .marcoGeneralCarrera{
                    width:min(96vw, calc((100dvh - 20px) * 1.714));
                    padding:10px;
                    border-radius:24px;
                }

                .tituloCarrera{
                    padding:8px;
                    margin-bottom:8px;
                    border-radius:18px;
                    font-size:22px;
                }

                .subtituloCarrera{ display:none; }
            }
        </style>

        <div class="carrera-wrap">
            <div class="marcoGeneralCarrera">

                <div class="tituloCarrera">
                    SNOOPY RACE ✨
                    <span class="subtituloCarrera">
                        Toca la pantalla o presiona espacio para avanzar
                    </span>
                </div>

                <div class="marcoJuegoCarrera">
                    <canvas id="canvasCarrera"></canvas>
                </div>

            </div>
        </div>
    `;

    // =========================
    // CANVAS
    // =========================
    const canvas = document.getElementById("canvasCarrera");
    const ctx = canvas.getContext("2d");

    const ANCHO = 1200;
    const ALTO = 700;

    canvas.width = ANCHO;
    canvas.height = ALTO;

    // =========================
    // IMÁGENES
    // =========================
    const imgJugador = new Image();
    imgJugador.src = "img/Smoto.png";

    const imgSally = new Image();
    imgSally.src = "img/SAmoto.png";

    const imgCharlie = new Image();
    imgCharlie.src = "img/Cmoto.png";

    const imgWood = new Image();
    imgWood.src = "img/Wmoto.png";

    // =========================
    // AUDIO
    // =========================

    // MUSICA DE FONDO
    const musicaFondo = new Audio(
        "audio/carreras.mp3"
    );

    musicaFondo.volume = 0.5;
    musicaFondo.loop = true;

    // GAME OVER
    const sonidoGameOver = new Audio(
        "audio/gameover.mp3"
    );

    sonidoGameOver.volume = 0.7;

    // VICTORIA
    const sonidoVictoria = new Audio(
        "audio/victoria.mp3"
    );

    sonidoVictoria.volume = 0.7;

        // CONTADOR 3 2 1
    const sonidoBeep = new Audio(
        "audio/beep.mp3"
    );

    sonidoBeep.volume = 0.7;

    // SONIDO GO
    const sonidoGO = new Audio(
        "audio/go.mp3"
    );

    sonidoGO.volume = 0.8;


    // =========================
    // VARIABLES
    // =========================
    let META = ANCHO * 0.84;

    let carriles = [
        ALTO * 0.18,
        ALTO * 0.36,
        ALTO * 0.54,
        ALTO * 0.72
    ];

    let jugador = { id:"p", x:70, y:carriles[0] };

    let oponentes = [
        {id:"o1", x:70, y:carriles[1], vel:2.4},
        {id:"o2", x:70, y:carriles[2], vel:2.6},
        {id:"o3", x:70, y:carriles[3], vel:2.3}
    ];

    let inicio = true;
    let t0 = Date.now();

    let juegoActivo = true;
    let resultado = "";

    let tiempoInicio = 0;
    let tiempoFinal = 0;

    let velJugador = 0;
    let puede = true;
    let spaceLock = false;

    let estado = "inicio";
    let recordGuardado = false;

    let ultimoNumero = -1;

    // =========================
    // TABLA DE 5 MEJORES RÉCORDS
    // =========================
    function obtenerRecords(){
        return JSON.parse(localStorage.getItem("recordsCarreraSnoopy")) || [];
    }

    function guardarRecord(tiempo){
        let records = obtenerRecords();

        records.push(Number(tiempo));
        records.sort((a,b)=>a-b);
        records = records.slice(0,5);

        localStorage.setItem("recordsCarreraSnoopy", JSON.stringify(records));
    }

    function dibujarTablaRecords(){

        let records = obtenerRecords();

        ctx.fillStyle = "#ffe066";
        ctx.font = "bold 34px Quicksand";
        ctx.textAlign = "center";
        ctx.fillText("🏆 TOP 5", ANCHO/2, 370);

        ctx.font = "bold 24px Quicksand";

        if(records.length === 0){
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Aún no hay récords", ANCHO/2, 425);
        }
        else{
            records.forEach((r,i)=>{

                ctx.fillStyle = i === 0 ? "#ffe066" : "#ffffff";

                ctx.fillText(
                    `${i+1}. ${r.toFixed(1)}s`,
                    ANCHO/2,
                    420 + (i * 35)
                );
            });
        }
    }

    // =========================
// REINICIAR
// =========================
function reiniciarJuego(){

    // CORTAR GAME OVER
    sonidoGameOver.pause();

    sonidoGameOver.currentTime = 0;

    // CORTAR VICTORIA
    sonidoVictoria.pause();

    sonidoVictoria.currentTime = 0;

    // REINICIAR MUSICA
    musicaFondo.currentTime = 0;

    musicaFondo.play();

    jugador.x = 70;
    jugador.y = carriles[0];

    oponentes = [
        {id:"o1", x:70, y:carriles[1], vel:2.4},
        {id:"o2", x:70, y:carriles[2], vel:2.6},
        {id:"o3", x:70, y:carriles[3], vel:2.3}
    ];

    inicio = true;
    t0 = Date.now();

    juegoActivo = true;
    resultado = "";

    tiempoInicio = 0;
    tiempoFinal = 0;

    velJugador = 0;
    puede = true;
    spaceLock = false;

    estado = "inicio";
    recordGuardado = false;

    ultimoNumero = -1;
    canvas.style.cursor = "default";
}

    // =========================
    // MOVIMIENTO
    // =========================
    function mover(){

        if(!juegoActivo){
            return;
        }

        if(!inicio && juegoActivo && puede){

            velJugador += 4.1;
            puede = false;

            setTimeout(()=>{
                puede = true;
            },150);
        }
    }

    // =========================
    // TECLADO
    // =========================
    document.addEventListener("keydown", e=>{

        if(e.code === "Space"){

            e.preventDefault();

            if(!spaceLock){
                spaceLock = true;
                mover();
            }
        }

        if(e.code === "Enter" && estado === "final"){
            reiniciarJuego();
        }
    });

    document.addEventListener("keyup", e=>{

        if(e.code === "Space"){
            spaceLock = false;
        }
    });

    // =========================
// CLICK Y TOUCH
// =========================
canvas.addEventListener("click", ()=>{

    // INICIAR MUSICA
    if(musicaFondo.paused){

        musicaFondo.play();
    }

    if(estado === "final"){

        reiniciarJuego();
    }
    else{

        mover();
    }
});

canvas.addEventListener("touchstart", e=>{

    e.preventDefault();

    // INICIAR MUSICA
    if(musicaFondo.paused){

        musicaFondo.play();
    }

    if(estado === "final"){

        reiniciarJuego();
    }
    else{

        mover();
    }

},{passive:false});

    // =========================
    // FONDO
    // =========================
    function fondo(){

        let g = ctx.createLinearGradient(0,0,0,ALTO);

        g.addColorStop(0,"#12002f");
        g.addColorStop(0.45,"#3d0878");
        g.addColorStop(1,"#a855f7");

        ctx.fillStyle = g;
        ctx.fillRect(0,0,ANCHO,ALTO);

        ctx.fillStyle = "rgba(255,255,255,.75)";

        for(let i=0;i<60;i++){

            let x = (i * 137) % ANCHO;
            let y = (i * 91) % ALTO;

            ctx.fillRect(x,y,2,2);
        }
    }

    // =========================
    // PISTAS REDONDEADAS
    // =========================
    function dibujarPistas(){

        carriles.forEach((y,i)=>{

            let pista = ctx.createLinearGradient(40,y,ANCHO - 40,y);

            pista.addColorStop(0,"rgba(255,166,230,.60)");
            pista.addColorStop(0.5,"rgba(255,210,245,.78)");
            pista.addColorStop(1,"rgba(255,166,230,.60)");

            ctx.fillStyle = pista;

            ctx.beginPath();
            ctx.roundRect(55,y - 10,ANCHO - 120,70,20);
            ctx.fill();

            ctx.strokeStyle = "rgba(255,255,255,.35)";
            ctx.lineWidth = 2;
            ctx.stroke();

            for(let x=85; x<ANCHO-95; x+=90){

                ctx.fillStyle = "rgba(255,255,255,.88)";
                ctx.fillRect(x,y + 20,42,7);
            }

            ctx.fillStyle = "rgba(255,255,255,.32)";
            ctx.font = "22px Quicksand";
            ctx.textAlign = "left";

            ctx.fillText("✦",70,y + 15);
        });
    }

    // =========================
    // META REDONDEADA SIN BRILLO
    // =========================
    function meta(){

        let s = 20;
        let w = s * 3;
        let xMeta = Math.min(META, ANCHO - w - 70);
        let yMeta = 20;
        let hMeta = ALTO - 40;

        ctx.save();

        ctx.beginPath();
        ctx.roundRect(xMeta, yMeta, w, hMeta, 18);
        ctx.clip();

        for(let y = yMeta; y < yMeta + hMeta; y += s){

            for(let x = 0; x < w; x += s){

                let fila = Math.floor((y - yMeta) / s);
                let col = Math.floor(x / s);

                ctx.fillStyle = (fila + col) % 2 === 0 ? "#ffffff" : "#111111";

                ctx.fillRect(xMeta + x, y, s, s);
            }
        }

        ctx.restore();

        ctx.strokeStyle = "rgba(255,255,255,.65)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.roundRect(xMeta, yMeta, w, hMeta, 18);
        ctx.stroke();
    }

    // =========================
    // MOTOS
    // =========================
    function dibujar(img,x,y){

        if(img.complete && img.naturalWidth > 0){

            ctx.drawImage(
                img,
                x - 58,
                y - 35,
                116,
                90
            );
        }
    }

    // =========================
    // PANTALLA FINAL
    // =========================
    function mostrarFinal(){

        ctx.fillStyle = "rgba(0,0,0,.55)";
        ctx.fillRect(0,0,ANCHO,ALTO);

        let gradiente = ctx.createLinearGradient(260,120,950,620);

        gradiente.addColorStop(0,"rgba(89,31,112,.72)");
        gradiente.addColorStop(1,"rgba(69,21,100,.72)");

        ctx.fillStyle = gradiente;

        ctx.beginPath();
        ctx.roundRect(280,90,640,530,38);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,.28)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.textAlign = "center";

        ctx.fillStyle = "white";
        ctx.font = "bold 70px Quicksand";
        ctx.fillText(resultado, ANCHO/2, 195);

        ctx.fillStyle = "#ffb3f5";
        ctx.font = "bold 30px Quicksand";
        ctx.fillText("Tiempo: " + tiempoFinal + "s", ANCHO/2, 265);

        dibujarTablaRecords();

        ctx.fillStyle = "#ffffff";
        ctx.font = "22px Quicksand";

        ctx.fillText(
            "Toca la pantalla o presiona Enter para reiniciar",
            ANCHO/2,
            590
        );
    }

    // =========================
    // LOOP
    // =========================
    function loop(){

        fondo();

        ctx.strokeStyle = "#ff8df3";
        ctx.lineWidth = 5;
        ctx.shadowColor = "#ff4de1";
        ctx.shadowBlur = 14;

        ctx.strokeRect(10,10,ANCHO - 20,ALTO - 20);

        ctx.shadowBlur = 0;

        dibujarPistas();
        meta();

        if(inicio){

            let s = (Date.now() - t0) / 1000;

            let numero = Math.floor(s);

            let txt = ["3","2","1","GO!"][numero] || "";

            // =========================
            // SONIDOS DEL CONTADOR
            // =========================
            if(numero !== ultimoNumero){

                ultimoNumero = numero;

                // SONIDO 3 2 1
                if(numero >= 0 && numero <= 2){

                    sonidoBeep.currentTime = 0;
                    sonidoBeep.play();
                }

                // SONIDO GO
                if(numero === 3){

                    sonidoGO.currentTime = 0;
                    sonidoGO.play();
                }
            }

            if(s > 3){

                inicio = false;
                estado = "jugando";
                tiempoInicio = Date.now();
            }

            if(txt){

                ctx.font = "bold 90px Quicksand";
                ctx.textAlign = "center";
                ctx.fillStyle = "#ff8df3";
                ctx.shadowColor = "#ff4de1";
                ctx.shadowBlur = 25;

                ctx.fillText(txt,ANCHO/2,ALTO/2);

                ctx.shadowBlur = 0;
            }

            requestAnimationFrame(loop);
            return;
        }

        if(juegoActivo){

            jugador.x += velJugador;
            velJugador *= 0.86;

            oponentes.forEach(o=>{
                o.x += o.vel;
            });

        if(jugador.x >= META){

            juegoActivo = false;

            resultado = "YOU WIN";

            tiempoFinal = ((Date.now() - tiempoInicio) / 1000).toFixed(1);

            // CORTAR MUSICA
            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            // SONIDO VICTORIA
            sonidoVictoria.currentTime = 0;

            sonidoVictoria.play();

            if(!recordGuardado){

                guardarRecord(tiempoFinal);

                recordGuardado = true;
            }
        }

            oponentes.forEach(o=>{

        if(o.x >= META && juegoActivo){

            juegoActivo = false;

            resultado = "GAME OVER";

            tiempoFinal = ((Date.now() - tiempoInicio) / 1000).toFixed(1);

            // CORTAR MUSICA
            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            // SONIDO GAME OVER
            sonidoGameOver.currentTime = 0;

            sonidoGameOver.play();

            if(!recordGuardado){

                guardarRecord(tiempoFinal);

                recordGuardado = true;
            }
        }
    });
        }

        dibujar(imgJugador,jugador.x,jugador.y);
        dibujar(imgSally,oponentes[0].x,oponentes[0].y);
        dibujar(imgCharlie,oponentes[1].x,oponentes[1].y);
        dibujar(imgWood,oponentes[2].x,oponentes[2].y);

        if(!juegoActivo){

            estado = "final";
            canvas.style.cursor = "pointer";
            mostrarFinal();

            requestAnimationFrame(loop);
            return;
        }

        if(!inicio){

            let tiempoActual;

            if(juegoActivo){
                tiempoActual = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
            }
            else{
                tiempoActual = tiempoFinal;
            }

            ctx.font = "26px Quicksand";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";

            ctx.fillText("⏱️ " + tiempoActual + "s",30,40);
        }

        requestAnimationFrame(loop);
    }

    // =========================
    // INICIAR
    // =========================
    musicaFondo.play();
    loop();
}