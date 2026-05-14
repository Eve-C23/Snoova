function juegoDino(container){

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

            *{
                box-sizing:border-box;
            }

            .contenedorJuego{
                width:100%;
                min-height:100dvh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:10px;
                overflow:hidden;
                font-family:'Quicksand',sans-serif;
            }

            .marcoGeneral{
                width:min(96vw,1200px);
                padding:38px;
                border-radius:38px;
                background:rgba(25,8,55,.88);
                border:4px solid rgba(255,122,246,.35);
                box-shadow:
                    0 0 25px rgba(255,0,255,.45),
                    0 0 80px rgba(138,43,226,.25);
            }

            .tituloDino{
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

            .subtituloDino{
                display:block;
                margin-top:6px;
                font-size:clamp(13px,2vw,18px);
                opacity:.9;
                letter-spacing:0;
            }

            .marcoJuego{
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

                .contenedorJuego{
                    padding:6px;
                }

                .marcoGeneral{
                    width:96vw;
                    padding:14px;
                    border-radius:28px;
                }

                .tituloDino{
                    padding:14px 10px;
                    margin-bottom:14px;
                    border-radius:22px;
                    font-size:clamp(22px,7vw,34px);
                }

                .subtituloDino{
                    font-size:12px;
                }

                canvas{
                    border-radius:20px;
                }
            }

            @media (max-height:500px){

                .contenedorJuego{
                    align-items:flex-start;
                    padding:5px;
                }

                .marcoGeneral{
                    width:min(96vw, calc((100dvh - 20px) * 1.714));
                    padding:10px;
                    border-radius:24px;
                }

                .tituloDino{
                    padding:8px;
                    margin-bottom:8px;
                    border-radius:18px;
                    font-size:22px;
                }

                .subtituloDino{
                    display:none;
                }
            }
        </style>

        <div class="contenedorJuego">

            <div class="marcoGeneral">

                <div class="tituloDino">
                    SNOOPY RUN ✨
                    <span class="subtituloDino">
                        Toca la pantalla para saltar
                    </span>
                </div>

                <div class="marcoJuego"></div>

            </div>

        </div>
    `;

    const marcoJuego = container.querySelector(".marcoJuego");

    const canvas = document.createElement("canvas");
    marcoJuego.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const ANCHO = 1200;
    const ALTO = 700;

    canvas.width = ANCHO;
    canvas.height = ALTO;

    const imgSnoopy = new Image();
    imgSnoopy.src = "snoopy.png";

    const imgNube = new Image();
    imgNube.src = "nube.png";

    const imgObstaculo = new Image();
    imgObstaculo.src = "obstaculo.png";

    const imgRecord = new Image();
    imgRecord.src = "record.png";

    let jugador;
    let obstaculos = [];
    let monedas = [];
    let nubes = [];

    let puntos = 0;
    let coins = 0;
    let juegoActivo = true;

    let ultimoSpawn = 0;
    let ultimoCoin = 0;

    let sueloY = ALTO - 80;
    let fuerzaSalto = -24;

    let recordGuardado = false;

    let records = JSON.parse(
        localStorage.getItem("records")
    ) || [];

    function draw(img,x,y,w,h){

        if(img.complete && img.naturalWidth !== 0){

            const s = Math.min(
                w / img.width,
                h / img.height
            );

            const nw = img.width * s;
            const nh = img.height * s;

            ctx.drawImage(
                img,
                x + (w - nw) / 2,
                y + (h - nh) / 2,
                nw,
                nh
            );
        }
    }

    function init(){

        jugador = {
            x:100,
            y:sueloY - 85,
            w:85,
            h:85,
            velY:0,
            saltando:false
        };

        obstaculos = [];
        monedas = [];
        nubes = [];

        puntos = 0;
        coins = 0;

        juegoActivo = true;

        ultimoSpawn = 0;
        ultimoCoin = 0;

        recordGuardado = false;

        for(let i=0;i<5;i++){

            nubes.push({
                x:i * (ANCHO / 5),
                y:50 + Math.random() * 120,
                w:140,
                h:80,
                vel:0.3 + Math.random() * 0.3
            });
        }
    }

    function saltar(){

        if(!jugador.saltando && juegoActivo){

            jugador.velY = fuerzaSalto;
            jugador.saltando = true;
        }
    }

    window.onkeydown = function(e){

        if(e.code === "Space"){

            e.preventDefault();
            saltar();
        }

        if(e.code === "Enter" && !juegoActivo){

            init();
        }
    };

    canvas.addEventListener("touchstart",(e)=>{

        e.preventDefault();

        if(!juegoActivo){
            init();
        }else{
            saltar();
        }
    });

    canvas.addEventListener("click",()=>{

        if(!juegoActivo){
            init();
        }else{
            saltar();
        }
    });

    function fondo(){

        let grad = ctx.createLinearGradient(
            0,
            0,
            0,
            ALTO
        );

        grad.addColorStop(0,"#12002f");
        grad.addColorStop(.45,"#5b0eff");
        grad.addColorStop(1,"#ff4dff");

        ctx.fillStyle = grad;

        ctx.fillRect(
            0,
            0,
            ANCHO,
            ALTO
        );

        for(let i=0;i<45;i++){

            ctx.fillStyle = "rgba(255,255,255,.7)";

            ctx.beginPath();

            ctx.arc(
                (i*97)%ANCHO,
                (i*53)%ALTO,
                1.5,
                0,
                Math.PI*2
            );

            ctx.fill();
        }

        ctx.fillStyle = "rgba(255,255,255,.12)";

        ctx.fillRect(
            0,
            sueloY,
            ANCHO,
            ALTO - sueloY
        );

        ctx.strokeStyle = "rgba(255,255,255,.12)";

        for(let i=0;i<ANCHO;i+=40){

            ctx.beginPath();

            ctx.moveTo(i,sueloY);

            ctx.lineTo(i,ALTO);

            ctx.stroke();
        }
    }

    function dibujarMonedas(){

        monedas.forEach(m=>{

            if(m.tomada) return;

            m.rotacion += 0.08;

            ctx.fillStyle = "#ffd43b";

            ctx.beginPath();

            ctx.arc(
                m.x,
                m.y,
                m.size/2 + Math.sin(m.rotacion)*2,
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

    function guardarRecord(){

        records.push(puntos);

        records = [...new Set(records)];

        records.sort((a,b)=>b-a);

        records = records.slice(0,5);

        localStorage.setItem(
            "records",
            JSON.stringify(records)
        );
    }

    function mostrarGameOver(){

        if(!recordGuardado){

            guardarRecord();
            recordGuardado = true;
        }

        ctx.fillStyle = "rgba(0,0,0,.74)";

        ctx.fillRect(
            0,
            0,
            ANCHO,
            ALTO
        );

        let gradiente = ctx.createLinearGradient(
            260,
            120,
            950,
            620
        );

        gradiente.addColorStop(0,"rgba(255,122,246,.20)");
        gradiente.addColorStop(1,"rgba(184,77,255,.20)");

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

        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.textAlign = "center";

        ctx.fillStyle = "white";
        ctx.font = "bold 72px Quicksand";

        ctx.fillText(
            "GAME OVER",
            ANCHO/2,
            190
        );

        ctx.fillStyle = "#ffb3f5";
        ctx.font = "bold 30px Quicksand";

        ctx.fillText(
            "Puntos: " + puntos,
            ANCHO/2,
            250
        );

        ctx.fillStyle = "#ffe066";
        ctx.font = "bold 34px Quicksand";

        ctx.fillText(
            "🏆 TOP 5",
            ANCHO/2,
            320
        );

        records.slice(0,5).forEach((r,i)=>{

            ctx.fillStyle = i===0 ? "#ffd43b" : "#ffffff";
            ctx.font = "bold 26px Quicksand";

            ctx.fillText(
                (i+1)+". "+r,
                ANCHO/2,
                370 + i*42
            );
        });

        ctx.fillStyle = "#ffffff";
        ctx.font = "22px Quicksand";

        ctx.fillText(
            "Toca la pantalla o presiona Enter para reiniciar",
            ANCHO/2,
            615
        );
    }

    function loop(){

        fondo();

        nubes.forEach(n=>{

            n.x -= n.vel;

            if(n.x < -n.w){
                n.x = ANCHO;
            }

            ctx.globalAlpha = .55;

            draw(
                imgNube,
                n.x,
                n.y,
                n.w,
                n.h
            );

            ctx.globalAlpha = 1;
        });

        ctx.fillStyle = "#ffd43b";

        ctx.beginPath();

        ctx.arc(
            48,
            48,
            13,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillStyle = "#fff3bf";

        ctx.beginPath();

        ctx.arc(
            48,
            48,
            6,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "24px Quicksand";

        ctx.fillText(
            coins,
            78,
            55
        );

        draw(
            imgRecord,
            28,
            65,
            32,
            32
        );

        ctx.fillText(
            puntos,
            78,
            95
        );

        if(!juegoActivo){

            mostrarGameOver();

            requestAnimationFrame(loop);

            return;
        }

        jugador.velY += 1.2;
        jugador.y += jugador.velY;

        if(jugador.y >= sueloY - jugador.h){

            jugador.y = sueloY - jugador.h;
            jugador.saltando = false;
        }

        if(Date.now() - ultimoSpawn > 1400){

            let s = 60 + Math.random()*25;

            obstaculos.push({
                x:ANCHO,
                y:sueloY-s,
                w:s,
                h:s
            });

            ultimoSpawn = Date.now();
        }

        obstaculos.forEach(o=>{

            o.x -= 6;
        });

        if(Date.now() - ultimoCoin > 1600){

            monedas.push({
                x:ANCHO,
                y:sueloY - 120,
                size:40,
                rotacion:0,
                tomada:false
            });

            ultimoCoin = Date.now();
        }

        monedas.forEach(m=>{

            m.x -= 6;
        });

        for(let o of obstaculos){

            if(
                jugador.x < o.x+o.w &&
                jugador.x+jugador.w > o.x &&
                jugador.y < o.y+o.h &&
                jugador.y+jugador.h > o.y
            ){
                juegoActivo = false;
            }
        }

        monedas = monedas.filter(m=>{

            let hit =
                jugador.x < m.x + m.size &&
                jugador.x + jugador.w > m.x - m.size &&
                jugador.y < m.y + m.size &&
                jugador.y + jugador.h > m.y - m.size;

            if(hit){

                m.tomada = true;
                coins++;

                return false;
            }

            return true;
        });

        draw(
            imgSnoopy,
            jugador.x,
            jugador.y,
            jugador.w,
            jugador.h
        );

        obstaculos.forEach(o=>{

            draw(
                imgObstaculo,
                o.x,
                o.y,
                o.w,
                o.h
            );
        });

        dibujarMonedas();

        puntos++;

        requestAnimationFrame(loop);
    }

    init();
    loop();
}