function juegoMemorama(container){

    container.innerHTML = "";

    const link = document.createElement("link");

    link.href =
    "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap";

    link.rel = "stylesheet";

    document.head.appendChild(link);

    const BASE_W = 1450;
    const BASE_H = 980;

    const wrapper = document.createElement("div");

    wrapper.style.width = "100%";
    wrapper.style.minHeight = "100dvh";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.overflow = "hidden";
    wrapper.style.padding = "10px";
    wrapper.style.fontFamily = "'Baloo 2', cursive";

    container.appendChild(wrapper);

    const canvasBox = document.createElement("div");

    canvasBox.style.position = "relative";
    canvasBox.style.display = "flex";
    canvasBox.style.alignItems = "center";
    canvasBox.style.justifyContent = "center";
    canvasBox.style.overflow = "visible";

    wrapper.appendChild(canvasBox);

    const canvas = document.createElement("canvas");

    canvas.width = BASE_W;
    canvas.height = BASE_H;

    canvas.style.borderRadius = "40px";

    // =====================================
    // MARCO BRILLANTE
    // =====================================

    canvas.style.boxShadow = `
    0 0 20px #ff8fab,
    0 0 45px rgba(168,85,247,0.55),
    0 35px 90px rgba(0,0,0,.45)
    `;

    canvas.style.border =
    "3px solid rgba(255,255,255,.08)";

    canvas.style.touchAction = "none";
    canvas.style.display = "block";
    canvas.style.transformOrigin = "center center";

    canvasBox.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // =====================================
    // AJUSTAR PANTALLA
    // =====================================

    function ajustarPantalla(){

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const escala = Math.min(

            (vw - 20) / BASE_W,

            (vh - 20) / BASE_H
        );

        const w = BASE_W * escala;
        const h = BASE_H * escala;

        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        canvasBox.style.width = w + "px";
        canvasBox.style.height = h + "px";
    }

    window.addEventListener(
        "resize",
        ajustarPantalla
    );

    window.addEventListener(
        "orientationchange",
        ()=>{

            setTimeout(
                ajustarPantalla,
                300
            );
        }
    );

    ajustarPantalla();

    // =====================================
    // PERSONAJES
    // =====================================

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

    const imagenes = [];

    personajes.forEach(ruta=>{

        const img = new Image();

        img.src = ruta;

        imagenes.push(img);
    });

    // =====================================
    // AUDIO
    // =====================================

    const sonidoClick =
    new Audio("audio/sonido1.mp3");

    const sonidoWin =
    new Audio("audio/victoria.mp3");

    const sonidoMatch =
    new Audio("audio/match.mp3");

    const sonidoGameOver =
    new Audio("audio/gameover.mp3");

    sonidoClick.volume = 0.5;
    sonidoWin.volume = 0.7;
    sonidoMatch.volume = 0.6;
    sonidoGameOver.volume = 0.7;

    // =====================================
    // MUSICA DE FONDO
    // =====================================

    const musicaFondo = new Audio(
        "audio/musica.mp3"
    );

    musicaFondo.volume = 0.5;
    musicaFondo.loop = true;

    // =====================================
    // VARIABLES
    // =====================================

    let cartas = [];

    let primera = null;

    let segunda = null;

    let bloqueado = false;

    let intentos = 0;

    let sonidoVictoria = false;

    // =====================================
    // TOP 5 MEJORES INTENTOS
    // =====================================

    let mejoresIntentos =
    JSON.parse(

        localStorage.getItem(
            "topMemorama"
        )

    ) || [];

    let scoreGuardado = false;

    function guardarIntento(){

        mejoresIntentos.push(
            intentos
        );

        mejoresIntentos.sort(
            (a,b)=> a-b
        );

        mejoresIntentos =
        mejoresIntentos.slice(0,5);

        localStorage.setItem(

            "topMemorama",

            JSON.stringify(
                mejoresIntentos
            )
        );
    }

    const anchoCarta = 155;
    const altoCarta = 155;

    const espacioX = 240;
    const espacioY = 165;

    const inicioX = 125;
    const inicioY = 295;

    // =====================================
    // REINICIAR
    // =====================================

    function reiniciarJuego(){

        sonidoGameOver.pause();

        sonidoGameOver.currentTime = 0;

        musicaFondo.currentTime = 0;

        musicaFondo.play();

        sonidoVictoria = false;

        scoreGuardado = false;

        cartas = [
            ...imagenes,
            ...imagenes
        ];

        cartas.sort(
            ()=>Math.random() - 0.5
        );

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

    // =====================================
    // CLICK
    // =====================================

    canvas.addEventListener(
        "pointerdown",
        e=>{

        const pares =
        cartas.filter(
            c=>c.encontrada
        ).length / 2;

        if(
            musicaFondo.paused &&
            pares !== 10
        ){

            musicaFondo.play();
        }

        if(bloqueado) return;

        if(pares === 10){

            reiniciarJuego();

            return;
        }

        const rect =
        canvas.getBoundingClientRect();

        const mx =
        (e.clientX - rect.left) *
        (BASE_W / rect.width);

        const my =
        (e.clientY - rect.top) *
        (BASE_H / rect.height);

        cartas.forEach((carta,i)=>{

            const x =
            (i % 5) *
            espacioX + inicioX;

            const y =
            Math.floor(i / 5) *
            espacioY + inicioY;

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

    // =====================================
    // ESTRELLA
    // =====================================

    function estrella(
        cx,
        cy,
        r1,
        r2,
        puntas
    ){

        let rot =
        Math.PI / 2 * 3;

        let paso =
        Math.PI / puntas;

        ctx.beginPath();

        ctx.moveTo(
            cx,
            cy-r1
        );

        for(let i=0;i<puntas;i++){

            let x =
            cx + Math.cos(rot) * r1;

            let y =
            cy + Math.sin(rot) * r1;

            ctx.lineTo(x,y);

            rot += paso;

            x =
            cx + Math.cos(rot) * r2;

            y =
            cy + Math.sin(rot) * r2;

            ctx.lineTo(x,y);

            rot += paso;
        }

        ctx.closePath();

        ctx.fill();
    }

    // =====================================
    // CARTA TAPADA
    // =====================================

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

        grad.addColorStop(
            0,
            "#9d5cff"
        );

        grad.addColorStop(
            .5,
            "#7a43ec"
        );

        grad.addColorStop(
            1,
            "#5620c7"
        );

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

        ctx.shadowColor =
        "#b58cff";

        ctx.shadowBlur = 18;

        ctx.strokeStyle =
        "rgba(255,255,255,.28)";

        ctx.lineWidth = 3;

        ctx.stroke();

        ctx.shadowBlur = 0;

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

    // =====================================
    // IMAGEN
    // =====================================

    function drawCoverImage(
        img,
        x,
        y,
        w,
        h
    ){

        if(
            !img.complete ||
            img.naturalWidth === 0
        ) return;

        const imgRatio =
        img.width / img.height;

        const boxRatio =
        w / h;

        let drawWidth;
        let drawHeight;

        if(imgRatio > boxRatio){

            drawHeight = h;

            drawWidth =
            h * imgRatio;

        }else{

            drawWidth = w;

            drawHeight =
            w / imgRatio;
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

    // =====================================
    // LOOP
    // =====================================

    function loop(){

        const fondo =
        ctx.createLinearGradient(
            0,
            0,
            BASE_W,
            BASE_H
        );

        fondo.addColorStop(
            0,
            "#180028"
        );

        fondo.addColorStop(
            .5,
            "#29004f"
        );

        fondo.addColorStop(
            1,
            "#35106e"
        );

        ctx.fillStyle = fondo;

        ctx.fillRect(
            0,
            0,
            BASE_W,
            BASE_H
        );

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

        const top =
        ctx.createLinearGradient(
            80,
            70,
            1300,
            170
        );

        top.addColorStop(
            0,
            "#ff9ecf"
        );

        top.addColorStop(
            .5,
            "#c77dff"
        );

        top.addColorStop(
            1,
            "#ff8fd8"
        );

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

        ctx.font =
        "18px 'Baloo 2'";

        ctx.fillStyle =
        "rgba(255,255,255,.85)";

        ctx.fillText(
            "Encuentra todas las parejas ✨",
            725,
            165
        );

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
        cartas.filter(
            c=>c.encontrada
        ).length / 2;

        ctx.fillText(
            "⭐ Pares: " + pares + "/10",
            1160,
            262
        );

        cartas.forEach((carta,i)=>{

            const x =
            (i % 5) *
            espacioX + inicioX;

            const y =
            Math.floor(i / 5) *
            espacioY + inicioY;

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

                abierta.addColorStop(
                    0,
                    "#ffffff"
                );

                abierta.addColorStop(
                    .5,
                    "#f6ecff"
                );

                abierta.addColorStop(
                    1,
                    "#eadcff"
                );

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

        // =====================================
        // GANAR / GAME OVER
        // =====================================

        if(
            pares === 10 &&
            !scoreGuardado
        ){

            guardarIntento();

            scoreGuardado = true;
        }

        if(
            pares === 10 &&
            !sonidoVictoria
        ){

            musicaFondo.pause();

            musicaFondo.currentTime = 0;

            sonidoWin.currentTime = 0;

            sonidoWin.play();

            sonidoVictoria = true;
        }

        if(pares === 10){

            ctx.fillStyle =
            "rgba(0,0,0,.55)";

            ctx.fillRect(
                0,
                0,
                BASE_W,
                BASE_H
            );

            let panelX = 455;
            let panelY = 170;

            let panelW = 540;
            let panelH = 590;

            let gradiente =
            ctx.createLinearGradient(
                panelX,
                panelY,
                panelX,
                panelY + panelH
            );

            gradiente.addColorStop(
                0,
                "rgba(115,70,170,.45)"
            );

            gradiente.addColorStop(
                1,
                "rgba(55,25,90,.38)"
            );

            ctx.fillStyle = gradiente;

            ctx.beginPath();

            ctx.roundRect(
                panelX,
                panelY,
                panelW,
                panelH,
                28
            );

            ctx.fill();

            ctx.strokeStyle =
            "rgba(255,255,255,.35)";

            ctx.lineWidth = 2;

            ctx.stroke();

            ctx.textAlign = "center";

            ctx.fillStyle = "white";

            ctx.font =
            "bold 60px 'Baloo 2'";

            ctx.fillText(
                "¡LO LOGRASTE!",
                725,
                270
            );

            ctx.font =
            "bold 26px 'Baloo 2'";

            ctx.fillStyle =
            "rgba(255,255,255,.95)";

            ctx.fillText(
                "Intentos: " + intentos,
                725,
                325
            );

            ctx.font =
            "bold 34px 'Baloo 2'";

            ctx.fillStyle =
            "#ffd43b";

            ctx.fillText(
                "🏆 TOP 5",
                725,
                395
            );

            ctx.font =
            "bold 26px 'Baloo 2'";

            ctx.fillStyle =
            "white";

            mejoresIntentos.forEach((p,i)=>{

                ctx.fillText(

                    (i+1) +
                    ". " +
                    p +
                    " intentos",

                    725,

                    445 + (i*38)
                );
            });

            ctx.font =
            "bold 20px 'Baloo 2'";

            ctx.fillStyle =
            "rgba(255,255,255,.92)";

            ctx.fillText(
                "Toca la pantalla para jugar otra vez",
                725,
                705
            );
        }

        requestAnimationFrame(loop);
    }

    loop();
}