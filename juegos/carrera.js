function juegoCarrera(container){
    /* CARGAR IMÁGENES PNG */

    // personaje jugador
    const snoopy = new Image();
    snoopy.src = "img/snoopy-run.png";

    // oponentes
    const woodstock = new Image();
    woodstock.src = "img/woodstock-run.png";

    const charlie = new Image();
    charlie.src = "img/charlie-run.png";

    const lucy = new Image();
    lucy.src = "img/lucy-run.png";

    /* HTML DEL JUEGO */
    container.innerHTML = `
        <div class="carrera-container">
            <h2 class="carrera-titulo">🏁 SPEED RUN 💗</h2>
            <canvas id="canvasCarrera"></canvas>
        </div>
    `;

    /* CANVAS */
    // obtener canvas
    const canvas = document.getElementById("canvasCarrera");
    // contexto para dibujar
    const ctx = canvas.getContext("2d");

    /* VARIABLES GENERALES */

    // posiciones Y de cada carril
    let carriles = [];

    // posición X de la meta
    let META = 0;


    /* JUGADOR */
    let jugador = {

        // identificador
        id:"p",

        // posición X
        x:50,

        // posición Y
        y:0,

        // tiempo final
        tiempo:null,

        // imagen PNG
        img:snoopy
    };


    /* OPONENTES */
    let oponentes = [
    {
        id:"o1",
        x:50,
        y:0,

        // velocidad automática
        vel:1.4,

        tiempo:null,

        img: woodstock
    },

    {
        id:"o2",
        x:50,
        y:0,
        vel:1.5,
        tiempo:null,
        img: charlie
    },

    {
        id:"o3",
        x:50,
        y:0,
        vel:1.3,
        tiempo:null,
        img: lucy
    }
    ];


    /* ESTADOS DEL JUEGO */

    // countdown inicial
    let inicio = true;

    // tiempo inicial countdown
    let t0 = Date.now();

    // controla si el juego sigue activo
    let juegoActivo = true;

    // texto final
    let resultado = "";

    // tiempo cuando empieza la carrera
    let tiempoInicio = 0;

    // tiempo final del ganador
    let tiempoFinal = 0;

    // velocidad actual del jugador
    let velJugador = 0;

    // evita spam de clicks
    let puede = true;


    /* ADAPTAR TAMAÑO */
    function resize(){

        // tamaño responsive del canvas
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 120;

        // posición de la meta
        META = canvas.width * 0.82;

        // posiciones verticales de carriles
        carriles = [
            canvas.height*0.2,
            canvas.height*0.35,
            canvas.height*0.5,
            canvas.height*0.65
        ];

        // carril jugador
        jugador.y = carriles[0];

        // carriles enemigos
        oponentes.forEach((o,i)=>{
            o.y = carriles[i+1];
        });
    }

    // adaptar cuando cambia pantalla
    window.addEventListener("resize", resize);
    // adaptar cuando gira celular
    window.addEventListener("orientationchange", resize);
    resize();

    /* MOVIMIENTO DEL JUGADOR */
    function mover(){
        if(!inicio && juegoActivo && puede){

            // aumentar velocidad
            velJugador += 2.6;

            // bloquear spam
            puede = false;

            // desbloquear después
            setTimeout(()=> puede = true, 160);
        }
    }

    /* CONTROL TECLADO */
    // evita dejar presionado SPACE
    let spaceLock = false;
    document.addEventListener("keydown", e=>{

        if(e.code==="Space"){

            // evita scroll
            e.preventDefault();

            // solo un click real
            if(!spaceLock){

                spaceLock = true;

                mover();
            }
        }
    });
    document.addEventListener("keyup", e=>{

        if(e.code==="Space"){

            // desbloquear SPACE
            spaceLock = false;
        }
    });

    /* CONTROL MOUSE Y TOUCH */
    // click en pc
    canvas.addEventListener("click", mover);
    // toque celular
    canvas.addEventListener("touchstart",(e)=>{

        e.preventDefault();

        mover();

    },{passive:false});

    /* FONDO DEL JUEGO */
    function fondo(){
        // degradado vertical
        let g = ctx.createLinearGradient(0,0,0,canvas.height);

        g.addColorStop(0,"#fff0f6");
        g.addColorStop(1,"#ffe4f2");

        ctx.fillStyle=g;

        // pintar fondo
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    /* META */
    function meta(){
        let s = 20;
        // ancho meta
        let w = s * 3;

        // patrón cuadros blancos y negros
        for(let y=0;y<canvas.height;y+=s){

            for(let x=0;x<w;x+=s){

                ctx.fillStyle = ((x+y)/s%2===0)
                ? "#fff"
                : "#000";

                ctx.fillRect(META+x,y,s,s);
            }
        }
    }

    /* RANKING */
    function ranking(){
        // ordenar por posición X
        return [jugador,...oponentes]

        .sort((a,b)=>b.x-a.x);
    }

    /* LOOP PRINCIPAL */
    function loop(){
        // dibujar fondo
        fondo();

        /* BORDE */
        ctx.strokeStyle="#ff4da6";
        ctx.lineWidth=4;
        ctx.strokeRect(
            10,
            10,
            canvas.width-20,
            canvas.height-20
        );

        /* PISTA */
        carriles.forEach(y=>{

            // pista rosa
            ctx.fillStyle="#ffcce6";

            ctx.fillRect(
                20,
                y,
                canvas.width-40,
                60
            );

            // líneas blancas
            for(let x=20;x<canvas.width-20;x+=80){

                ctx.fillStyle="#fff";

                ctx.fillRect(x,y+25,40,8);
            }
        });

        // dibujar meta
        meta();


        /* COUNTDOWN */
        if(inicio){

            // segundos countdown
            let s=(Date.now()-t0)/1000;

            // textos countdown
            let txt=["3","2","1","GO!"]

            [Math.floor(s)] || "";

            // terminar countdown
            if(s>3){

                inicio = false;

                tiempoInicio = Date.now();
            }

            // dibujar texto countdown
            if(txt){

                ctx.font="60px Quicksand";

                ctx.textAlign="center";

                ctx.fillStyle="#ff2e93";

                ctx.fillText(
                    txt,
                    canvas.width/2,
                    canvas.height/2
                );
            }
            requestAnimationFrame(loop);

            return;
        }


        /* MOVIMIENTO GENERAL */
        if(juegoActivo){

            // mover jugador
            jugador.x += velJugador;

            // fricción
            velJugador *= 0.86;

            // mover enemigos
            oponentes.forEach(o=>{
                o.x += o.vel;
            });


            /* GANAR */
            if(jugador.x >= META && jugador.tiempo === null){

                // guardar tiempo
                jugador.tiempo = (
                    (Date.now() - tiempoInicio) / 1000
                ).toFixed(1);

                juegoActivo = false;

                resultado = "YOU WIN";

                tiempoFinal = jugador.tiempo;
            }


            /* PERDER */
            oponentes.forEach(o=>{

                if(o.x >= META && o.tiempo === null){

                    o.tiempo = (
                        (Date.now() - tiempoInicio) / 1000
                    ).toFixed(1);

                    if(juegoActivo){

                        juegoActivo = false;

                        resultado = "GAME OVER";

                        tiempoFinal = o.tiempo;
                    }
                }
            });
        }


        /* CRONÓMETRO */
        if(!inicio){
            let tiempoActual;

            if(juegoActivo){

                tiempoActual = (
                    (Date.now() - tiempoInicio) / 1000
                ).toFixed(1);

            } else {

                tiempoActual = tiempoFinal;
            }

            ctx.font = "28px Quicksand";

            ctx.fillStyle = "#ff2e93";

            ctx.textAlign = "left";

            ctx.textBaseline = "top";

            ctx.fillText(
                "⏱ TIME: " + tiempoActual + "s",
                30,
                25
            );
        }


        /* EFECTO REBOTE */
        let bounce = Math.sin(Date.now()/120)*4;


        /* DIBUJAR ENEMIGOS */
        oponentes.forEach(o=>{

            ctx.drawImage(
                o.img,
                o.x - 60,
                o.y + bounce,
                120,
                120
            );
        });


        /* DIBUJAR JUGADOR */
        ctx.drawImage(
            snoopy,
            jugador.x - 60,
            jugador.y + bounce,
            120,
            120
        );


        /* PANTALLA FINAL */
        if(!juegoActivo){

            // texto resultado
            ctx.font="50px Quicksand";

            ctx.fillStyle="#ff2e93";

            ctx.fillText(
                resultado,
                canvas.width/2,
                canvas.height/2
            );

            // tiempo final
            ctx.font = "30px Quicksand";

            ctx.fillStyle = "#ff7abf";

            ctx.fillText(
                `TIME: ${tiempoFinal}s`,
                canvas.width/2,
                canvas.height/2 + 45
            );

            /* RANKING */
            let r = ranking();

            r.forEach((p,i)=>{

                let y = canvas.height/2 + 70 + (i*55);


                // medallas
                ctx.fillStyle = "#ff2e93";

                ctx.font = "26px Quicksand";

                ctx.fillText(
                    `${["🥇","🥈","🥉","💔"][i]}`,
                    canvas.width/2 - 110,
                    y
                );


                // PNG personaje
                ctx.drawImage(
                    p.img,
                    canvas.width/2 - 55,
                    y - 28,
                    40,
                    40
                );


                // nombres
                let nombre = "";

                if(p.id === "p") nombre = "Snoopy";
                if(p.id === "o1") nombre = "Woodstock";
                if(p.id === "o2") nombre = "Charlie";
                if(p.id === "o3") nombre = "Lucy";


                // texto ranking
                ctx.fillStyle = "#ff4da6";

                ctx.fillText(
                    `${nombre}`,
                    canvas.width/2 + 10,
                    y
                );
            });
        }
        // repetir loop
        requestAnimationFrame(loop);
    }
    // iniciar juego
    loop();
}