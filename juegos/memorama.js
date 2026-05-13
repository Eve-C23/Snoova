function juegoMemorama(container){

    container.innerHTML = "";

    // ======================================
    // MENSAJE GIRAR CELULAR
    // ======================================

    const aviso = document.createElement("div");

    aviso.style.position = "fixed";
    aviso.style.top = "0";
    aviso.style.left = "0";

    aviso.style.width = "100%";
    aviso.style.height = "100%";

    aviso.style.background =
    "linear-gradient(to bottom,#2b004f,#120021)";

    aviso.style.display = "none";

    aviso.style.flexDirection = "column";
    aviso.style.justifyContent = "center";
    aviso.style.alignItems = "center";

    aviso.style.textAlign = "center";

    aviso.style.color = "white";

    aviso.style.fontFamily = "Poppins";

    aviso.style.zIndex = "999999";

    aviso.innerHTML = `

        <h1 style="
            font-size:60px;
            margin-bottom:10px;
        ">
            📱
        </h1>

        <h2 style="
            font-size:32px;
            margin:0;
        ">
            Gira tu celular
        </h2>

        <p style="
            opacity:.8;
            max-width:300px;
            margin-top:15px;
            font-size:18px;
        ">
            Este juego se disfruta
            mejor en horizontal ✨
        </p>
    `;

    document.body.appendChild(aviso);

    function verificarOrientacion(){

        if(
            window.innerWidth <= 768 &&
            window.innerHeight > window.innerWidth
        ){

            aviso.style.display = "flex";

        }else{

            aviso.style.display = "none";
        }
    }

    verificarOrientacion();

    window.addEventListener(
        "resize",
        verificarOrientacion
    );

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

    function resizeCanvas(){

        if(window.innerWidth <= 768){

            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight - 40;

        }else{

            canvas.width = 1450;
            canvas.height = 980;
        }

        if(window.innerWidth <= 768){

            btn.style.right = "15px";
            btn.style.top = "15px";

        }else{

            btn.style.right = "60px";
            btn.style.top = "35px";
        }
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

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

    let anchoCarta;
    let altoCarta;

    let espacioX;
    let espacioY;

    let inicioX;
    let inicioY;

    let columnas = 5;
    
    // =================================================
    // REINICIAR
    // =================================================

    function configurarResponsive(){

    if(window.innerWidth <= 768){

            // CELULAR

            columnas = 4;

            anchoCarta = 70;
            altoCarta = 70;

            espacioX = 85;
            espacioY = 95;

            inicioX = 15;
            inicioY = 210;

        }else{

            // PC

            columnas = 5;

            anchoCarta = 155;
            altoCarta = 155;

            espacioX = 240;
            espacioY = 165;

            inicioX = 125;
            inicioY = 295;
        }
    }

    configurarResponsive();

    window.addEventListener("resize",()=>{

        configurarResponsive();
    });

    function reiniciarJuego(){

        sonidoVictoria = false;

        let personajesUsar;

        if(window.innerWidth <= 768){

            personajesUsar = imagenes.slice(0,8);

        }else{

            personajesUsar = imagenes;
        }

        cartas = [...personajesUsar,...personajesUsar];

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
            ((i % columnas)) * espacioX + inicioX;

            const y =
            Math.floor(i / columnas) * espacioY + inicioY;

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

        ctx.save();


        const fondo =
        ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );

        fondo.addColorStop(0,"#180028");
        fondo.addColorStop(.5,"#29004f");
        fondo.addColorStop(1,"#35106e");

        ctx.fillStyle = fondo;

        ctx.fillRect(0,0,canvas.width,canvas.height);

        // panel

        ctx.fillStyle =
        "rgba(17,14,38,.88)";

        ctx.beginPath();

        ctx.roundRect(
            20,
            20,
            canvas.width - 40,
            canvas.height - 40,
            35
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
            40,
            50,
            canvas.width - 80,
            100,
            30
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
            canvas.width / 2,
            136
        );

        ctx.fillStyle = "white";

        ctx.fillText(
            "MEMORAMA SNOOPY",
            canvas.width / 2,
            130
        );

        // subtitulo

        ctx.font =
        "18px 'Baloo 2'";

        ctx.fillStyle =
        "rgba(255,255,255,.85)";

        ctx.fillText(
            "Encuentra todas las parejas ✨",
            canvas.width / 2,
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
            "⭐ Pares: " + pares + "/" + (cartas.length / 2),
            1160,
            262
        );

        // cartas

        cartas.forEach((carta,i)=>{

            const x =
            (i % columnas) * espacioX + inicioX;

            const y =
            Math.floor(i / columnas) * espacioY + inicioY;

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
            pares === cartas.length / 2 &&
            !sonidoVictoria
        ){

            sonidoWin.currentTime = 0;
            sonidoWin.play();

            sonidoVictoria = true;
        }

        // ganar

        if(pares === cartas.length / 2){

            ctx.fillStyle =
            "rgba(0,0,0,.82)";

            ctx.fillRect(0,0,canvas.width,canvas.height);

            ctx.fillStyle = "white";

            ctx.shadowColor = "#b88cff";
            ctx.shadowBlur = 40;

            if(window.innerWidth <= 768){

                ctx.font = "bold 42px 'Baloo 2'";

            }else{

                ctx.font = "bold 82px 'Baloo 2'";
            }

            ctx.fillText(
                "¡LO LOGRASTE!",
                canvas.width / 2,
                430
            );

            ctx.shadowBlur = 0;

            ctx.font =
            "bold 36px 'Baloo 2'";

            ctx.fillText(
                "Intentos: " + intentos,
                canvas.width / 2,
                500
            );
        }

        ctx.restore();
        requestAnimationFrame(loop);
    }

    loop();
}