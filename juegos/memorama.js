function juegoMemorama(container){

    container.innerHTML = "";

    // =================================================
    // FUENTE
    // =================================================

    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // =================================================
    // MEDIDAS BASE DEL JUEGO
    // =================================================

    const BASE_W = 1450;
    const BASE_H = 980;

    let modoVertical = false;

    // =================================================
    // CONTENEDOR GENERAL
    // =================================================

    const wrapper = document.createElement("div");

    wrapper.style.width = "100%";
    wrapper.style.minHeight = "100dvh";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "flex-start";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.overflow = "hidden";
    wrapper.style.padding = "12px";
    wrapper.style.fontFamily = "'Baloo 2', cursive";

    container.appendChild(wrapper);

    // =================================================
    // BOTÓN REINICIAR
    // =================================================

    const btn = document.createElement("button");

    btn.innerText = "⟳ Reiniciar";

    btn.style.padding = "12px 26px";
    btn.style.border = "2px solid rgba(255,255,255,.15)";
    btn.style.borderRadius = "18px";
    btn.style.fontSize = "18px";
    btn.style.fontFamily = "'Baloo 2'";
    btn.style.fontWeight = "700";
    btn.style.cursor = "pointer";
    btn.style.background = "linear-gradient(135deg,#ff69c8,#8f7cff)";
    btn.style.color = "white";
    btn.style.boxShadow = "0 10px 25px rgba(0,0,0,.28)";
    btn.style.marginBottom = "12px";
    btn.style.zIndex = "20";

    wrapper.appendChild(btn);

    // =================================================
    // CONTENEDOR DEL CANVAS
    // =================================================

    const canvasBox = document.createElement("div");

    canvasBox.style.position = "relative";
    canvasBox.style.display = "flex";
    canvasBox.style.alignItems = "center";
    canvasBox.style.justifyContent = "center";
    canvasBox.style.overflow = "visible";

    wrapper.appendChild(canvasBox);

    // =================================================
    // CANVAS
    // =================================================

    const canvas = document.createElement("canvas");

    canvas.width = BASE_W;
    canvas.height = BASE_H;

    canvas.style.borderRadius = "40px";
    canvas.style.boxShadow = "0 35px 90px rgba(0,0,0,.45)";
    canvas.style.border = "2px solid rgba(255,255,255,.08)";
    canvas.style.touchAction = "none";
    canvas.style.display = "block";
    canvas.style.transformOrigin = "center center";

    canvasBox.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // =================================================
    // RESPONSIVE VERTICAL / HORIZONTAL
    // =================================================

    function ajustarPantalla(){

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        modoVertical = vw < vh;

        let espacioArriba = btn.offsetHeight + 28;

        if(modoVertical){

            const escala = Math.min(
                (vw - 20) / BASE_H,
                (vh - espacioArriba - 20) / BASE_W
            );

            const w = BASE_W * escala;
            const h = BASE_H * escala;

            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            canvas.style.transform = "rotate(90deg)";

            canvasBox.style.width = h + "px";
            canvasBox.style.height = w + "px";

            btn.style.fontSize = "18px";
            btn.style.padding = "12px 24px";

        }else{

            const escala = Math.min(
                (vw - 30) / BASE_W,
                (vh - espacioArriba - 20) / BASE_H
            );

            const w = BASE_W * escala;
            const h = BASE_H * escala;

            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            canvas.style.transform = "rotate(0deg)";

            canvasBox.style.width = w + "px";
            canvasBox.style.height = h + "px";

            btn.style.fontSize = "18px";
            btn.style.padding = "12px 26px";
        }
    }

    window.addEventListener("resize", ajustarPantalla);
    window.addEventListener("orientationchange", ()=>{
        setTimeout(ajustarPantalla, 300);
    });

    ajustarPantalla();

    // =================================================
    // PERSONAJES
    // =================================================

    const personajes = [
        "img/charlie.png",
        "img/linus.png",
        "img/lucy.png",
        "img/marcie.png",
        "img/peppermint.png",
        "img/snoopyGrande.png",
        "img/schroeder.png",
        "img/snoopy.png",
        "img/woodstock.png",
        "img/roja.png"
    ];

    // =================================================
    // IMÁGENES
    // =================================================

    const imagenes = [];

    personajes.forEach(ruta=>{
        const img = new Image();
        img.src = ruta;
        imagenes.push(img);
    });

    // =================================================
    // SONIDOS
    // =================================================

    const sonidoClick = new Audio("audio/sonido1.mp3");
    const sonidoWin = new Audio("audio/victoria.mp3");
    const sonidoMatch = new Audio("audio/match.mp3");

    sonidoClick.volume = 0.5;
    sonidoWin.volume = 0.7;
    sonidoMatch.volume = 0.6;

    // =================================================
    // VARIABLES
    // =================================================

    let cartas = [];
    let primera = null;
    let segunda = null;
    let bloqueado = false;
    let intentos = 0;
    let sonidoVictoria = false;

    // =================================================
    // TAMAÑOS DE CARTAS
    // =================================================

    const anchoCarta = 155;
    const altoCarta = 155;

    const espacioX = 240;
    const espacioY = 165;

    const inicioX = 125;
    const inicioY = 295;

    // =================================================
    // REINICIAR
    // =================================================

    function reiniciarJuego(){

        sonidoVictoria = false;

        cartas = [...imagenes, ...imagenes];

        cartas.sort(()=>Math.random() - 0.5);

        cartas = cartas.map(img=>({
            img: img,
            abierta: false,
            encontrada: false
        }));

        primera = null;
        segunda = null;
        bloqueado = false;
        intentos = 0;
    }

    reiniciarJuego();

    btn.onclick = ()=>{
        reiniciarJuego();
    };

    // =================================================
    // CLICK / TOUCH CORREGIDO PARA ROTACIÓN
    // =================================================

    canvas.addEventListener("pointerdown", e=>{

        if(bloqueado) return;

        const rect = canvas.getBoundingClientRect();

        let mx;
        let my;

        if(modoVertical){

            const vx = e.clientX - rect.left;
            const vy = e.clientY - rect.top;

            mx = vy * (BASE_W / rect.height);
            my = (rect.width - vx) * (BASE_H / rect.width);

        }else{

            mx = (e.clientX - rect.left) * (BASE_W / rect.width);
            my = (e.clientY - rect.top) * (BASE_H / rect.height);
        }

        cartas.forEach((carta,i)=>{

            const x = (i % 5) * espacioX + inicioX;
            const y = Math.floor(i / 5) * espacioY + inicioY;

            if(
                mx > x &&
                mx < x + anchoCarta &&
                my > y &&
                my < y + altoCarta
            ){

                if(carta.abierta || carta.encontrada) return;

                carta.abierta = true;

                sonidoClick.currentTime = 0;
                sonidoClick.play();

                if(!primera){

                    primera = carta;

                }else if(!segunda){

                    segunda = carta;
                    intentos++;
                    bloqueado = true;

                    setTimeout(()=>{

                        if(primera.img.src === segunda.img.src){

                            primera.encontrada = true;
                            segunda.encontrada = true;

                            sonidoMatch.currentTime = 0;
                            sonidoMatch.play();

                        }else{

                            primera.abierta = false;
                            segunda.abierta = false;
                        }

                        primera = null;
                        segunda = null;
                        bloqueado = false;

                    },700);
                }
            }
        });
    });

    // =================================================
    // ESTRELLA
    // =================================================

    function estrella(cx,cy,r1,r2,puntas){

        let rot = Math.PI / 2 * 3;
        let paso = Math.PI / puntas;

        ctx.beginPath();
        ctx.moveTo(cx, cy-r1);

        for(let i=0;i<puntas;i++){

            let x = cx + Math.cos(rot) * r1;
            let y = cy + Math.sin(rot) * r1;

            ctx.lineTo(x,y);

            rot += paso;

            x = cx + Math.cos(rot) * r2;
            y = cy + Math.sin(rot) * r2;

            ctx.lineTo(x,y);

            rot += paso;
        }

        ctx.closePath();
        ctx.fill();
    }

    // =================================================
    // CARTA TAPADA
    // =================================================

    function cartaTapada(x,y){

        ctx.fillStyle = "rgba(0,0,0,.25)";

        ctx.beginPath();
        ctx.roundRect(x+6, y+8, anchoCarta, altoCarta, 30);
        ctx.fill();

        const grad = ctx.createLinearGradient(x, y, x, y + altoCarta);

        grad.addColorStop(0,"#9d5cff");
        grad.addColorStop(.5,"#7a43ec");
        grad.addColorStop(1,"#5620c7");

        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.roundRect(x, y, anchoCarta, altoCarta, 30);
        ctx.fill();

        ctx.shadowColor = "#b58cff";
        ctx.shadowBlur = 18;

        ctx.strokeStyle = "rgba(255,255,255,.28)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(255,255,255,.92)";

        estrella(x+34,y+35,10,5,5);
        estrella(x+125,y+38,9,4,5);
        estrella(x+78,y+80,13,6,5);
        estrella(x+128,y+128,8,4,5);
        estrella(x+38,y+128,7,3,5);

        ctx.fillStyle = "rgba(255,255,255,.40)";

        estrella(x+62,y+42,5,2,5);
        estrella(x+100,y+120,4,2,5);

        ctx.fillStyle = "rgba(255,255,255,.16)";

        ctx.beginPath();
        ctx.roundRect(x+12, y+12, anchoCarta-24, 32, 18);
        ctx.fill();
    }

    // =================================================
    // IMAGEN SIN DEFORMAR
    // =================================================

    function drawCoverImage(img,x,y,w,h){

        const imgRatio = img.width / img.height;
        const boxRatio = w / h;

        let drawWidth;
        let drawHeight;

        if(imgRatio > boxRatio){

            drawHeight = h;
            drawWidth = h * imgRatio;

        }else{

            drawWidth = w;
            drawHeight = w / imgRatio;
        }

        const dx = x + (w - drawWidth)/2;
        const dy = y + (h - drawHeight)/2;

        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    }

    // =================================================
    // LOOP
    // =================================================

    function loop(){

        const fondo = ctx.createLinearGradient(0, 0, BASE_W, BASE_H);

        fondo.addColorStop(0,"#180028");
        fondo.addColorStop(.5,"#29004f");
        fondo.addColorStop(1,"#35106e");

        ctx.fillStyle = fondo;
        ctx.fillRect(0,0,BASE_W,BASE_H);

        ctx.fillStyle = "rgba(17,14,38,.88)";

        ctx.beginPath();
        ctx.roundRect(65, 60, 1350, 900, 50);
        ctx.fill();

        const top = ctx.createLinearGradient(80, 70, 1300, 170);

        top.addColorStop(0,"#ff9ecf");
        top.addColorStop(.5,"#c77dff");
        top.addColorStop(1,"#ff8fd8");

        ctx.fillStyle = top;

        ctx.beginPath();
        ctx.roundRect(90, 70, 1270, 120, 36);
        ctx.fill();

        ctx.textAlign = "center";

        ctx.fillStyle = "rgba(0,0,0,.18)";
        ctx.font = "bold 42px 'Baloo 2'";
        ctx.fillText("MEMORAMA SNOOPY", 728, 136);

        ctx.fillStyle = "white";
        ctx.fillText("MEMORAMA SNOOPY", 723, 130);

        ctx.font = "18px 'Baloo 2'";
        ctx.fillStyle = "rgba(255,255,255,.85)";
        ctx.fillText("Encuentra todas las parejas ✨", 725, 165);

        ctx.fillStyle = "rgba(255,255,255,.08)";

        ctx.beginPath();
        ctx.roundRect(150, 220, 280, 65, 22);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(1020, 220, 280, 65, 22);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 22px 'Baloo 2'";

        ctx.fillText("🎯 Intentos: " + intentos, 290, 262);

        const pares = cartas.filter(c=>c.encontrada).length / 2;

        ctx.fillText("⭐ Pares: " + pares + "/10", 1160, 262);

        cartas.forEach((carta,i)=>{

            const x = (i % 5) * espacioX + inicioX;
            const y = Math.floor(i / 5) * espacioY + inicioY;

            if(carta.abierta || carta.encontrada){

                ctx.fillStyle = "rgba(0,0,0,.22)";

                ctx.beginPath();
                ctx.roundRect(x+6, y+8, anchoCarta, altoCarta, 30);
                ctx.fill();

                const abierta = ctx.createLinearGradient(x, y, x, y+altoCarta);

                abierta.addColorStop(0,"#ffffff");
                abierta.addColorStop(.5,"#f6ecff");
                abierta.addColorStop(1,"#eadcff");

                ctx.fillStyle = abierta;

                ctx.beginPath();
                ctx.roundRect(x, y, anchoCarta, altoCarta, 30);
                ctx.fill();

                ctx.strokeStyle = "rgba(255,255,255,.85)";
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.save();

                ctx.beginPath();
                ctx.roundRect(x+8, y+8, anchoCarta-16, altoCarta-16, 24);
                ctx.clip();

                drawCoverImage(
                    carta.img,
                    x+8,
                    y+8,
                    anchoCarta-16,
                    altoCarta-16
                );

                ctx.restore();

            }else{

                cartaTapada(x,y);
            }
        });

        if(pares === 10 && !sonidoVictoria){

            sonidoWin.currentTime = 0;
            sonidoWin.play();

            sonidoVictoria = true;
        }

        if(pares === 10){

            ctx.fillStyle = "rgba(0,0,0,.82)";
            ctx.fillRect(0,0,BASE_W,BASE_H);

            ctx.fillStyle = "white";

            ctx.shadowColor = "#b88cff";
            ctx.shadowBlur = 40;

            ctx.font = "bold 82px 'Baloo 2'";
            ctx.fillText("¡LO LOGRASTE!", 725, 430);

            ctx.shadowBlur = 0;

            ctx.font = "bold 36px 'Baloo 2'";
            ctx.fillText("Intentos: " + intentos, 725, 500);
        }

        requestAnimationFrame(loop);
    }

    loop();
}