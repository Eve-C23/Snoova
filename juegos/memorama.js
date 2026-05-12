function juegoMemorama(container){

    container.innerHTML = "";

    

    // =================================================
    // FUENTE
    // =================================================

    const link = document.createElement("link");

    link.href =
    "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap";

    link.rel = "stylesheet";

    document.head.appendChild(link);

    // =================================================
    // CONTENEDOR
    // =================================================

    const wrapper = document.createElement("div");

    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.position = "relative";
    wrapper.style.padding = "20px";

    container.appendChild(wrapper);

    // =================================================
    // BOTÓN
    // =================================================

    const btn = document.createElement("button");

    btn.innerText = "⟳ Reiniciar";

    btn.style.position = "absolute";
    btn.style.top = "35px";
    btn.style.right = "60px";
    btn.style.zIndex = "10";

    btn.style.padding = "12px 24px";
    btn.style.border = "2px solid rgba(255,255,255,.15)";
    btn.style.borderRadius = "18px";

    btn.style.fontSize = "16px";
    btn.style.fontFamily = "'Baloo 2'";
    btn.style.fontWeight = "700";

    btn.style.cursor = "pointer";

    btn.style.background =
    "linear-gradient(135deg,#ff69c8,#8f7cff)";

    btn.style.color = "white";

    btn.style.boxShadow =
    "0 10px 25px rgba(0,0,0,.28)";

    btn.style.transition = ".25s";

    btn.onmouseenter = ()=>{

        btn.style.transform =
        "translateY(-2px) scale(1.03)";
    };

    btn.onmouseleave = ()=>{

        btn.style.transform =
        "translateY(0px)";
    };

    wrapper.appendChild(btn);

    // =================================================
    // CANVAS
    // =================================================

    const canvas = document.createElement("canvas");

    canvas.width = 1450;
    canvas.height = 980;

    // ======================================
    // RESPONSIVE SOLO VISUAL
    // ======================================

    function ajustarCanvas(){

        if(window.innerWidth <= 768){

            canvas.style.width = "95vw";
            canvas.style.height = "auto";

        }else{

            canvas.style.width = "1450px";
            canvas.style.height = "980px";
        }
    }

    ajustarCanvas();

    window.addEventListener(
        "resize",
        ajustarCanvas
    );

    canvas.style.borderRadius = "40px";

    canvas.style.boxShadow =
    "0 35px 90px rgba(0,0,0,.45)";

    canvas.style.border =
    "2px solid rgba(255,255,255,.08)";

    wrapper.appendChild(canvas);

    const ctx = canvas.getContext("2d");

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

    const sonidoClick = new Audio(
        "audio/sonido1.mp3"
    );

    const sonidoWin = new Audio(
        "audio/victoria.mp3"
    );

    const sonidoMatch = new Audio(
        "audio/match.mp3"
    );

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
    // TAMAÑOS
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

        cartas = [...imagenes,...imagenes];

        cartas.sort(()=>Math.random()-0.5);

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
    // CLICK
    // =================================================

    canvas.addEventListener("click",e=>{

        if(bloqueado) return;

        const rect = canvas.getBoundingClientRect();

        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        cartas.forEach((carta,i)=>{

            const x =
            (i % 5) * espacioX + inicioX;

            const y =
            Math.floor(i / 5) * espacioY + inicioY;

            if(

                mx > x &&
                mx < x + anchoCarta &&
                my > y &&
                my < y + altoCarta

            ){

                if(
                    carta.abierta ||
                    carta.encontrada
                ) return;

                carta.abierta = true;

                // sonido click

                sonidoClick.currentTime = 0;
                sonidoClick.play();

                if(!primera){

                    primera = carta;

                }else if(!segunda){

                    segunda = carta;

                    intentos++;

                    bloqueado = true;

                    setTimeout(()=>{

                        if(
                            primera.img.src ===
                            segunda.img.src
                        ){

                            primera.encontrada = true;
                            segunda.encontrada = true;

                            // sonido pareja

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

        ctx.fillStyle =
        "rgba(0,0,0,.25)";

        ctx.beginPath();

        ctx.roundRect(
            x+6,
            y+8,
            anchoCarta,
            altoCarta,
            30
        );

        ctx.fill();

        const grad =
        ctx.createLinearGradient(
            x,
            y,
            x,
            y + altoCarta
        );

        grad.addColorStop(0,"#9d5cff");
        grad.addColorStop(.5,"#7a43ec");
        grad.addColorStop(1,"#5620c7");

        ctx.fillStyle = grad;

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            anchoCarta,
            altoCarta,
            30
        );

        ctx.fill();

        ctx.shadowColor = "#b58cff";
        ctx.shadowBlur = 18;

        ctx.strokeStyle =
        "rgba(255,255,255,.28)";

        ctx.lineWidth = 3;

        ctx.stroke();

        ctx.shadowBlur = 0;

        // estrellas

        ctx.fillStyle =
        "rgba(255,255,255,.92)";

        estrella(x+34,y+35,10,5,5);
        estrella(x+125,y+38,9,4,5);
        estrella(x+78,y+80,13,6,5);
        estrella(x+128,y+128,8,4,5);
        estrella(x+38,y+128,7,3,5);

        ctx.fillStyle =
        "rgba(255,255,255,.40)";

        estrella(x+62,y+42,5,2,5);
        estrella(x+100,y+120,4,2,5);

        ctx.fillStyle =
        "rgba(255,255,255,.16)";

        ctx.beginPath();

        ctx.roundRect(
            x+12,
            y+12,
            anchoCarta-24,
            32,
            18
        );

        ctx.fill();
    }

    // =================================================
    // IMAGEN SIN DEFORMAR
    // =================================================

    function drawCoverImage(img,x,y,w,h){

        const imgRatio =
        img.width / img.height;

        const boxRatio =
        w / h;

        let drawWidth;
        let drawHeight;

        if(imgRatio > boxRatio){

            drawHeight = h;
            drawWidth = h * imgRatio;

        }else{

            drawWidth = w;
            drawHeight = w / imgRatio;
        }

        const dx =
        x + (w - drawWidth)/2;

        const dy =
        y + (h - drawHeight)/2;

        ctx.drawImage(
            img,
            dx,
            dy,
            drawWidth,
            drawHeight
        );
    }

    // =================================================
    // LOOP
    // =================================================

    function loop(){

        const fondo =
        ctx.createLinearGradient(
            0,
            0,
            1450,
            980
        );

        fondo.addColorStop(0,"#180028");
        fondo.addColorStop(.5,"#29004f");
        fondo.addColorStop(1,"#35106e");

        ctx.fillStyle = fondo;

        ctx.fillRect(0,0,1450,980);

        // panel

        ctx.fillStyle =
        "rgba(17,14,38,.88)";

        ctx.beginPath();

        ctx.roundRect(
            65,
            60,
            1350,
            900,
            50
        );

        ctx.fill();

        // header

        const top =
        ctx.createLinearGradient(
            80,
            70,
            1300,
            170
        );

        top.addColorStop(0,"#ff9ecf");
        top.addColorStop(.5,"#c77dff");
        top.addColorStop(1,"#ff8fd8");

        ctx.fillStyle = top;

        ctx.beginPath();

        ctx.roundRect(
            90,
            70,
            1270,
            120,
            36
        );

        ctx.fill();

        // titulo

        ctx.textAlign = "center";

        ctx.fillStyle =
        "rgba(0,0,0,.18)";

        ctx.font =
        "bold 42px 'Baloo 2'";

        ctx.fillText(
            "MEMORAMA SNOOPY",
            728,
            136
        );

        ctx.fillStyle = "white";

        ctx.fillText(
            "MEMORAMA SNOOPY",
            723,
            130
        );

        // subtitulo

        ctx.font =
        "18px 'Baloo 2'";

        ctx.fillStyle =
        "rgba(255,255,255,.85)";

        ctx.fillText(
            "Encuentra todas las parejas ✨",
            725,
            165
        );

        // stats

        ctx.fillStyle =
        "rgba(255,255,255,.08)";

        ctx.beginPath();

        ctx.roundRect(
            150,
            220,
            280,
            65,
            22
        );

        ctx.fill();

        ctx.beginPath();

        ctx.roundRect(
            1020,
            220,
            280,
            65,
            22
        );

        ctx.fill();

        ctx.fillStyle = "white";

        ctx.font =
        "bold 22px 'Baloo 2'";

        ctx.fillText(
            "🎯 Intentos: " + intentos,
            290,
            262
        );

        const pares =
        cartas.filter(c=>c.encontrada).length / 2;

        ctx.fillText(
            "⭐ Pares: " + pares + "/10",
            1160,
            262
        );

        // cartas

        cartas.forEach((carta,i)=>{

            const x =
            (i % 5) * espacioX + inicioX;

            const y =
            Math.floor(i / 5) * espacioY + inicioY;

            if(
                carta.abierta ||
                carta.encontrada
            ){

                ctx.fillStyle =
                "rgba(0,0,0,.22)";

                ctx.beginPath();

                ctx.roundRect(
                    x+6,
                    y+8,
                    anchoCarta,
                    altoCarta,
                    30
                );

                ctx.fill();

                const abierta =
                ctx.createLinearGradient(
                    x,
                    y,
                    x,
                    y+altoCarta
                );

                abierta.addColorStop(0,"#ffffff");
                abierta.addColorStop(.5,"#f6ecff");
                abierta.addColorStop(1,"#eadcff");

                ctx.fillStyle = abierta;

                ctx.beginPath();

                ctx.roundRect(
                    x,
                    y,
                    anchoCarta,
                    altoCarta,
                    30
                );

                ctx.fill();

                ctx.strokeStyle =
                "rgba(255,255,255,.85)";

                ctx.lineWidth = 3;

                ctx.stroke();

                ctx.save();

                ctx.beginPath();

                ctx.roundRect(
                    x+8,
                    y+8,
                    anchoCarta-16,
                    altoCarta-16,
                    24
                );

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

        // sonido victoria

        if(
            pares === 10 &&
            !sonidoVictoria
        ){

            sonidoWin.currentTime = 0;
            sonidoWin.play();

            sonidoVictoria = true;
        }

        // ganar

        if(pares === 10){

            ctx.fillStyle =
            "rgba(0,0,0,.82)";

            ctx.fillRect(0,0,1450,980);

            ctx.fillStyle = "white";

            ctx.shadowColor = "#b88cff";
            ctx.shadowBlur = 40;

            ctx.font =
            "bold 82px 'Baloo 2'";

            ctx.fillText(
                "¡LO LOGRASTE!",
                725,
                430
            );

            ctx.shadowBlur = 0;

            ctx.font =
            "bold 36px 'Baloo 2'";

            ctx.fillText(
                "Intentos: " + intentos,
                725,
                500
            );
        }

        requestAnimationFrame(loop);
    }

    loop();
}