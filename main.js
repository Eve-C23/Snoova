// música del menú
const musica = document.getElementById("musica");
const clickSound = document.getElementById("clickSound");

//VOLUMEN AUDIO
musica.volume = 0.3;
clickSound.volume = 0.5;

/* reproducir automáticamente */
if(localStorage.getItem("musicaPermitida") === "true"){

    musica.play();

}
//ABRIR JUEGO
function abrirJuego(nombre){

    const game = document.getElementById("game");
    const menu = document.getElementById("menu");
    const transition = document.getElementById("transition");

    // sonido click
    clickSound.currentTime = 0;
    clickSound.play();

    // mostrar fade
    transition.style.opacity = "1";

    setTimeout(() => {

        // detener música
        musica.pause();

        // ocultar menú
        menu.style.display = "none";

        // ocultar logo
        document.getElementById("logo").style.display = "none";

        // limpiar
        game.innerHTML = "";

        // abrir juego
        if(nombre === "gato"){
            juegoGato(game);
        }

        else if(nombre === "frutas"){
            juegoFrutas(game);
        }

        else if(nombre === "carrera"){
            juegoCarrera(game);
        }

        else if(nombre === "dino"){
            juegoDino(game);
        }

        else if(nombre === "memorama"){
            juegoMemorama(game);

            
        }

        else if(nombre === "nubes"){
            juegoNubes(game);
        }

         // ESPERAR poquito antes de quitar fade
        setTimeout(() => {

            transition.style.opacity = "0";

            // mostrar botón al final
            document.getElementById("volver").style.display = "block";

        }, 200);
        
    }, 500);
}

//BOTON VOLVER MENU
function volverMenu(){

    // sonido click
    clickSound.currentTime = 0;
    clickSound.play();

    const menu = document.getElementById("menu");
    const game = document.getElementById("game");
    const volver = document.getElementById("volver");
    const transition = document.getElementById("transition");

    // ocultar botón inmediatamente
    volver.style.display = "none";

    // fade
    transition.style.opacity = "1";

    setTimeout(() => {

        // limpiar juego
        game.innerHTML = "";

        // mostrar menú
        menu.style.display = "grid";

        // mostrar logo
        document.getElementById("logo").style.display = "block";

        // volver música
        musica.currentTime = 0;
        musica.play();

        // quitar fade
        setTimeout(() => {

            transition.style.opacity = "0";

        }, 200);

    }, 500);
}