function juegoDino(container){

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&display=swap');

            .contenedorJuego{
                width:100%;
                min-height:100vh;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                padding:20px;
                box-sizing:border-box;
                font-family:'Quicksand',sans-serif;
            }

            .tituloDino{
                font-size: clamp(32px,5vw,70px);
                font-weight:700;
                margin-bottom:20px;
                background:linear-gradient(180deg,#ffffff 0%,#ffc8ff 40%,#ff7ae6 100%);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;
                text-shadow:0 0 10px #ff4dff,0 0 25px #8a2be2;
                letter-spacing:3px;
            }

            .zonaDino{
                display:flex;
                align-items:flex-start;
                gap:15px;
            }

            .marcoJuego{
                padding:18px;
                border-radius:35px;
                background:linear-gradient(145deg,rgba(255,0,255,.25),rgba(138,43,226,.25));
                border:3px solid rgba(255,255,255,.15);
                box-shadow:0 0 25px rgba(255,0,255,.4),0 0 80px rgba(138,43,226,.25);
                backdrop-filter:blur(12px);
            }

            canvas{
                display:block;
                border-radius:25px;
                max-width:100%;
                height:auto;
                touch-action:none;
            }

            .btnSalto{
                position:fixed;
                bottom:20px;
                right:20px;
                width:90px;
                height:90px;
                border:none;
                border-radius:50%;
                background:linear-gradient(180deg,#ff7af6,#b84dff);
                color:white;
                font-size:18px;
                font-family:'Quicksand',sans-serif;
                box-shadow:0 0 20px rgba(255,0,255,.6);
                z-index:999;
            }

            .btnSalto:active{
                transform:scale(.95);
            }

            .btnReiniciar{
                display:none;
                margin-top:8px;
                padding:12px 22px;
                border:none;
                border-radius:18px;
                background:linear-gradient(180deg,#ff7af6,#b84dff);
                color:white;
                font-family:'Quicksand',sans-serif;
                font-size:16px;
                box-shadow:0 0 18px rgba(255,0,255,.6);
                cursor:pointer;
            }

            .btnReiniciar:hover{
                transform:scale(1.05);
            }

            @media (min-width:900px){
                .btnSalto{
                    display:none;
                }
            }

            @media (max-width:900px){

                .zonaDino{
                    flex-direction:column;
                    align-items:center;
                }

                .btnReiniciar{
                    align-self:flex-end;
                }
            }
        </style>

        <div class="contenedorJuego">

            <div class="tituloDino">
                ✨ SNOOPY RUN ✨
            </div>

            <div class="zonaDino">

                <div class="marcoJuego"></div>

                <button class="btnReiniciar">
                    Reiniciar
                </button>

            </div>

        </div>
    `;

    const marcoJuego = container.querySelector(".marcoJuego");
    const btnReiniciar = container.querySelector(".btnReiniciar");

    const canvas = document.createElement("canvas");
    marcoJuego.appendChild(canvas);

    const btnSalto = document.createElement("button");
    btnSalto.className = "btnSalto";
    btnSalto.innerHTML = "⬆️";

    container.appendChild(btnSalto);

    const ctx = canvas.getContext("2d");

    let ANCHO, ALTO, scale, fuerzaSalto;

    function resize(){

        ANCHO = Math.min(window.innerWidth * 0.82, 1100);
        ALTO = Math.min(window.innerHeight * 0.70, 650);

        canvas.width = ANCHO;
        canvas.height = ALTO;

        scale = ANCHO / 900;

        fuerzaSalto = -24 * scale;
    }

    window.addEventListener("resize", resize);

    resize();

    const imgSnoopy = new Image();
    imgSnoopy.src = "snoopy.png";

    const imgNube = new Image();
    imgNube.src = "nube.png";

    const imgObstaculo = new Image();
    imgObstaculo.src = "obstaculo.png";

    const imgRecord = new Image();
    imgRecord.src = "record.png";

    function draw(img, x, y, w, h){

        if(img.complete && img.naturalWidth !== 0){

            const s = Math.min(w/img.width, h/img.height);

            const nw = img.width*s;
            const nh = img.height*s;

            ctx.drawImage(
                img,
                x+(w-nw)/2,
                y+(h-nh)/2,
                nw,
                nh
            );
        }
    }

    function fondo(){

        let grad = ctx.createLinearGradient(0,0,0,ALTO);

        grad.addColorStop(0,"#12002f");
        grad.addColorStop(.45,"#5b0eff");
        grad.addColorStop(1,"#ff4dff");

        ctx.fillStyle = grad;
        ctx.fillRect(0,0,ANCHO,ALTO);

        for(let i=0;i<45;i++){

            ctx.fillStyle="rgba(255,255,255,.7)";

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

        ctx.fillStyle="rgba(255,255,255,.12)";

        ctx.fillRect(
            0,
            sueloY,
            ANCHO,
            ALTO-sueloY
        );

        ctx.strokeStyle="rgba(255,255,255,.12)";

        for(let i=0;i<ANCHO;i+=40*scale){

            ctx.beginPath();

            ctx.moveTo(i,sueloY);

            ctx.lineTo(i,ALTO);

            ctx.stroke();
        }
    }

    let jugador, obstaculos, monedas, nubes;
    let puntos, coins, juegoActivo;
    let ultimoSpawn, ultimoCoin, sueloY;

    let records = JSON.parse(
        localStorage.getItem("records")
    ) || [];

    function init(){

        sueloY = ALTO - 80*scale;

        jugador = {
            x:100*scale,
            y:0,
            w:85*scale,
            h:85*scale,
            velY:0,
            saltando:false
        };

        jugador.y = sueloY - jugador.h;

        obstaculos = [];
        monedas = [];
        nubes = [];

        puntos = 0;
        coins = 0;

        juegoActivo = true;

        ultimoSpawn = 0;
        ultimoCoin = 0;

        btnReiniciar.style.display = "none";

        for(let i=0;i<5;i++){

            nubes.push({
                x:i*(ANCHO/5),
                y:50*scale + Math.random()*120*scale,
                w:140*scale,
                h:80*scale,
                vel:0.3 + Math.random()*0.3
            });
        }
    }

    function saltar(){

        if(!jugador.saltando && juegoActivo){

            jugador.velY = fuerzaSalto;
            jugador.saltando = true;
        }
    }

    // TECLADO
    window.onkeydown = function(e){

        if(e.code === "Space"){

            e.preventDefault();

            saltar();
        }

        if(e.code === "Enter"){

            if(!juegoActivo){

                init();
            }
        }
    };

    // BOTÓN CELULAR
    btnSalto.addEventListener("touchstart",(e)=>{

        e.preventDefault();

        saltar();
    });

    btnSalto.addEventListener("click",()=>{

        saltar();
    });

    // CLICK CANVAS
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

    // REINICIAR
    btnReiniciar.addEventListener("click",()=>{

        if(!juegoActivo){

            init();
        }
    });

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

    function loop(){

        fondo();

        // NUBES
        nubes.forEach(n=>{

            n.x -= n.vel;

            if(n.x < -n.w){

                n.x = ANCHO;
            }

            ctx.globalAlpha=.55;

            draw(
                imgNube,
                n.x,
                n.y,
                n.w,
                n.h
            );

            ctx.globalAlpha=1;
        });

        // MONEDA UI
        ctx.fillStyle="#ffd43b";

        ctx.beginPath();

        ctx.arc(
            48*scale,
            48*scale,
            13*scale,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillStyle="#fff3bf";

        ctx.beginPath();

        ctx.arc(
            48*scale,
            48*scale,
            6*scale,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillStyle="#fff";

        ctx.font=(24*scale)+"px Quicksand";

        ctx.fillText(
            coins,
            78*scale,
            55*scale
        );

        draw(
            imgRecord,
            28,
            65*scale,
            32*scale,
            32*scale
        );

        ctx.fillText(
            puntos,
            78*scale,
            95*scale
        );

        // GAME OVER
        if(!juegoActivo){

            btnReiniciar.style.display = "block";

            if(!window.recordGuardado){

                guardarRecord();

                window.recordGuardado = true;
            }

            const cuadroX = ANCHO*0.27;
            const cuadroY = ALTO*0.12;
            const cuadroW = ANCHO*0.46;
            const cuadroH = ALTO*0.70;

            ctx.fillStyle = "rgba(10,0,35,.96)";

            ctx.fillRect(
                cuadroX,
                cuadroY,
                cuadroW,
                cuadroH
            );

            ctx.strokeStyle = "#ff5eff";

            ctx.lineWidth = 4;

            ctx.strokeRect(
                cuadroX,
                cuadroY,
                cuadroW,
                cuadroH
            );

            ctx.textAlign = "center";

            ctx.fillStyle = "#ffffff";

            ctx.font = (38*scale)+"px Quicksand";

            ctx.fillText(
                "GAME OVER",
                ANCHO/2,
                cuadroY + 55*scale
            );

            ctx.fillStyle = "#ff7af6";

            ctx.font = (22*scale)+"px Quicksand";

            ctx.fillText(
                "Puntos: " + puntos,
                ANCHO/2,
                cuadroY + 85*scale
            );

            const tablaY = cuadroY + 110*scale;

            ctx.fillStyle = "#ffe066";

            ctx.font = (24*scale)+"px Quicksand";

            ctx.fillText(
                "🏆 TOP 5",
                ANCHO/2,
                tablaY + 35*scale
            );

            records.slice(0,5).forEach((r,i)=>{

                ctx.fillStyle =
                    i===0
                    ? "#ffd43b"
                    : "#ffffff";

                ctx.font = (18*scale)+"px Quicksand";

                ctx.fillText(
                    (i+1)+". "+r,
                    ANCHO/2,
                    tablaY + 75*scale + i*35*scale
                );
            });

            requestAnimationFrame(loop);

            return;
        }

        // FÍSICAS
        jugador.velY += 1.2*scale;

        jugador.y += jugador.velY;

        if(jugador.y >= sueloY - jugador.h){

            jugador.y = sueloY - jugador.h;

            jugador.saltando = false;
        }

        // OBSTÁCULOS
        if(Date.now()-ultimoSpawn > 1400){

            let s=(60 + Math.random()*25)*scale;

            obstaculos.push({
                x:ANCHO,
                y:sueloY-s,
                w:s,
                h:s
            });

            ultimoSpawn=Date.now();
        }

        obstaculos.forEach(o=>{

            o.x -= 6*scale;
        });

        // MONEDAS
        if(Date.now()-ultimoCoin > 1600){

            monedas.push({
                x:ANCHO,
                y:sueloY - 120*scale,
                size:40*scale,
                rotacion:0,
                tomada:false
            });

            ultimoCoin=Date.now();
        }

        monedas.forEach(m=>{

            m.x -= 6*scale;
        });

        // COLISIÓN
        for(let o of obstaculos){

            if(
                jugador.x < o.x+o.w &&
                jugador.x+jugador.w > o.x &&
                jugador.y < o.y+o.h &&
                jugador.y+jugador.h > o.y
            ){
                juegoActivo=false;
            }
        }

        // MONEDAS
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

        // DIBUJAR
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