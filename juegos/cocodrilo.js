function juegoCocodrilo(contenedor){

    contenedor.innerHTML = `
    <div style="text-align:center;">
        <h2>🐊 Cocodrilo Dentista 💖</h2>
        <canvas id="coco" width="800" height="500"></canvas>
        <br><br>
        <button onclick="location.reload()">🔙 Regresar</button>
    </div>
    `;

    const canvas = document.getElementById("coco");
    const ctx = canvas.getContext("2d");

    const TOTAL = 8;

    // 🔥 SIEMPRE ALEATORIO
    let dienteMalo = Math.floor(Math.random() * TOTAL);

    let dientes = [];
    for(let i=0;i<TOTAL;i++){
        dientes.push({
            offset: 0,
            presionado: false
        });
    }

    let estado = "cerrado";
    let apertura = 0;

    let turno = 1;
    let gameOver = false;

    let vibracion = 0;

    const cx = 400;
    const cy = 230;

    function dibujar(){

        ctx.save();

        // 💥 vibración SIN parpadeo
        if(vibracion > 0){
            ctx.translate(Math.random()*6-3, Math.random()*6-3);
            vibracion--;
        }

        // fondo SIEMPRE igual (NO parpadea)
        ctx.fillStyle = "#f5b6c6";
        ctx.fillRect(0,0,800,500);

        let abrir = apertura * 90;

        // 🐶 cabeza
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(cx, cy-80, 180, 130, 0, 0, Math.PI*2);
        ctx.fill();

        // orejas
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.ellipse(cx-150, cy-80, 35, 90, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx+150, cy-80, 35, 90, 0, 0, Math.PI*2);
        ctx.fill();

        // ojos
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(cx-30, cy-100, 5, 0, Math.PI*2);
        ctx.arc(cx+30, cy-100, 5, 0, Math.PI*2);
        ctx.fill();

        // nariz
        ctx.beginPath();
        ctx.ellipse(cx, cy-75, 14, 9, 0, 0, Math.PI*2);
        ctx.fill();

        // boca
        ctx.fillStyle = "#ff9eb3";
        ctx.beginPath();
        ctx.ellipse(cx, cy + abrir, 140, 70, 0, 0, Math.PI);
        ctx.fill();

        // lengua
        ctx.fillStyle = "#ff6f91";
        ctx.beginPath();
        ctx.ellipse(cx, cy + abrir + 25, 80, 40, 0, 0, Math.PI);
        ctx.fill();

        // 🦷 DIENTES
        for(let i=0;i<TOTAL;i++){

            let ang = Math.PI * (i+1)/(TOTAL+1);

            let baseX = cx + Math.cos(ang)*120;
            let baseY = cy + abrir + Math.sin(ang)*55;

            let d = dientes[i];

            if(d.presionado && d.offset < 30){
                d.offset += 2;
            }

            let x = baseX;
            let y = baseY + d.offset;

            // 🔴 SOLO el malo parpadea
            if(gameOver && i === dienteMalo){
                if(Math.floor(Date.now()/150)%2===0){
                    ctx.fillStyle = "#ff3b3b";
                } else {
                    ctx.fillStyle = "#ffffff";
                }
            } else {
                ctx.fillStyle = "#ffffff";
            }

            ctx.fillRect(x-12, y-20, 24, 30);
            ctx.strokeStyle = "#999";
            ctx.strokeRect(x-12, y-20, 24, 30);
        }

        // texto
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";

        if(!gameOver && estado === "jugando"){
            ctx.fillText("Turno Jugador " + turno, 300, 40);
        }

        if(gameOver){
            ctx.fillStyle = "red";
            ctx.font = "30px Arial";
            ctx.fillText("💀 PERDISTE 💀", 270, 60);
        }

        ctx.restore();
    }

    canvas.addEventListener("click", (e)=>{

        if(gameOver || estado !== "jugando") return;

        const rect = canvas.getBoundingClientRect();
        let mx = e.clientX - rect.left;
        let my = e.clientY - rect.top;

        let abrir = apertura * 90;

        for(let i=0;i<TOTAL;i++){

            let ang = Math.PI * (i+1)/(TOTAL+1);

            let x = cx + Math.cos(ang)*120;
            let y = cy + abrir + Math.sin(ang)*55 + dientes[i].offset;

            let dx = mx - x;
            let dy = my - y;

            // 🎯 colisión real
            if(Math.sqrt(dx*dx + dy*dy) < 20){

                if(dientes[i].presionado) return;

                dientes[i].presionado = true;

                if(i === dienteMalo){
                    gameOver = true;
                    vibracion = 20; // 💥 solo vibración
                } else {
                    turno = turno === 1 ? 2 : 1;
                }

                break;
            }
        }
    });

    function loop(){

        // animación abrir boca
        if(estado === "cerrado"){
            apertura += 0.03;
            if(apertura >= 1){
                apertura = 1;
                estado = "jugando";
            }
        }

        dibujar();
        requestAnimationFrame(loop);
    }

    loop();
}