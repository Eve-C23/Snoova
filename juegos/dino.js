let controlActivo = false;

function juegoDino(container){

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

            canvas{
                display:block;
                margin:auto;
                font-family: 'Quicksand', sans-serif;
            }
        </style>

        <h2 style="text-align:center; font-family:'Quicksand',sans-serif;">
            💖 Snoopy Run 💖
        </h2>
    `;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let ANCHO, ALTO, scale, fuerzaSalto;

    function resize(){
        ANCHO = Math.min(window.innerWidth * 0.95, 1200);
        ALTO = Math.min(window.innerHeight * 0.8, 700);

        canvas.width = ANCHO;
        canvas.height = ALTO;

        scale = ANCHO / 900;
        fuerzaSalto = -24 * scale; // 🔥 corregido
    }

    window.addEventListener("resize", resize);
    resize();

    // imágenes
    const imgSnoopy = new Image(); imgSnoopy.src = "snoopy.png";
    const imgNube = new Image(); imgNube.src = "nube.png";
    const imgObstaculo = new Image(); imgObstaculo.src = "obstaculo.png";
    const imgMoneda = new Image(); imgMoneda.src = "moneda.png";
    const imgRecord = new Image(); imgRecord.src = "record.png";

    function draw(img, x, y, w, h){
        if(img.complete && img.naturalWidth !== 0){
            const s = Math.min(w/img.width, h/img.height);
            const nw = img.width*s;
            const nh = img.height*s;
            ctx.drawImage(img, x+(w-nw)/2, y+(h-nh)/2, nw, nh);
        }
    }

    function fondo(){
        let grad;

        if(puntos < 400){
            grad = ctx.createLinearGradient(0,0,0,ALTO);
            grad.addColorStop(0,"#87cefa");
            grad.addColorStop(1,"#e0f7ff");
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,ANCHO,ALTO);
            ctx.fillStyle = "#fff";
            ctx.fillRect(0,sueloY,ANCHO,ALTO-sueloY);

        } else if(puntos < 800){
            grad = ctx.createLinearGradient(0,0,0,ALTO);
            grad.addColorStop(0,"#ff9966");
            grad.addColorStop(1,"#ff5e62");
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,ANCHO,ALTO);
            ctx.fillStyle = "#fff3e0";
            ctx.fillRect(0,sueloY,ANCHO,ALTO-sueloY);

        } else {
            grad = ctx.createLinearGradient(0,0,0,ALTO);
            grad.addColorStop(0,"#2c003e");
            grad.addColorStop(1,"#000");
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,ANCHO,ALTO);
            ctx.fillStyle = "#eee";
            ctx.fillRect(0,sueloY,ANCHO,ALTO-sueloY);
        }
    }

    let jugador, obstaculos, monedas, nubes;
    let puntos, coins, juegoActivo;
    let ultimoSpawn, ultimoCoin, sueloY;
    let records = JSON.parse(localStorage.getItem("records")) || [];

    function init(){

        sueloY = ALTO - 80*scale;

        jugador = {
            x: 100*scale,
            y: 0,
            w: 100*scale,
            h: 100*scale,
            velY: 0,
            saltando:false
        };

        jugador.y = sueloY - jugador.h;

        window.jugadorActual = jugador;

        obstaculos = [];
        monedas = [];
        nubes = [];

        puntos = 0;
        coins = 0;
        juegoActivo = true;

        ultimoSpawn = 0;
        ultimoCoin = 0;

        for(let i=0;i<5;i++){
            nubes.push({
                x: i*(ANCHO/5),
                y: 50*scale + Math.random()*120*scale,
                w: 140*scale,
                h: 80*scale,
                vel: 0.3 + Math.random()*0.3
            });
        }
    }

    // controles
    if(!controlActivo){
        window.addEventListener("keydown", (e)=>{

            if(e.code==="Space"){
                e.preventDefault();

                let j = window.jugadorActual;

                if(j && !j.saltando && juegoActivo){
                    j.velY = fuerzaSalto; // 🔥 FIX
                    j.saltando = true;
                }
            }

            if(e.code==="Enter"){
                if(!juegoActivo){
                    init();
                }
            }

        });
        controlActivo = true;
    }

    function guardarRecord(){
        records.push(puntos);
        records = [...new Set(records)];
        records.sort((a,b)=>b-a);
        records = records.slice(0,5);
        localStorage.setItem("records", JSON.stringify(records));
    }

    function loop(){

        fondo();

        // nubes
        nubes.forEach(n=>{
            n.x -= n.vel;
            if(n.x < -n.w) n.x = ANCHO;
            ctx.globalAlpha = 0.6;
            draw(imgNube,n.x,n.y,n.w,n.h);
            ctx.globalAlpha = 1;
        });

        // UI
        ctx.fillStyle = "#ffffffcc";
        ctx.fillRect(10,10,180*scale,70*scale);

        draw(imgMoneda, 15,15,30*scale,30*scale);
        ctx.fillStyle = "#333";
        ctx.font = (18*scale)+"px Quicksand";
        ctx.fillText(coins, 55*scale, 35*scale);

        draw(imgRecord, 15,45*scale,30*scale,30*scale);
        ctx.fillText(puntos, 55*scale, 65*scale);

        if(!juegoActivo){

            guardarRecord();

            ctx.fillStyle="#ffffffee";
            ctx.fillRect(ANCHO*0.25,ALTO*0.2,ANCHO*0.5,ALTO*0.6);

            ctx.textAlign="center";
            ctx.fillStyle="#ff4d88";
            ctx.font = (30*scale)+"px Quicksand";

            ctx.fillText("Game Over",ANCHO/2,ALTO*0.3);

            ctx.font = (18*scale)+"px Quicksand";
            ctx.fillText("Puntos: "+puntos,ANCHO/2,ALTO*0.35);

            ctx.fillText("Top 5",ANCHO/2,ALTO*0.42);

            records.forEach((r,i)=>{
                ctx.fillText((i+1)+". "+r, ANCHO/2, ALTO*0.47 + i*30*scale);
            });

            ctx.fillText("ENTER para reiniciar",ANCHO/2,ALTO*0.8);

            return;
        }

        // salto
        jugador.velY += 1.2*scale;
        jugador.y += jugador.velY;

        if(jugador.y >= sueloY - jugador.h){
            jugador.y = sueloY - jugador.h;
            jugador.saltando = false;
        }

        // obstáculos
        if(Date.now()-ultimoSpawn > 1400){
            let s = (40 + Math.random()*20)*scale;
            obstaculos.push({x:ANCHO,y:sueloY-s,w:s,h:s});
            ultimoSpawn = Date.now();
        }

        obstaculos.forEach(o=> o.x -= 6*scale);

        // monedas
        if(Date.now()-ultimoCoin > 1600){
            monedas.push({
                x:ANCHO,
                y: sueloY - 140*scale,
                w:40*scale,
                h:40*scale
            });
            ultimoCoin = Date.now();
        }

        monedas.forEach(m=> m.x -= 6*scale);

        // colisión
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

        // monedas
        monedas = monedas.filter(m=>{
            let hit =
                jugador.x < m.x+m.w &&
                jugador.x+jugador.w > m.x &&
                jugador.y < m.y+m.h &&
                jugador.y+jugador.h > m.y;

            if(hit){ coins++; return false; }
            return true;
        });

        // dibujar
        draw(imgSnoopy,jugador.x,jugador.y,jugador.w,jugador.h);
        obstaculos.forEach(o=> draw(imgObstaculo,o.x,o.y,o.w,o.h));
        monedas.forEach(m=> draw(imgMoneda,m.x,m.y,m.w,m.h));

        puntos++;

        requestAnimationFrame(loop);
    }

    init();
    loop();
}