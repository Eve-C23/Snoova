function juegoCarrera(container){

    // =========================
    // DISEÑO HTML Y CSS
    // =========================
    // Aquí se crea toda la interfaz visual del juego (HTML + estilos CSS)
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

            /* Contenedor principal del juego */
            .carrera-wrap{
                min-height:100vh; /* ocupa toda la pantalla */
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

            /* Título del juego */
            h2{
                color:#ff8df3;
                font-size:clamp(34px,6vw,58px); /* responsive */
                margin:0 0 16px 0;
                letter-spacing:4px;
                text-align:center;
                text-shadow:0 0 8px #ff8df3, 0 0 20px #ff4de1, 0 0 40px #c77dff;
            }

            /* Zona donde está el canvas */
            .zona-juego{
                display:flex;
                align-items:flex-start;
                justify-content:center;
                gap:18px;
            }

            /* Caja decorativa del canvas */
            .canvas-box{
                padding:16px;
                border-radius:34px;
                background:linear-gradient(180deg,rgba(255,160,245,.18),rgba(110,30,190,.12));
                border:3px solid rgba(255,141,243,.55);
                box-shadow:0 0 25px rgba(255,105,255,.42), 0 0 55px rgba(170,80,255,.25), inset 0 0 18px rgba(255,255,255,.13);
            }

            /* Canvas donde se dibuja el juego */
            canvas{
                display:block;
                border-radius:26px;
                touch-action:none; /* evita zoom en móviles */
                max-width:100%;
                box-shadow:0 0 22px rgba(255,105,255,.45);
            }

            /* Diseño responsive para móviles */
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
            </div>
        </div>
    `;

    // =========================
    // CANVAS
    // =========================
    // Se obtiene el canvas donde se dibuja todo el juego
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");


    // =========================
    // IMÁGENES DE PERSONAJES
    // =========================
    // Se cargan las imágenes de los jugadores y oponentes
    const imgJugador = new Image();
    imgJugador.src = "img/Smoto.png";

    const imgSally = new Image();
    imgSally.src = "img/SAmoto.png";

    const imgCharlie = new Image();
    imgCharlie.src = "img/Cmoto.png";

    const imgWood = new Image();
    imgWood.src = "img/Wmoto.png";


    // =========================
    // VARIABLES DEL JUEGO
    // =========================
    // Aquí se guardan todos los datos del juego

    let carriles = []; // posiciones de las pistas
    let META = 0; // línea de meta

    let jugador = { id:"p", x:50, y:0 }; // jugador principal

    let oponentes = [
        {id:"o1", x:50, y:0, vel:1.4},
        {id:"o2", x:50, y:0, vel:1.5},
        {id:"o3", x:50, y:0, vel:1.3}
    ];

    let inicio = true; // cuenta regresiva activa
    let t0 = Date.now(); // tiempo de inicio

    let juegoActivo = true; // si el juego sigue corriendo
    let resultado = ""; // texto final

    let tiempoInicio = 0; // tiempo cuando empieza la carrera
    let tiempoFinal = 0; // tiempo al terminar

    let velJugador = 0; // velocidad del jugador
    let puede = true; // control para evitar spam de movimiento


    // =========================
    // AJUSTA TAMAÑO Y CARRILES
    // =========================
    // Ajusta el tamaño del canvas y posiciones de las pistas
    function resize(){

        const maxW = Math.min(window.innerWidth * 0.82, 1120);
        const maxH = Math.min(window.innerHeight * 0.58, 520);

        canvas.width = maxW;   // ancho del canvas
        canvas.height = maxH;  // alto del canvas

        META = canvas.width * 0.82; // posición de la meta

        // posiciones verticales de los carriles
        carriles = [
            canvas.height*0.15,
            canvas.height*0.35,
            canvas.height*0.55,
            canvas.height*0.75
        ];

        // asigna carril al jugador
        jugador.y = carriles[0];

        // asigna carriles a oponentes
        oponentes.forEach((o,i)=>{
            o.y = carriles[i+1];
        });
    }

    window.addEventListener("resize", resize); // cuando cambia tamaño pantalla
    window.addEventListener("orientationchange", resize); // rotación celular
    resize(); // ejecuta al inicio


    // =========================
    // MOVIMIENTO DEL JUGADOR
    // =========================
    // Aumenta velocidad cuando el jugador presiona
    function mover(){
        if(!inicio && juegoActivo && puede){
            velJugador += 2.6; // impulso del jugador
            puede = false;

            setTimeout(()=>{
                puede = true; // evita spam de clicks
            },160);
        }
    }


    // =========================
    // CONTROLES CON TECLADO
    // =========================
    let spaceLock = false; // evita mantener presionada la tecla

    document.addEventListener("keydown", e=>{
        if(e.code==="Space"){
            e.preventDefault(); // evita scroll

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
    // permite jugar tocando o clicando
    canvas.addEventListener("click", mover);

    canvas.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        mover();
    },{passive:false});


    // =========================
    // FONDO DEL JUEGO
    // =========================
    // Dibuja el fondo con degradado y estrellas
    function fondo(){

        let g = ctx.createLinearGradient(0,0,0,canvas.height);

        g.addColorStop(0,"#17002e");
        g.addColorStop(0.45,"#3d0878");
        g.addColorStop(1,"#a855f7");

        ctx.fillStyle = g;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // estrellas decorativas
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
    // Dibuja la línea de meta tipo bandera
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
    // Renderiza cada personaje en pantalla
    function dibujar(img,x,y){
        ctx.drawImage(img, x-52, y-31, 104, 84);
    }


    // =========================
    // FUNCIÓN PARA REINICIAR EL JUEGO
    // =========================
    function reiniciarJuego(){

        jugador.x = 50; // reinicia jugador

        velJugador = 0; // reinicia velocidad

        // reinicia oponentes
        oponentes.forEach(o=>{
            o.x = 50;
            o.tiempo = null;
        });

        juegoActivo = true; // vuelve a iniciar juego
        resultado = "";

        inicio = true; // reinicia cuenta regresiva
        t0 = Date.now();

        tiempoInicio = 0;
        tiempoFinal = 0;
    }


    // =========================
    // LOOP PRINCIPAL DEL JUEGO
    // =========================
    // Este es el ciclo que dibuja todo el juego cada frame
    function loop(){

        fondo();

        // borde del canvas
        ctx.strokeStyle="#ff8df3";
        ctx.lineWidth=4;
        ctx.shadowColor="#ff4de1";
        ctx.shadowBlur=14;
        ctx.strokeRect(10,10,canvas.width-20,canvas.height-20);
        ctx.shadowBlur=0;

        // pistas del juego
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

            if(s>3){
                inicio = false;
                tiempoInicio = Date.now();
            }

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

        // lógica del juego
        if(juegoActivo){

            jugador.x += velJugador;
            velJugador *= 0.86;

            oponentes.forEach(o=>{
                o.x += o.vel;
            });

            // ganador jugador
            if(jugador.x >= META){
                juegoActivo = false;
                resultado = "YOU WIN";
                tiempoFinal = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
            }

            // ganador oponente
            oponentes.forEach(o=>{
                if(o.x >= META && juegoActivo){
                    juegoActivo = false;
                    resultado = "GAME OVER";
                    tiempoFinal = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
                }
            });
        }

        // dibuja personajes
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

            // mensaje de reinicio
            canvas.style.cursor = "pointer";
            ctx.font = "28px Quicksand";
            ctx.fillText("Toca para reiniciar", canvas.width/2, canvas.height/2 + 90);

            canvas.onclick = reiniciarJuego;
        }

        // =========================
        // CRONÓMETRO
        // =========================
        // Muestra el tiempo de la carrera
        if(!inicio){

            let tiempoActual;

            if(juegoActivo){
                tiempoActual = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
            } else {
                tiempoActual = tiempoFinal;
            }

            ctx.font = "26px Quicksand";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";

            ctx.fillText("⏱ " + tiempoActual + "s", 30, 40);
        }

        requestAnimationFrame(loop);
    }

    loop();
}