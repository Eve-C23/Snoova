function juegoMemorama(container){

    // Limpia el contenido anterior del contenedor
    container.innerHTML = "";

    // ======================================
    // FUENTE PERSONALIZADA
    // ======================================

    // Crea una etiqueta <link>
    const link = document.createElement("link");

    // Ruta de la fuente de Google Fonts
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap";

    // Define que es una hoja de estilos
    link.rel = "stylesheet";

    // Agrega la fuente al documento
    document.head.appendChild(link);

    // ======================================
    // TAMAÑO BASE DEL JUEGO
    // ======================================

    // Ancho base del canvas
    const BASE_W = 1450;

    // Alto base del canvas
    const BASE_H = 980;

    // ======================================
    // CONTENEDOR PRINCIPAL
    // ======================================

    // Crea un div contenedor
    const wrapper = document.createElement("div");

    // Ocupa todo el ancho disponible
    wrapper.style.width = "100%";

    // Altura mínima igual a la pantalla
    wrapper.style.minHeight = "100dvh";

    // Activa flexbox
    wrapper.style.display = "flex";

    // Centra verticalmente
    wrapper.style.alignItems = "center";

    // Centra horizontalmente
    wrapper.style.justifyContent = "center";

    // Incluye padding dentro del tamaño
    wrapper.style.boxSizing = "border-box";

    // Oculta lo que sobresalga
    wrapper.style.overflow = "hidden";

    // Espacio interior
    wrapper.style.padding = "10px";

    // Fuente del juego
    wrapper.style.fontFamily = "'Baloo 2', cursive";

    // Agrega el wrapper al contenedor principal
    container.appendChild(wrapper);

    // ======================================
    // CONTENEDOR DEL CANVAS
    // ======================================

    // Caja donde estará el canvas
    const canvasBox = document.createElement("div");

    // Posición relativa
    canvasBox.style.position = "relative";

    // Flexbox
    canvasBox.style.display = "flex";

    // Centra verticalmente
    canvasBox.style.alignItems = "center";

    // Centra horizontalmente
    canvasBox.style.justifyContent = "center";

    // Permite que sobresalgan elementos
    canvasBox.style.overflow = "visible";

    // Agrega la caja al wrapper
    wrapper.appendChild(canvasBox);

    // ======================================
    // CREACIÓN DEL CANVAS
    // ======================================

    // Crea el canvas del juego
    const canvas = document.createElement("canvas");

    // Tamaño interno del canvas
    canvas.width = BASE_W;
    canvas.height = BASE_H;

    // Bordes redondeados
    canvas.style.borderRadius = "40px";

    // Sombra del canvas
    canvas.style.boxShadow = "0 35px 90px rgba(255, 255, 255, 0.67)";

    // Borde transparente
    canvas.style.border = "2px solid rgb(255, 255, 255)";

    // Evita gestos táctiles automáticos
    canvas.style.touchAction = "none";

    // Elimina espacios extra
    canvas.style.display = "block";

    // Punto de transformación
    canvas.style.transformOrigin = "center center";

    // Agrega el canvas al contenedor
    canvasBox.appendChild(canvas);

    // Contexto 2D para dibujar
    const ctx = canvas.getContext("2d");

    // ======================================
    // AJUSTAR TAMAÑO RESPONSIVE
    // ======================================

    function ajustarPantalla(){

        // Ancho visible de la ventana
        const vw = window.innerWidth;

        // Alto visible de la ventana
        const vh = window.innerHeight;

        // Escala proporcional
        const escala = Math.min(
            (vw - 20) / BASE_W,
            (vh - 20) / BASE_H
        );

        // Nuevo ancho escalado
        const w = BASE_W * escala;

        // Nuevo alto escalado
        const h = BASE_H * escala;

        // Cambia tamaño visual del canvas
        canvas.style.width = w + "px";

        // Cambia altura visual del canvas
        canvas.style.height = h + "px";

        // Ajusta tamaño del contenedor
        canvasBox.style.width = w + "px";
        canvasBox.style.height = h + "px";
    }

    // Detecta cambio de tamaño de ventana
    window.addEventListener("resize", ajustarPantalla);

    // Detecta cuando el celular gira
    window.addEventListener("orientationchange", ()=>{

        // Espera un poco antes de reajustar
        setTimeout(ajustarPantalla, 300);
    });

    // Ejecuta ajuste inicial
    ajustarPantalla();

    // ======================================
    // IMÁGENES DE PERSONAJES
    // ======================================

    // Arreglo con las rutas de las imágenes
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

    // Arreglo donde se guardarán las imágenes cargadas
    const imagenes = [];

    // Recorre cada ruta del arreglo personajes
    personajes.forEach(ruta=>{

        // Crea una nueva imagen
        const img = new Image();

        // Asigna la ruta de la imagen
        img.src = ruta;

        // Guarda la imagen en el arreglo
        imagenes.push(img);
    });

    // ======================================
    // SONIDOS DEL JUEGO
    // ======================================

    // Sonido al tocar una carta
    const sonidoClick = new Audio("audio/sonido1.mp3");

    // Sonido de victoria
    const sonidoWin = new Audio("audio/victoria.mp3");

    // Sonido al encontrar pareja
    const sonidoMatch = new Audio("audio/match.mp3");

    // Volumen del sonido click
    sonidoClick.volume = 0.5;

    // Volumen del sonido de victoria
    sonidoWin.volume = 0.7;

    // Volumen del sonido match
    sonidoMatch.volume = 0.6;

    // ======================================
    // VARIABLES PRINCIPALES DEL JUEGO
    // ======================================

    // Arreglo de cartas
    let cartas = [];

    // Primera carta seleccionada
    let primera = null;

    // Segunda carta seleccionada
    let segunda = null;

    // Bloquea el juego mientras compara cartas
    let bloqueado = false;

    // Número de intentos realizados
    let intentos = 0;

    // Evita repetir el sonido de victoria
    let sonidoVictoria = false;

    // ======================================
    // MEDIDAS Y POSICIONES DE LAS CARTAS
    // ======================================

    // Ancho de cada carta
    const anchoCarta = 155;

    // Alto de cada carta
    const altoCarta = 155;

    // Espacio horizontal entre cartas
    const espacioX = 240;

    // Espacio vertical entre cartas
    const espacioY = 165;

    // Posición inicial horizontal
    const inicioX = 125;

    // Posición inicial vertical
    const inicioY = 295;

    // ======================================
    // FUNCIÓN PARA REINICIAR EL JUEGO
    // ======================================

    function reiniciarJuego(){

        // Permite volver a reproducir el sonido de victoria
        sonidoVictoria = false;

        // Duplica las imágenes para crear parejas
        cartas = [...imagenes, ...imagenes];

        // Mezcla aleatoriamente las cartas
        cartas.sort(()=>Math.random() - 0.5);

        // Convierte cada imagen en un objeto carta
        cartas = cartas.map(img=>({

            // Imagen de la carta
            img: img,

            // Indica si está volteada
            abierta: false,

            // Indica si ya fue encontrada
            encontrada: false
        }));

        // Reinicia cartas seleccionadas
        primera = null;
        segunda = null;

        // Desbloquea el juego
        bloqueado = false;

        // Reinicia los intentos
        intentos = 0;
    }

    // Inicia el juego por primera vez
    reiniciarJuego();

    // ======================================
    // DETECTAR TOQUES / CLICKS EN EL CANVAS
    // ======================================

    canvas.addEventListener("pointerdown", e=>{

        // Si el juego está bloqueado no permite tocar
        if(bloqueado) return;

        // Cuenta los pares encontrados
        const pares = cartas.filter(c=>c.encontrada).length / 2;

        // Si ya ganó, reinicia el juego al tocar
        if(pares === 10){
            reiniciarJuego();
            return;
        }

        // Obtiene la posición y tamaño visual del canvas
        const rect = canvas.getBoundingClientRect();

        // Convierte coordenada X al tamaño real del canvas
        const mx = (e.clientX - rect.left) * (BASE_W / rect.width);

        // Convierte coordenada Y al tamaño real del canvas
        const my = (e.clientY - rect.top) * (BASE_H / rect.height);

        // Recorre todas las cartas
        cartas.forEach((carta,i)=>{

            // Calcula posición X de la carta
            const x = (i % 5) * espacioX + inicioX;

            // Calcula posición Y de la carta
            const y = Math.floor(i / 5) * espacioY + inicioY;

            // Verifica si el toque fue dentro de la carta
            if(
                mx > x &&
                mx < x + anchoCarta &&
                my > y &&
                my < y + altoCarta
            ){

                // Si ya está abierta o encontrada no hace nada
                if(carta.abierta || carta.encontrada) return;

                // Voltea la carta
                carta.abierta = true;

                // Reinicia el sonido desde el inicio
                sonidoClick.currentTime = 0;

                // Reproduce el sonido
                sonidoClick.play();

                // Si aún no hay primera carta seleccionada
                if(!primera){

                    // Guarda la primera carta
                    primera = carta;

                }else if(!segunda){

                    // Guarda la segunda carta
                    segunda = carta;

                    // Aumenta los intentos
                    intentos++;

                    // Bloquea temporalmente el juego
                    bloqueado = true;

                    // Espera antes de comparar cartas
                    setTimeout(()=>{

                        // Si ambas imágenes son iguales
                        if(primera.img.src === segunda.img.src){

                            // Marca las cartas como encontradas
                            primera.encontrada = true;
                            segunda.encontrada = true;

                            // Reinicia sonido match
                            sonidoMatch.currentTime = 0;

                            // Reproduce sonido match
                            sonidoMatch.play();

                        }else{

                            // Si no coinciden las vuelve a tapar
                            primera.abierta = false;
                            segunda.abierta = false;
                        }

                        // Limpia selección de cartas
                        primera = null;
                        segunda = null;

                        // Desbloquea el juego
                        bloqueado = false;

                    },700);
                }
            }
        });
    });

        // ======================================
    // FUNCIÓN PARA DIBUJAR ESTRELLAS
    // ======================================

    function estrella(cx,cy,r1,r2,puntas){

        // Rotación inicial de la estrella
        let rot = Math.PI / 2 * 3;

        // Distancia entre cada punta
        let paso = Math.PI / puntas;

        // Inicia el dibujo
        ctx.beginPath();

        // Punto inicial
        ctx.moveTo(cx, cy-r1);

        // Repite según el número de puntas
        for(let i=0;i<puntas;i++){

            // Coordenadas de la punta exterior
            let x = cx + Math.cos(rot) * r1;
            let y = cy + Math.sin(rot) * r1;

            // Dibuja línea
            ctx.lineTo(x,y);

            // Avanza rotación
            rot += paso;

            // Coordenadas de la punta interior
            x = cx + Math.cos(rot) * r2;
            y = cy + Math.sin(rot) * r2;

            // Dibuja línea
            ctx.lineTo(x,y);

            // Avanza rotación otra vez
            rot += paso;
        }

        // Cierra la figura
        ctx.closePath();

        // Rellena la estrella
        ctx.fill();
    }

    // ======================================
    // FUNCIÓN PARA DIBUJAR CARTAS TAPADAS
    // ======================================

    function cartaTapada(x,y){

        // Color de sombra
        ctx.fillStyle = "rgba(0,0,0,.25)";

        // Inicia forma
        ctx.beginPath();

        // Dibuja sombra redondeada
        ctx.roundRect(x+6, y+8, anchoCarta, altoCarta, 30);

        // Rellena sombra
        ctx.fill();

        // Crea gradiente de color
        const grad = ctx.createLinearGradient(x, y, x, y + altoCarta);

        // Color superior
        grad.addColorStop(0,"#9d5cff");

        // Color medio
        grad.addColorStop(.5,"#7a43ec");

        // Color inferior
        grad.addColorStop(1,"#5620c7");

        // Aplica gradiente
        ctx.fillStyle = grad;

        // Inicia forma principal
        ctx.beginPath();

        // Dibuja carta redondeada
        ctx.roundRect(x, y, anchoCarta, altoCarta, 30);

        // Rellena carta
        ctx.fill();

        // Color del brillo
        ctx.shadowColor = "#b58cff";

        // Intensidad del brillo
        ctx.shadowBlur = 18;

        // Color del borde
        ctx.strokeStyle = "rgba(255,255,255,.28)";

        // Grosor del borde
        ctx.lineWidth = 3;

        // Dibuja borde
        ctx.stroke();

        // Quita brillo después del borde
        ctx.shadowBlur = 0;

        // Color de estrellas principales
        ctx.fillStyle = "rgba(255,255,255,.92)";

        // Dibuja estrellas decorativas
        estrella(x+34,y+35,10,5,5);
        estrella(x+125,y+38,9,4,5);
        estrella(x+78,y+80,13,6,5);
        estrella(x+128,y+128,8,4,5);
        estrella(x+38,y+128,7,3,5);

        // Color de estrellas pequeñas
        ctx.fillStyle = "rgba(255,255,255,.40)";

        // Dibuja estrellas pequeñas
        estrella(x+62,y+42,5,2,5);
        estrella(x+100,y+120,4,2,5);

        // Color del brillo decorativo
        ctx.fillStyle = "rgba(255,255,255,.16)";

        // Inicia figura decorativa
        ctx.beginPath();

        // Dibuja rectángulo decorativo superior
        ctx.roundRect(x+12, y+12, anchoCarta-24, 32, 18);

        // Rellena decoración
        ctx.fill();
    }

    // ======================================
    // FUNCIÓN PARA DIBUJAR IMÁGENES
    // ======================================

    function drawCoverImage(img,x,y,w,h){

        // Si la imagen no cargó correctamente no dibuja
        if(!img.complete || img.naturalWidth === 0) return;

        // Relación ancho/alto de la imagen
        const imgRatio = img.width / img.height;

        // Relación ancho/alto del espacio disponible
        const boxRatio = w / h;

        let drawWidth;
        let drawHeight;

        // Si la imagen es más ancha que el espacio
        if(imgRatio > boxRatio){

            // Ajusta altura
            drawHeight = h;

            // Calcula ancho proporcional
            drawWidth = h * imgRatio;

        }else{

            // Ajusta ancho
            drawWidth = w;

            // Calcula altura proporcional
            drawHeight = w / imgRatio;
        }

        // Centra horizontalmente
        const dx = x + (w - drawWidth)/2;

        // Centra verticalmente
        const dy = y + (h - drawHeight)/2;

        // Dibuja la imagen en el canvas
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
    }

    // ======================================
    // LOOP PRINCIPAL DEL JUEGO
    // ======================================

    function loop(){

        // Crea gradiente del fondo
        const fondo = ctx.createLinearGradient(0, 0, BASE_W, BASE_H);

        // Color superior
        fondo.addColorStop(0,"#180028");

        // Color central
        fondo.addColorStop(.5,"#29004f");

        // Color inferior
        fondo.addColorStop(1,"#35106e");

        // Aplica fondo
        ctx.fillStyle = fondo;

        // Dibuja fondo completo
        ctx.fillRect(0,0,BASE_W,BASE_H);

        // Color del panel principal
        ctx.fillStyle = "rgba(17,14,38,.88)";

        // Inicia figura
        ctx.beginPath();

        // Dibuja panel grande
        ctx.roundRect(65, 60, 1350, 900, 50);

        // Rellena panel
        ctx.fill();

        // Gradiente del encabezado
        const top = ctx.createLinearGradient(80, 70, 1300, 170);

        // Colores del encabezado
        top.addColorStop(0,"#ff9ecf");
        top.addColorStop(.5,"#c77dff");
        top.addColorStop(1,"#ff8fd8");

        // Aplica gradiente
        ctx.fillStyle = top;

        // Inicia figura
        ctx.beginPath();

        // Dibuja barra superior
        ctx.roundRect(90, 70, 1270, 120, 36);

        // Rellena barra
        ctx.fill();

                // Centra todo el texto
        ctx.textAlign = "center";

        // Color de sombra del título
        ctx.fillStyle = "rgba(0,0,0,.18)";

        // Fuente del título
        ctx.font = "bold 42px 'Baloo 2'";

        // Dibuja sombra del título
        ctx.fillText("MEMORAMA SNOOPY", 728, 136);

        // Color principal del título
        ctx.fillStyle = "white";

        // Dibuja título principal
        ctx.fillText("MEMORAMA SNOOPY", 723, 130);

        // Fuente del subtítulo
        ctx.font = "18px 'Baloo 2'";

        // Color del subtítulo
        ctx.fillStyle = "rgba(255,255,255,.85)";

        // Texto de instrucciones
        ctx.fillText("Encuentra todas las parejas ✨", 725, 165);

        // Color de cajas de información
        ctx.fillStyle = "rgba(255,255,255,.08)";

        // Caja de intentos
        ctx.beginPath();

        ctx.roundRect(150, 220, 280, 65, 22);

        ctx.fill();

        // Caja de pares encontrados
        ctx.beginPath();

        ctx.roundRect(1020, 220, 280, 65, 22);

        ctx.fill();

        // Color del texto
        ctx.fillStyle = "white";

        // Fuente de estadísticas
        ctx.font = "bold 22px 'Baloo 2'";

        // Texto de intentos
        ctx.fillText("🎯 Intentos: " + intentos, 290, 262);

        // Cuenta pares encontrados
        const pares = cartas.filter(c=>c.encontrada).length / 2;

        // Texto de pares encontrados
        ctx.fillText("⭐ Pares: " + pares + "/10", 1160, 262);

        // ======================================
        // DIBUJAR CARTAS
        // ======================================

        // Recorre todas las cartas
        cartas.forEach((carta,i)=>{

            // Calcula posición horizontal
            const x = (i % 5) * espacioX + inicioX;

            // Calcula posición vertical
            const y = Math.floor(i / 5) * espacioY + inicioY;

            // Si la carta está abierta o encontrada
            if(carta.abierta || carta.encontrada){

                // Color de sombra
                ctx.fillStyle = "rgba(0,0,0,.22)";

                // Inicia forma
                ctx.beginPath();

                // Dibuja sombra
                ctx.roundRect(x+6, y+8, anchoCarta, altoCarta, 30);

                // Rellena sombra
                ctx.fill();

                // Gradiente de carta abierta
                const abierta = ctx.createLinearGradient(x, y, x, y+altoCarta);

                abierta.addColorStop(0,"#ffffff");
                abierta.addColorStop(.5,"#f6ecff");
                abierta.addColorStop(1,"#eadcff");

                // Aplica gradiente
                ctx.fillStyle = abierta;

                // Inicia forma principal
                ctx.beginPath();

                // Dibuja carta abierta
                ctx.roundRect(x, y, anchoCarta, altoCarta, 30);

                // Rellena carta
                ctx.fill();

                // Color del borde
                ctx.strokeStyle = "rgba(255,255,255,.85)";

                // Grosor del borde
                ctx.lineWidth = 3;

                // Dibuja borde
                ctx.stroke();

                // Guarda estado actual del canvas
                ctx.save();

                // Inicia área de recorte
                ctx.beginPath();

                // Área donde se mostrará la imagen
                ctx.roundRect(x+8, y+8, anchoCarta-16, altoCarta-16, 24);

                // Activa recorte
                ctx.clip();

                // Dibuja imagen de la carta
                drawCoverImage(

                    carta.img,
                    x+8,
                    y+8,
                    anchoCarta-16,
                    altoCarta-16
                );

                // Restaura estado anterior
                ctx.restore();

            }else{

                // Si la carta está cerrada la dibuja tapada
                cartaTapada(x,y);
            }
        });

        // ======================================
        // VICTORIA
        // ======================================

        // Si ya encontró todos los pares y aún no sonó la victoria
        if(pares === 10 && !sonidoVictoria){

            // Reinicia sonido
            sonidoWin.currentTime = 0;

            // Reproduce sonido de victoria
            sonidoWin.play();

            // Evita repetir sonido
            sonidoVictoria = true;
        }

        // Si el jugador ganó
        if(pares === 10){

            // Fondo oscuro transparente
            ctx.fillStyle = "rgba(0,0,0,.82)";

            // Cubre toda la pantalla
            ctx.fillRect(0,0,BASE_W,BASE_H);

            // Color del texto
            ctx.fillStyle = "white";

            // Color del brillo
            ctx.shadowColor = "#b88cff";

            // Intensidad del brillo
            ctx.shadowBlur = 40;

            // Fuente del mensaje principal
            ctx.font = "bold 82px 'Baloo 2'";

            // Mensaje de victoria
            ctx.fillText("¡LO LOGRASTE!", 725, 430);
            
            // Quita brillo
            ctx.shadowBlur = 0;

            // Fuente de intentos
            ctx.font = "bold 36px 'Baloo 2'";

            // Muestra intentos realizados
            ctx.fillText("Intentos: " + intentos, 725, 500);

            // Fuente del mensaje inferior
            ctx.font = "bold 24px 'Baloo 2'";
            
            // Mensaje para reiniciar
            ctx.fillText("Toca la pantalla para jugar otra vez", 725, 555);
        }

        // Repite el loop infinitamente
        requestAnimationFrame(loop);
    }

    // Inicia el loop del juego
    loop();
}