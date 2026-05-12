function juegoNubes(contenedor){

    contenedor.innerHTML = `
    <div style="text-align:center; position:relative;">

        <h2 style="
            font-family:Arial;
            color:white;
            text-shadow:
                0 0 8px #fff,
                0 0 15px #ff8fab,
                0 0 25px #a855f7;
            font-size:42px;
            margin-bottom:12px;
            letter-spacing:2px;
        ">
            ☁️ Snoopy Sky Jump ☁️
        </h2>

        <canvas id="nubesGame"
        width="800"
        height="500"
        style="
            border-radius:30px;
            border:4px solid rgba(255,255,255,0.8);

            box-shadow:
            0 0 15px #ff8fab,
            0 0 30px rgba(168,85,247,0.5);

            background:black;
        "></canvas>

    </div>
    `;

    const canvas = document.getElementById("nubesGame");
    const ctx = canvas.getContext("2d");

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
    // JUGADOR
    // =================================================

    const jugador = {

        x: 380,
        y: 320,

        w: 90,
        h: 90,

        velY: 0,

        salto: -16,

        velocidad: 7
    };

    // =================================================
    // CONTROLES
    // =================================================

    let izquierda = false;
    let derecha = false;

    document.addEventListener("keydown", (e)=>{

        if(e.key === "ArrowLeft") izquierda = true;

        if(e.key === "ArrowRight") derecha = true;
    });

    document.addEventListener("keyup", (e)=>{

        if(e.key === "ArrowLeft") izquierda = false;

        if(e.key === "ArrowRight") derecha = false;
    });

    // =================================================
    // PLATAFORMAS
    // =================================================

    let plataformas = [];

    function crearPlataformas(){

        plataformas = [];

        // nube inicial

        plataformas.push({

            x: 320,
            y: 420,

            w: 140,
            h: 80
        });

        // demás nubes

        for(let i=1;i<9;i++){

            plataformas.push({

                x: Math.random()*550 + 80,

                y: i*65,

                w: 140,
                h: 80
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

                    x: p.x + 45,
                    y: p.y - 25,

                    size: 30,

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

    for(let i=0;i<25;i++){

        estrellas.push({

            x: Math.random()*800,
            y: Math.random()*500,

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

    let velocidadMapa = 1;

    // =================================================
    // GAME OVER
    // =================================================

    let gameOver = false;

    let botonReiniciar = null;

    // =================================================
    // BOTON REINICIAR
    // =================================================

    canvas.addEventListener("click", (e)=>{

        if(!gameOver || !botonReiniciar) return;

        const rect = canvas.getBoundingClientRect();

        let mx = e.clientX - rect.left;
        let my = e.clientY - rect.top;

        if(

            mx > botonReiniciar.x &&
            mx < botonReiniciar.x + botonReiniciar.w &&

            my > botonReiniciar.y &&
            my < botonReiniciar.y + botonReiniciar.h

        ){

            juegoNubes(contenedor);
        }
    });

    // =================================================
    // FONDO
    // =================================================

    function dibujarFondo(){

        let gradiente = ctx.createLinearGradient(0,0,0,500);

        gradiente.addColorStop(0,"#120458");
        gradiente.addColorStop(0.5,"#5f0a87");
        gradiente.addColorStop(1,"#a4508b");

        ctx.fillStyle = gradiente;

        ctx.fillRect(0,0,800,500);

        // estrellas

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

        // montañas

        ctx.fillStyle = "rgba(255,255,255,0.05)";

        ctx.beginPath();

        ctx.moveTo(0,500);

        for(let i=0;i<=800;i+=100){

            ctx.lineTo(
                i,
                420 + Math.sin(i*0.01)*20
            );
        }

        ctx.lineTo(800,500);

        ctx.fill();
    }

    // =================================================
    // PERSONAJE
    // =================================================

    function dibujarJugador(){

        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 6;

        ctx.drawImage(
            snoopy,
            jugador.x,
            jugador.y,
            jugador.w,
            jugador.h
        );

        ctx.shadowBlur = 0;
    }

    // =================================================
    // NUBES
    // =================================================

    function dibujarPlataformas(){

        plataformas.forEach(p=>{

            ctx.shadowColor = "rgba(255,255,255,0.5)";
            ctx.shadowBlur = 12;

            const escala = 0.15;

            ctx.drawImage(
                nube,
                p.x,
                p.y,
                nube.width * escala,
                nube.height * escala
            );

            ctx.shadowBlur = 0;
        });
    }

    // =================================================
    // MONEDAS
    // =================================================

    function dibujarMonedas(){

        monedas.forEach(m=>{

            if(m.tomada) return;

            m.rotacion += 0.08;

            ctx.shadowColor = "#ffd43b";
            ctx.shadowBlur = 15;

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

            // centro

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

            ctx.shadowBlur = 0;
        });
    }

    // =================================================
    // INTERFAZ
    // =================================================

    function interfaz(){

        ctx.fillStyle = "rgba(255,255,255,0.08)";

        ctx.fillRect(15,15,220,140);

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.strokeRect(15,15,220,140);

        ctx.fillStyle = "#ffd43b";

        ctx.font = "bold 20px Arial";
        ctx.fillText("⭐ Puntos: " + puntos, 30, 45);

        ctx.fillStyle = "white";

        ctx.font = "bold 18px Arial";
        ctx.fillText("☁️ Altura: " + altura + "m", 30, 75);

        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#ffd43b";
        ctx.fillText("🪙 Monedas: " + totalMonedas, 30, 105);

        ctx.fillStyle = "white";

        ctx.font = "16px Arial";
        ctx.fillText("← → mover", 30, 135);

        // dificultad

        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(600,25,160,18);

        ctx.fillStyle = "#ff4d6d";

        ctx.fillRect(
            600,
            25,
            Math.min(160, velocidadMapa*40),
            18
        );

        ctx.fillStyle = "white";

        ctx.font = "bold 16px Arial";
        ctx.fillText("Dificultad", 640, 18);
    }

    // =================================================
    // MOVIMIENTO
    // =================================================

    function actualizar(){

        // mover

        if(izquierda){

            jugador.x -= jugador.velocidad;
        }

        if(derecha){

            jugador.x += jugador.velocidad;
        }

        // atravesar pantalla

        if(jugador.x > 800){

            jugador.x = -jugador.w;
        }

        if(jugador.x < -jugador.w){

            jugador.x = 800;
        }

        // gravedad

        jugador.velY += 0.55;

        jugador.y += jugador.velY;

        // colisiones

        plataformas.forEach(p=>{

            if(

                jugador.velY > 0 &&

                jugador.x + jugador.w > p.x + 25 &&

                jugador.x < p.x + p.w &&

                jugador.y + jugador.h > p.y &&

                jugador.y + jugador.h < p.y + 25

            ){

                jugador.velY = jugador.salto;
            }
        });

        // monedas

        monedas.forEach(m=>{

            if(m.tomada) return;

            let dx = jugador.x + jugador.w/2 - m.x;
            let dy = jugador.y + jugador.h/2 - m.y;

            let distancia = Math.sqrt(dx*dx + dy*dy);

            if(distancia < 45){

                m.tomada = true;

                puntos += 150;

                totalMonedas++;
            }
        });

        // subir mapa

        if(jugador.y < 220){

            let diff = 220 - jugador.y;

            jugador.y = 220;

            puntos += Math.floor(diff);

            altura += Math.floor(diff/12);

            plataformas.forEach(p=>{

                p.y += diff * velocidadMapa;

                // reciclar nube

                if(p.y > 550){

                    p.y = -60;

                    p.x = Math.random()*550 + 80;

                    p.w = Math.max(90, 140 - puntos/1000);
                }
            });

            monedas.forEach(m=>{

                m.y += diff * velocidadMapa;

                if(m.y > 550){

                    m.y = -40;
                    m.x = Math.random()*700 + 40;

                    m.tomada = false;
                }
            });
        }

        // dificultad

        velocidadMapa = 1 + puntos/2500;

        // perder

        if(jugador.y > 550){

            gameOver = true;
        }
    }

    // =================================================
    // GAME OVER
    // =================================================

    function mostrarGameOver(){

        ctx.fillStyle = "rgba(0,0,0,0.5)";

        ctx.fillRect(0,0,800,500);

        ctx.shadowColor = "#ff4d6d";
        ctx.shadowBlur = 20;

        ctx.fillStyle = "white";

        ctx.font = "bold 60px Arial";

        ctx.fillText("GAME OVER", 180, 170);

        ctx.shadowBlur = 0;

        // puntos

        ctx.font = "bold 30px Arial";

        ctx.fillText(
            "⭐ Puntos: " + puntos,
            280,
            240
        );

        ctx.fillText(
            "🪙 Monedas: " + totalMonedas,
            270,
            290
        );

        // botón

        botonReiniciar = {

            x: 270,
            y: 340,

            w: 250,
            h: 65
        };

        ctx.shadowColor = "#ff8fab";
        ctx.shadowBlur = 15;

        ctx.fillStyle = "#ff4d6d";

        ctx.beginPath();

        ctx.roundRect(
            botonReiniciar.x,
            botonReiniciar.y,
            botonReiniciar.w,
            botonReiniciar.h,
            18
        );

        ctx.fill();

        ctx.shadowBlur = 0;

        // texto

        ctx.fillStyle = "white";

        ctx.font = "bold 28px Arial";

        ctx.fillText(
            "REINICIAR",
            325,
            382
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

    // iniciar sobre nube

    jugador.velY = 0;

    loop();
}