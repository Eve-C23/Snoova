function juegoNubes(contenedor){

    contenedor.innerHTML = `
    <div style="
        text-align:center;
        position:relative;
        width:100%;
    ">
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap" rel="stylesheet">

        <div style="
            width:min(980px, 92vw);
            margin:auto;
            padding:38px 38px 22px;
            background:rgba(15,0,45,0.82);
            border:4px solid rgba(236,72,153,0.35);
            border-radius:38px;
            box-shadow:
                0 0 25px rgba(236,72,153,0.65),
                inset 0 0 35px rgba(168,85,247,0.18);
        ">

            <div style="
                width:100%;
                box-sizing:border-box;
                margin:0 auto 32px;
                background:linear-gradient(90deg,#f472b6,#e879f9);
                border-radius:28px;
                padding:18px 10px;
                box-shadow:0 0 22px rgba(244,114,182,0.45);
            ">

                <h2 style="
                    font-family:'Baloo 2', Arial;
                    color:white;
                    margin:0;
                    font-size:clamp(30px, 5vw, 50px);
                    font-weight:800;
                    letter-spacing:3px;
                    text-shadow:
                    5px 6px 0 rgba(0,0,0,.18),
                    0 4px 10px rgba(0,0,0,0.25);
                ">
                    SNOOPY SKY JUMP ✨
                </h2>

                <p style="
                    color:rgba(255,255,255,0.9);
                    margin:2px 0 0;
                    font-size:clamp(15px, 2.5vw, 24px);
                    font-family:'Baloo 2', Arial;
                ">
                    Salta entre las nubes ☁️✨
                </p>

            </div>

            <canvas id="nubesGame"
            width="1200"
            height="700"
            style="
                width:100%;
                max-width:1200px;
                height:auto;
                border-radius:35px;
                border:4px solid rgba(255,255,255,0.85);
                box-shadow:
                0 0 20px #ff8fab,
                0 0 45px rgba(168,85,247,0.55);
                background:black;
                cursor:pointer;
                touch-action:none;
            "></canvas>

        </div>
    </div>
    `;

    const canvas = document.getElementById("nubesGame");
    const ctx = canvas.getContext("2d");

    canvas.addEventListener("click", ()=>{

        if(gameOver){

            sonidoGameOver.pause();
            sonidoGameOver.currentTime = 0;

            juegoNubes(contenedor);
        }
    });

    const snoopy = new Image();
    snoopy.src = "img/snoopyJump.png";

    const nube = new Image();
    nube.src = "img/nube.png";

    const estrella = new Image();
    estrella.src = "img/estrella.png";

    const sonidoMoneda = new Audio("audio/coin.mp3");
    sonidoMoneda.volume = 0.3;

    const sonidoGameOver = new Audio("audio/gameover.mp3");
    sonidoGameOver.volume = 0.4;

    const musicaFondo = new Audio("audio/musica.mp3");
    musicaFondo.volume = 0.5;
    musicaFondo.loop = true;

    let mejoresPuntajes =
    JSON.parse(localStorage.getItem("topScoresNubes")) || [];

    function guardarScore(){

        mejoresPuntajes.push(puntos);
        mejoresPuntajes.sort((a,b)=> b-a);
        mejoresPuntajes = mejoresPuntajes.slice(0,5);

        localStorage.setItem(
            "topScoresNubes",
            JSON.stringify(mejoresPuntajes)
        );
    }

    const jugador = {
        x: 560,
        y: 500,
        w: 120,
        h: 120,
        velY: 0,
        salto: -19,
        velocidad: 8
    };

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

    canvas.addEventListener("mousemove", (e)=>{
        const rect = canvas.getBoundingClientRect();

        const mouseX =
        (e.clientX - rect.left) *
        (1200 / rect.width);

        jugador.x = mouseX - jugador.w/2;
    });

    canvas.addEventListener("touchmove", (e)=>{
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();

        const touchX =
        (e.touches[0].clientX - rect.left) *
        (1200 / rect.width);

        jugador.x = touchX - jugador.w/2;

    }, { passive:false });

    let plataformas = [];

    function crearPlataformas(){

        plataformas = [];

        plataformas.push({
            x: 520,
            y: 600,
            w: 180,
            h: 90
        });

        for(let i=1;i<8;i++){

            plataformas.push({
                x: Math.random()*850 + 100,
                y: i*95,
                w: 180,
                h: 90
            });
        }
    }

    crearPlataformas();

    let monedas = [];
    let totalMonedas = 0;

    function crearMonedas(){

        monedas = [];

        plataformas.forEach((p, i)=>{

            if(i % 2 === 0){

                monedas.push({
                    x: p.x + 70,
                    y: p.y - 30,
                    size: 40,
                    tomada: false,
                    rotacion: Math.random()*10
                });
            }
        });
    }

    crearMonedas();

    let estrellas = [];

    for(let i=0;i<40;i++){

        estrellas.push({
            x: Math.random()*1200,
            y: Math.random()*700,
            size: Math.random()*4 + 2,
            alpha: Math.random()*10
        });
    }

    let puntos = 0;
    let altura = 0;

    let velocidadMapa = 0.35;

    let gameOver = false;
    let scoreGuardado = false;

    function dibujarFondo(){

        let gradiente = ctx.createLinearGradient(0,0,0,700);

        gradiente.addColorStop(0, "#120458");
        gradiente.addColorStop(0.5, "#5f0a87");
        gradiente.addColorStop(1, "#a4508b");

        ctx.fillStyle = gradiente;

        ctx.fillRect(0,0,1200,700);

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
    }

    function dibujarJugador(){

        ctx.drawImage(
            snoopy,
            jugador.x,
            jugador.y,
            jugador.w,
            jugador.h
        );
    }

    function dibujarPlataformas(){

        plataformas.forEach(p=>{

            const escala = 0.20;

            ctx.drawImage(
                nube,
                p.x,
                p.y,
                nube.width * escala,
                nube.height * escala
            );
        });
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

    function interfaz(){

        ctx.fillStyle = "rgba(255,255,255,0.08)";

        ctx.beginPath();

        ctx.roundRect(25,25,320,180,25);

        ctx.fill();

        ctx.fillStyle = "#ffd43b";

        ctx.font = "bold 28px Arial";

        ctx.fillText(
            "⭐ Puntos: " + puntos,
            45,
            70
        );

        ctx.fillStyle = "white";

        ctx.font = "bold 24px Arial";

        ctx.fillText(
            "☁️ Altura: " + altura + "m",
            45,
            115
        );

        ctx.fillStyle = "#ffd43b";

        ctx.fillText(
            "🪙 Monedas: " + totalMonedas,
            45,
            160
        );
    }

    function actualizar(){

        if(izquierda){
            jugador.x -= jugador.velocidad;
        }

        if(derecha){
            jugador.x += jugador.velocidad;
        }

        if(jugador.x > 1200){
            jugador.x = -jugador.w;
        }

        if(jugador.x < -jugador.w){
            jugador.x = 1200;
        }

        jugador.velY += 0.42;

        jugador.y += jugador.velY;

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

        monedas.forEach(m=>{

            if(m.tomada) return;

            let dx =
            jugador.x +
            jugador.w/2 - m.x;

            let dy =
            jugador.y +
            jugador.h/2 - m.y;

            let distancia =
            Math.sqrt(dx*dx + dy*dy);

            if(distancia < 55){

                m.tomada = true;

                puntos += 150;

                totalMonedas++;

                sonidoMoneda.currentTime = 0;

                sonidoMoneda.play();
            }
        });

        if(jugador.y < 320){

            let diff = 320 - jugador.y;

            jugador.y = 320;

            puntos += Math.floor(diff);

            altura += Math.floor(diff/12);

            plataformas.forEach(p=>{

                p.y += diff * velocidadMapa;

                if(p.y > 750){

                    p.y = -90;

                    p.x = Math.random()*850 + 100;
                }
            });

            monedas.forEach(m=>{

                m.y += diff * velocidadMapa;

                if(m.y > 750){

                    m.y = -50;

                    m.x = Math.random()*1000 + 50;

                    m.tomada = false;
                }
            });
        }

        velocidadMapa =
        0.35 +
        Math.pow(
            puntos / 4000,
            1.12
        );

        if(jugador.y > 750){

            gameOver = true;

            musicaFondo.pause();

            if(!scoreGuardado){

                guardarScore();

                scoreGuardado = true;

                sonidoGameOver.currentTime = 0;

                sonidoGameOver.play();
            }
        }
    }

    function mostrarGameOver(){

        ctx.fillStyle = "rgba(0,0,0,.50)";
        ctx.fillRect(0,0,1200,700);

        let panelX = 310;
        let panelY = 70;
        let panelW = 580;
        let panelH = 500;

        let gradientePanel =
        ctx.createLinearGradient(
            panelX,
            panelY,
            panelX,
            panelY + panelH
        );

        gradientePanel.addColorStop(0, "rgba(88,35,130,.78)");
        gradientePanel.addColorStop(1, "rgba(68,20,105,.82)");

        ctx.fillStyle = gradientePanel;

        ctx.beginPath();

        ctx.roundRect(
            panelX,
            panelY,
            panelW,
            panelH,
            35
        );

        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.textAlign = "center";

        ctx.fillStyle = "white";
        ctx.font = "bold 66px 'Baloo 2', Arial";

        ctx.fillText(
            "GAME OVER",
            600,
            170
        );

        ctx.fillStyle = "#ffc2f3";
        ctx.font = "bold 30px 'Baloo 2', Arial";

        ctx.fillText(
            "Puntos: " + puntos,
            600,
            245
        );

        ctx.fillStyle = "#ffd84d";
        ctx.font = "bold 34px 'Baloo 2', Arial";

        ctx.fillText(
            "🏆 TOP 5",
            600,
            320
        );

        ctx.font = "bold 25px 'Baloo 2', Arial";

        mejoresPuntajes.forEach((p,i)=>{

            if(i === 0){
                ctx.fillStyle = "#ffe75c";
            }else{
                ctx.fillStyle = "white";
            }

            ctx.fillText(
                (i+1) + ". " + p,
                600,
                365 + (i * 32)
            );
        });

        ctx.fillStyle = "rgba(255,255,255,.90)";
        ctx.font = "bold 22px 'Baloo 2', Arial";

        ctx.fillText(
            "Toca la pantalla o haz click para reiniciar",
            600,
            535
        );
    }

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

    jugador.velY = 0;

    musicaFondo.play();

    loop();
}