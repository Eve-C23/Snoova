function juegoCarrera(container){

    // =========================
    // 🎨 DISEÑO HTML Y CSS
    // =========================
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

            .carrera-wrap{
                min-height:100dvh;
                width:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                background:transparent;
                font-family:'Quicksand', sans-serif;
                padding:10px;
                box-sizing:border-box;
                overflow:hidden;
            }

            .marcoGeneralCarrera{
                width:min(92vw, calc((100dvh - 40px) * 1.714), 1200px);
                padding:clamp(10px,1.6vw,26px);
                border-radius:34px;
                background:rgba(25,8,55,.88);
                border:4px solid rgba(255,122,246,.35);
                box-shadow:
                    0 0 25px rgba(255,0,255,.45),
                    0 0 80px rgba(138,43,226,.25);
                box-sizing:border-box;
            }

            .tituloCarrera{
                width:calc(100% - 24px);
                margin:0 auto 22px auto;
                padding:clamp(12px,1.8vw,22px) 18px;
                border-radius:32px;
                background:linear-gradient(90deg,#ff8ed6,#d974ff,#ff7ac8);
                color:white;
                text-align:center;
                font-size:clamp(24px,4vw,48px);
                font-weight:700;
                letter-spacing:2px;
                text-shadow:0 3px 8px rgba(0,0,0,.28);
                box-shadow:0 0 18px rgba(255,120,255,.45);
                box-sizing:border-box;
            }

            .subtituloCarrera{
                display:block;
                margin-top:6px;
                font-size:clamp(12px,1.6vw,17px);
                opacity:.9;
                letter-spacing:0;
            }

            .canvas-box{
                width:100%;
                aspect-ratio:1200 / 700;
                border-radius:30px;
                overflow:hidden;
                background:#12072c;
                box-shadow:0 0 22px rgba(255,105,255,.45);
            }

            canvas{
                width:100%;
                height:100%;
                display:block;
                border-radius:30px;
                touch-action:none;
            }

            @media(max-width:850px){
                .marcoGeneralCarrera{
                    width:min(96vw, calc((100dvh - 25px) * 1.714));
                    padding:8px;
                    border-radius:24px;
                }

                .tituloCarrera{
                    width:calc(100% - 12px);
                    margin-bottom:8px;
                    padding:8px 12px;
                    border-radius:20px;
                    font-size:clamp(18px,5vw,30px);
                }

                .subtituloCarrera{
                    font-size:clamp(10px,3vw,13px);
                }

                .canvas-box,
                canvas{
                    border-radius:18px;
                }
            }

            @media(orientation:landscape) and (max-height:650px){
                .marcoGeneralCarrera{
                    width:min(94vw, calc((100dvh - 20px) * 1.714));
                    padding:8px;
                }

                .tituloCarrera{
                    padding:6px 12px;
                    font-size:clamp(17px,3vw,25px);
                    margin-bottom:6px;
                }

                .subtituloCarrera{
                    display:none;
                }
            }
        </style>

        <div class="carrera-wrap">
            <div class="marcoGeneralCarrera">

                <div class="tituloCarrera">
                    SNOOPY RACE ✨
                    <span class="subtituloCarrera">
                        Toca la pantalla para avanzar
                    </span>
                </div>

                <div class="canvas-box">
                    <canvas id="canvasCarrera"></canvas>
                </div>

            </div>
        </div>
    `;

    // =========================
    // 🖼️ CANVAS 1200 x 700
    // =========================
    const canvas = document.getElementById("canvasCarrera");
    const ctx = canvas.getContext("2d");

    const ANCHO = 1200;
    const ALTO = 700;

    canvas.width = ANCHO;
    canvas.height = ALTO;

    // =========================
    // 🖼️ IMÁGENES
    // =========================
    function cargarImagen(ruta1, ruta2){
        const img = new Image();
        img.src = ruta1;

        img.onerror = function(){
            img.src = ruta2;
        };

        return img;
    }

    const imgJugador = cargarImagen("img/Smoto.png", "Smoto.png");
    const imgSally = cargarImagen("img/SAmoto.png", "SAmoto.png");
    const imgCharlie = cargarImagen("img/Cmoto.png", "Cmoto.png");
    const imgWood = cargarImagen("img/Wmoto.png", "Wmoto.png");

    // =========================
    // 🏁 VARIABLES DEL JUEGO
    // =========================
    let META = ANCHO * 0.80;

    let carriles = [
        ALTO * 0.15,
        ALTO * 0.35,
        ALTO * 0.55,
        ALTO * 0.75
    ];

    let jugador = { id:"p", x:50, y:carriles[0] };

    let oponentes = [
        {id:"o1", x:50, y:carriles[1], vel:1.4},
        {id:"o2", x:50, y:carriles[2], vel:1.5},
        {id:"o3", x:50, y:carriles[3], vel:1.3}
    ];

    let inicio = true;
    let t0 = Date.now();

    let juegoActivo = true;
    let resultado = "";

    let tiempoInicio = 0;
    let tiempoFinal = 0;

    let velJugador = 0;
    let puede = true;
    let estado = "inicio";
    let tiempoGuardado = false;

    // =========================
    // 🏆 MEJORES TIEMPOS
    // =========================
    let mejoresTiempos = JSON.parse(
        localStorage.getItem("mejoresTiemposCarrera")
    ) || [];

    function guardarTiempo(){

        if(tiempoGuardado){
            return;
        }

        let tiempoNumero = parseFloat(tiempoFinal);

        mejoresTiempos.push(tiempoNumero);
        mejoresTiempos.sort((a,b) => a - b);
        mejoresTiempos = mejoresTiempos.slice(0,5);

        localStorage.setItem(
            "mejoresTiemposCarrera",
            JSON.stringify(mejoresTiempos)
        );

        tiempoGuardado = true;
    }

    // =========================
    // 🔁 REINICIAR SOLO CON CLICK O TOUCH
    // =========================
    function reiniciarJuego(){

        jugador.x = 50;
        jugador.y = carriles[0];

        oponentes = [
            {id:"o1", x:50, y:carriles[1], vel:1.4},
            {id:"o2", x:50, y:carriles[2], vel:1.5},
            {id:"o3", x:50, y:carriles[3], vel:1.3}
        ];

        inicio = true;
        t0 = Date.now();

        juegoActivo = true;
        resultado = "";

        tiempoInicio = 0;
        tiempoFinal = 0;

        velJugador = 0;
        puede = true;
        estado = "inicio";
        tiempoGuardado = false;

        canvas.style.cursor = "default";
    }

    // =========================
    // 🏍️ AVANZAR SOLO CON CLICK O TOUCH
    // =========================
    function avanzar(){

        if(!inicio && juegoActivo && puede){

            velJugador += 2.6;
            puede = false;

            setTimeout(()=>{
                puede = true;
            },160);
        }
    }

    // =========================
    // 📱 CONTROL CON CLICK Y TOUCH
    // =========================
    function tocarPantalla(e){

        if(e){
            e.preventDefault();
        }

        if(estado === "final"){
            reiniciarJuego();
            return;
        }

        avanzar();
    }

    canvas.addEventListener("click", tocarPantalla);

    canvas.addEventListener("touchstart", tocarPantalla, {passive:false});

    // =========================
    // ⌨️ BLOQUEAR ENTER Y ESPACIO
    // =========================
    document.onkeydown = function(e){

        if(e.code === "Enter" || e.code === "Space"){
            e.preventDefault();
            return false;
        }
    };

    document.onkeyup = function(e){

        if(e.code === "Enter" || e.code === "Space"){
            e.preventDefault();
            return false;
        }
    };

    // =========================
    // 🌌 FONDO DEL JUEGO
    // =========================
    function fondo(){

        let g = ctx.createLinearGradient(0,0,0,ALTO);

        g.addColorStop(0,"#17002e");
        g.addColorStop(0.45,"#3d0878");
        g.addColorStop(1,"#a855f7");

        ctx.fillStyle = g;
        ctx.fillRect(0,0,ANCHO,ALTO);

        ctx.fillStyle = "rgba(255,255,255,.7)";

        for(let i=0;i<55;i++){

            let x = (i * 137) % ANCHO;
            let y = (i * 91) % ALTO;

            ctx.fillRect(x,y,2,2);
        }
    }

    // =========================
    // 🛣️ CARRETERAS REDONDEADAS
    // =========================
    function dibujarPistas(){

        carriles.forEach((y)=>{

            let pista = ctx.createLinearGradient(20,y,ANCHO-20,y);

            pista.addColorStop(0,"rgba(255,166,230,.60)");
            pista.addColorStop(0.5,"rgba(255,210,245,.78)");
            pista.addColorStop(1,"rgba(255,166,230,.60)");

            ctx.fillStyle = pista;

            ctx.beginPath();
            ctx.roundRect(45,y-8,ANCHO-135,70,22);
            ctx.fill();

            ctx.strokeStyle = "rgba(255,255,255,.35)";
            ctx.lineWidth = 2;
            ctx.stroke();

            for(let x=75; x<ANCHO-150; x+=90){
                ctx.fillStyle = "rgba(255,255,255,.88)";
                ctx.fillRect(x,y+23,42,7);
            }

            ctx.fillStyle = "rgba(255,255,255,.32)";
            ctx.font = "18px Quicksand";
            ctx.textAlign = "left";
            ctx.fillText("✦",62,y+17);
        });
    }

    // =========================
    // 🏁 META REDONDEADA
    // =========================
    function meta(){

        let s = 18;
        let metaW = s * 4;
        let metaH = ALTO - 60;
        let metaX = META;
        let metaY = 30;

        ctx.save();

        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.roundRect(metaX,metaY,metaW,metaH,16);
        ctx.clip();

        for(let y=metaY; y<metaY+metaH; y+=s){
            for(let x=metaX; x<metaX+metaW; x+=s){

                ctx.fillStyle =
                (((x-metaX)+(y-metaY))/s%2===0) ? "#fff" : "#111";

                ctx.fillRect(x,y,s,s);
            }
        }

        ctx.restore();

        ctx.strokeStyle = "rgba(255,255,255,.75)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(metaX,metaY,metaW,metaH,16);
        ctx.stroke();
    }

    // =========================
    // 🏍️ DIBUJAR MOTOS
    // =========================
    function dibujar(img,x,y){

        if(img.complete && img.naturalWidth > 0){

            ctx.drawImage(
                img,
                x - 52,
                y - 31,
                104,
                84
            );
        }
    }

    // =========================
    // 💀 PANTALLA FINAL
    // =========================
    function mostrarGameOver(){

        ctx.fillStyle = "rgba(0,0,0,.74)";
        ctx.fillRect(0,0,ANCHO,ALTO);

        let gradiente = ctx.createLinearGradient(260,120,950,620);

        gradiente.addColorStop(0,"rgba(255,122,246,.20)");
        gradiente.addColorStop(1,"rgba(184,77,255,.20)");

        ctx.fillStyle = gradiente;

        ctx.beginPath();
        ctx.roundRect(260,80,680,560,40);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.textAlign = "center";

        ctx.fillStyle = "white";
        ctx.font = "bold 72px Quicksand";
        ctx.fillText(resultado,ANCHO/2,170);

        ctx.fillStyle = "#ffb3f5";
        ctx.font = "bold 30px Quicksand";
        ctx.fillText("⏱ Tiempo: " + tiempoFinal + "s",ANCHO/2,235);

        ctx.fillStyle = "#ffe066";
        ctx.font = "bold 34px Quicksand";
        ctx.fillText("🏆 Mejores Tiempos",ANCHO/2,315);

        ctx.fillStyle = "rgba(0,0,0,.18)";
        ctx.beginPath();
        ctx.roundRect(390,350,420,180,20);
        ctx.fill();

        ctx.font = "bold 24px Quicksand";

        if(mejoresTiempos.length === 0){

            ctx.fillStyle = "white";
            ctx.fillText("Aún no hay tiempos",ANCHO/2,440);

        }else{

            mejoresTiempos.forEach((t,i)=>{

                ctx.fillStyle = i === 0 ? "#ffd43b" : "#ffffff";
                ctx.fillText((i+1) + ". " + t + "s",ANCHO/2,390 + i*28);
            });
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "22px Quicksand";
        ctx.fillText("Toca la pantalla para reiniciar",ANCHO/2,615);
    }

    // =========================
    // 🔄 LOOP PRINCIPAL
    // =========================
    function loop(){

        fondo();

        ctx.strokeStyle = "#ff8df3";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#ff4de1";
        ctx.shadowBlur = 14;
        ctx.strokeRect(10,10,ANCHO-20,ALTO-20);
        ctx.shadowBlur = 0;

        dibujarPistas();
        meta();

        // CUENTA REGRESIVA
        if(inicio){

            let s = (Date.now() - t0) / 1000;
            let txt = ["3","2","1","GO!"][Math.floor(s)] || "";

            if(s > 3){
                inicio = false;
                estado = "jugando";
                tiempoInicio = Date.now();
            }

            if(txt){
                ctx.font = "72px Quicksand";
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

        // LÓGICA DEL JUEGO
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
                guardarTiempo();
            }

            oponentes.forEach(o=>{

                if(o.x >= META && juegoActivo){
                    juegoActivo = false;
                    resultado = "GAME OVER";
                    tiempoFinal = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
                    guardarTiempo();
                }
            });
        }

        // PERSONAJES
        dibujar(imgJugador,jugador.x,jugador.y);
        dibujar(imgSally,oponentes[0].x,oponentes[0].y);
        dibujar(imgCharlie,oponentes[1].x,oponentes[1].y);
        dibujar(imgWood,oponentes[2].x,oponentes[2].y);

        // CRONÓMETRO
        if(!inicio){

            let tiempoActual;

            if(juegoActivo){
                tiempoActual = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
            }else{
                tiempoActual = tiempoFinal;
            }

            ctx.font = "bold 26px Quicksand";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.fillText("⏱ " + tiempoActual + "s",30,45);
        }

        // FINAL
        if(!juegoActivo){

            estado = "final";
            canvas.style.cursor = "pointer";
            mostrarGameOver();

            requestAnimationFrame(loop);
            return;
        }

        requestAnimationFrame(loop);
    }

    // =========================
    // ▶️ INICIAR JUEGO
    // =========================
    loop();
}