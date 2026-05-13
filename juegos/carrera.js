function juegoCarrera(container){

    // =========================
    // DISEÑO HTML Y CSS
    // =========================
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

            .carrera-wrap{
                min-height:100vh;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                background:transparent;
                font-family:'Quicksand', sans-serif;
                padding:18px;
                box-sizing:border-box;
                overflow:hidden;
            }

            h2{
                color:#ff8df3;
                font-size:clamp(34px,6vw,58px);
                margin:0 0 16px 0;
                letter-spacing:4px;
                text-align:center;
                text-shadow:0 0 8px #ff8df3, 0 0 20px #ff4de1, 0 0 40px #c77dff;
            }

            .zona-juego{
                display:flex;
                align-items:flex-start;
                justify-content:center;
                gap:18px;
            }

            .canvas-box{
                padding:16px;
                border-radius:34px;
                background:linear-gradient(180deg,rgba(255,160,245,.18),rgba(110,30,190,.12));
                border:3px solid rgba(255,141,243,.55);
                box-shadow:0 0 25px rgba(255,105,255,.42), 0 0 55px rgba(170,80,255,.25), inset 0 0 18px rgba(255,255,255,.13);
            }

            canvas{
                display:block;
                border-radius:26px;
                touch-action:none;
                max-width:100%;
                box-shadow:0 0 22px rgba(255,105,255,.45);
            }

            .reiniciar-btn{
                border:none;
                padding:12px 20px;
                border-radius:18px;
                background:linear-gradient(135deg,#ff8de1,#d86bff);
                color:white;
                font-family:'Quicksand', sans-serif;
                font-size:16px;
                font-weight:bold;
                cursor:pointer;
                box-shadow:0 0 15px rgba(255,105,255,.45);
                margin-top:8px;
            }

            .reiniciar-btn:hover{
                transform:scale(1.05);
            }

            @media(max-width:800px){
                .zona-juego{
                    flex-direction:column;
                    align-items:center;
                }
            }
        </style>

        <div class="carrera-wrap">
            <h2>✨ SNOOPY RACE ✨</h2>

            <div class="zona-juego">
                <div class="canvas-box">
                    <canvas id="canvas"></canvas>
                </div>

                <button class="reiniciar-btn" onclick="juegoCarrera(container)">
                    Reiniciar
                </button>
            </div>
        </div>
    `;

    // =========================
    // CANVAS
    // =========================
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // =========================
    // IMÁGENES DE PERSONAJES
    // =========================
    const imgJugador = new Image();
    imgJugador.src = "Smoto.png";

    const imgSally = new Image();
    imgSally.src = "SAmoto.png";

    const imgCharlie = new Image();
    imgCharlie.src = "Cmoto.png";

    const imgWood = new Image();
    imgWood.src = "Wmoto.png";

    // =========================
    // VARIABLES DEL JUEGO
    // =========================
    let carriles = [];
    let META = 0;

    let jugador = { id:"p", x:50, y:0 };

    let oponentes = [
        {id:"o1", x:50, y:0, vel:1.4},
        {id:"o2", x:50, y:0, vel:1.5},
        {id:"o3", x:50, y:0, vel:1.3}
    ];

    let inicio = true;
    let t0 = Date.now();

    let juegoActivo = true;
    let resultado = "";

    let velJugador = 0;
    let puede = true;

    // =========================
    // AJUSTA TAMAÑO Y CARRILES
    // =========================
    function resize(){

        const maxW = Math.min(window.innerWidth * 0.82, 1120);
        const maxH = Math.min(window.innerHeight * 0.58, 520);

        canvas.width = maxW;
        canvas.height = maxH;

        META = canvas.width * 0.82;

        carriles = [
            canvas.height*0.15,
            canvas.height*0.35,
            canvas.height*0.55,
            canvas.height*0.75
        ];

        jugador.y = carriles[0];

        oponentes.forEach((o,i)=>{
            o.y = carriles[i+1];
        });
    }

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    resize();

    // =========================
    // MOVIMIENTO DEL JUGADOR
    // =========================
    function mover(){
        if(!inicio && juegoActivo && puede){
            velJugador += 2.6;
            puede = false;

            setTimeout(()=>{
                puede = true;
            },160);
        }
    }

    // =========================
    // CONTROLES CON TECLADO
    // =========================
    let spaceLock = false;

    document.addEventListener("keydown", e=>{
        if(e.code==="Space"){
            e.preventDefault();

            if(!spaceLock){
                spaceLock = true;
                mover();
            }
        }
    });

    document.addEventListener("keyup", e=>{
        if(e.code==="Space"){
            spaceLock = false;
        }
    });

    // =========================
    // CONTROLES CON CLICK Y TOUCH
    // =========================
    canvas.addEventListener("click", mover);

    canvas.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        mover();
    },{passive:false});

    // =========================
    // FONDO DEL JUEGO
    // =========================
    function fondo(){

        let g = ctx.createLinearGradient(0,0,0,canvas.height);

        g.addColorStop(0,"#17002e");
        g.addColorStop(0.45,"#3d0878");
        g.addColorStop(1,"#a855f7");

        ctx.fillStyle = g;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="rgba(255,255,255,.7)";

        for(let i=0;i<55;i++){
            let x = (i * 137) % canvas.width;
            let y = (i * 91) % canvas.height;
            ctx.fillRect(x,y,2,2);
        }
    }

    // =========================
    // META
    // =========================
    function meta(){

        let s = 18;
        let w = s * 3;

        ctx.shadowColor="#ffffff";
        ctx.shadowBlur=12;

        for(let y=0;y<canvas.height;y+=s){
            for(let x=0;x<w;x+=s){
                ctx.fillStyle = ((x+y)/s%2===0) ? "#fff" : "#111";
                ctx.fillRect(META+x,y,s,s);
            }
        }

        ctx.shadowBlur=0;
    }

    // =========================
    // DIBUJA LAS MOTOS
    // =========================
    function dibujar(img,x,y){
        ctx.drawImage(img, x-52, y-31, 104, 84);
    }

    // =========================
    // LOOP PRINCIPAL DEL JUEGO
    // =========================
    function loop(){

        fondo();

        // borde del canvas
        ctx.strokeStyle="#ff8df3";
        ctx.lineWidth=4;
        ctx.shadowColor="#ff4de1";
        ctx.shadowBlur=14;
        ctx.strokeRect(10,10,canvas.width-20,canvas.height-20);
        ctx.shadowBlur=0;

        // pistas/carreteras
        carriles.forEach((y,i)=>{

            let pista = ctx.createLinearGradient(20,y,canvas.width-20,y);

            pista.addColorStop(0,"rgba(255,166,230,.60)");
            pista.addColorStop(0.5,"rgba(255,210,245,.78)");
            pista.addColorStop(1,"rgba(255,166,230,.60)");

            ctx.fillStyle=pista;
            ctx.fillRect(28,y,canvas.width-56,58);

            ctx.strokeStyle="rgba(255,255,255,.35)";
            ctx.lineWidth=2;
            ctx.strokeRect(28,y,canvas.width-56,58);

            for(let x=45;x<canvas.width-45;x+=82){
                ctx.fillStyle="rgba(255,255,255,.88)";
                ctx.fillRect(x,y+26,42,7);
            }

            ctx.fillStyle="rgba(255,255,255,.32)";
            ctx.font="18px Quicksand";
            ctx.textAlign="left";
            ctx.fillText("✦", 38, y+20);
        });

        meta();

        // cuenta regresiva
        if(inicio){

            let s=(Date.now()-t0)/1000;
            let txt=["3","2","1","GO!"][Math.floor(s)] || "";

            if(s>3) inicio=false;

            if(txt){
                ctx.font="72px Quicksand";
                ctx.textAlign="center";
                ctx.fillStyle="#ff8df3";
                ctx.shadowColor="#ff4de1";
                ctx.shadowBlur=25;
                ctx.fillText(txt,canvas.width/2,canvas.height/2);
                ctx.shadowBlur=0;
            }

            requestAnimationFrame(loop);
            return;
        }

        // lógica de carrera
        if(juegoActivo){

            jugador.x += velJugador;
            velJugador *= 0.86;

            oponentes.forEach(o=>{
                o.x += o.vel;
            });

            if(jugador.x >= META){
                juegoActivo = false;
                resultado = "YOU WIN ";
            }

            oponentes.forEach(o=>{
                if(o.x >= META && juegoActivo){
                    juegoActivo = false;
                    resultado = "GAME OVER ";
                }
            });
        }

        // personajes
        dibujar(imgJugador,jugador.x,jugador.y);
        dibujar(imgSally,oponentes[0].x,oponentes[0].y);
        dibujar(imgCharlie,oponentes[1].x,oponentes[1].y);
        dibujar(imgWood,oponentes[2].x,oponentes[2].y);

        // pantalla final
        if(!juegoActivo){

            ctx.fillStyle="rgba(20,0,45,.38)";
            ctx.fillRect(0,0,canvas.width,canvas.height);

            ctx.fillStyle="rgba(255,220,250,.18)";
            ctx.fillRect(canvas.width/2-235,canvas.height/2-60,470,105);

            ctx.strokeStyle="#ff8df3";
            ctx.lineWidth=3;
            ctx.strokeRect(canvas.width/2-235,canvas.height/2-60,470,105);

            ctx.font="55px Quicksand";
            ctx.textAlign="center";
            ctx.fillStyle="#ff8df3";
            ctx.shadowColor="#ff4de1";
            ctx.shadowBlur=22;
            ctx.fillText(resultado,canvas.width/2,canvas.height/2+10);
            ctx.shadowBlur=0;
        }

        requestAnimationFrame(loop);
    }

    loop();
}