function juegoFrutas(container){

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

            .contenedor{
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                height:100vh;
                background: linear-gradient(#e0f0ff, #ffd6ec);
                font-family:'Quicksand', sans-serif;
            }

            h2{
                color:#ff4da6;
                margin-bottom:10px;
                font-size:32px;
            }

            canvas{
                border-radius:20px;
                box-shadow:0 0 20px rgba(0,0,0,0.2);
            }
        </style>

        <div class="contenedor">
            <h2>🍓 Snoopy Sweet Snacks 🍓</h2>
            <canvas id="canvas"></canvas>
        </div>
    `;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function resize(){
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.8;
    }
    resize();
    window.addEventListener("resize", resize);

    let frutas = [];
    let ultimoSpawn = 0;

    const MAX_FRUTAS = 3; // 💖 máximo en pantalla

    const frutasEmoji = ["🍓","🍉","🍊","🍍","🍎","🥭","🥝","🍒","🫐"];

    let jugador = {
        x: 100,
        w: canvas.width * 0.12,
        h: canvas.height * 0.08,
        vel: canvas.width * 0.012
    };

    let puntos = 0;
    let vidas = 3;

    let teclas = {};
    document.addEventListener("keydown", e => teclas[e.key] = true);
    document.addEventListener("keyup", e => teclas[e.key] = false);

    // 🍓 crear fruta SIN que se encimen
    function crearFruta(){

        let nuevaX;
        let intentos = 0;

        do{
            nuevaX = Math.random() * (canvas.width - 40);
            intentos++;
        } 
        while(
            frutas.some(f => Math.abs(f.x - nuevaX) < 70) && intentos < 10
        );

        return {
            x: nuevaX,
            y: -20,
            size: canvas.width * 0.028,
            vel: 1.6 + Math.random()*0.8, // 💖 velocidad más justa
            tipo: frutasEmoji[Math.floor(Math.random()*frutasEmoji.length)]
        };
    }

    function dibujarCanasta(j){
        ctx.fillStyle = "#d2a679";
        ctx.fillRect(j.x, j.y, j.w, j.h);

        ctx.strokeStyle = "#8b5a2b";
        ctx.lineWidth = 3;
        ctx.strokeRect(j.x, j.y, j.w, j.h);

        for(let i=0; i<j.w; i+=15){
            ctx.beginPath();
            ctx.moveTo(j.x + i, j.y);
            ctx.lineTo(j.x + i, j.y + j.h);
            ctx.stroke();
        }
    }

    function loop(){

        let ANCHO = canvas.width;
        let ALTO = canvas.height;
        let SUELO = ALTO * 0.15;

        jugador.y = ALTO - SUELO - jugador.h;

        // fondo
        let grad = ctx.createLinearGradient(0,0,0,ALTO);
        grad.addColorStop(0,"#bde0fe");
        grad.addColorStop(1,"#ffc6ff");
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,ANCHO,ALTO);

        // suelo
        ctx.fillStyle = "#a0e7a0";
        ctx.fillRect(0, ALTO - SUELO, ANCHO, SUELO);

        // movimiento
        if(teclas["ArrowLeft"] && jugador.x > 0){
            jugador.x -= jugador.vel;
        }
        if(teclas["ArrowRight"] && jugador.x < ANCHO - jugador.w){
            jugador.x += jugador.vel;
        }

        // 🧺 canasta
        dibujarCanasta(jugador);

        // 💖 spawn inteligente
        if(
            frutas.length < MAX_FRUTAS &&
            Date.now() - ultimoSpawn > 900
        ){
            if(Math.random() < 0.6){ // 🎲 probabilidad
                frutas.push(crearFruta());
                ultimoSpawn = Date.now();
            }
        }

        // 🍓 frutas
        for(let i = frutas.length - 1; i >= 0; i--){
            let f = frutas[i];

            f.y += f.vel;

            ctx.font = `${f.size}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText(f.tipo, f.x, f.y);

            // colisión
            if(
                f.x > jugador.x &&
                f.x < jugador.x + jugador.w &&
                f.y > jugador.y
            ){
                puntos++;
                frutas.splice(i,1);
            }

            // tocar suelo
            else if(f.y >= ALTO - SUELO){
                vidas--;
                frutas.splice(i,1);
            }
        }

        // UI
        ctx.fillStyle = "#ff4da6";
        ctx.font = "bold 20px Quicksand";
        ctx.textAlign = "left";
        ctx.fillText("Puntos: " + puntos, 20, 30);
        ctx.fillText("Vidas: " + vidas, 20, 60);

        ctx.textAlign = "center";
        ctx.font = "bold 24px Quicksand";
        ctx.fillText("Snoopy Sweet Snacks", ANCHO/2, 40);

        // game over
        if(vidas <= 0){
            ctx.fillStyle = "#ffffffcc";
            ctx.fillRect(ANCHO/2-200, ALTO/2-100, 400,200);

            ctx.strokeStyle = "#ff4da6";
            ctx.strokeRect(ANCHO/2-200, ALTO/2-100, 400,200);

            ctx.fillStyle = "#ff2e93";
            ctx.font = "bold 35px Quicksand";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GAME OVER 💔", ANCHO/2, ALTO/2);

            return;
        }

        requestAnimationFrame(loop);
    }

    loop();
}