function juegoGato(container){

    let tablero = ["", "", "", "", "", "", "", "", ""];
    let turno = "X";
    let juegoActivo = true;

    container.innerHTML = `
        <div class="gato-container">

            <center>
                <h2 class="gato-titulo">🐱 Gato 💗</h2>

                <p id="turnoTxt" class="turno-texto">
                    Turno: ${turno}
                </p>

            </center>

            <div class="grid"></div>

            <center>
            <p id="resultado" class="resultado"></p>

            <button id="reiniciar" class="btn-reiniciar">
                Reiniciar
            </button>
            </center>

        </div>
    `;

    const grid = container.querySelector(".grid");
    const turnoTxt = container.querySelector("#turnoTxt");
    const resultado = container.querySelector("#resultado");
    const btn = container.querySelector("#reiniciar");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 110px)";
    grid.style.gap = "12px";
    grid.style.justifyContent = "center";
    grid.style.marginTop = "20px";

    const combinaciones = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function verificarGanador(){
        for(let combo of combinaciones){
            let [a,b,c] = combo;
            if(tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]){
                return combo;
            }
        }
        return null;
    }

    function crearCelda(i){

        const cell = document.createElement("div");
        cell.classList.add("celda");

        cell.addEventListener("click", () => {

            if(tablero[i] !== "" || !juegoActivo) return;

            tablero[i] = turno;

            if(turno === "X"){
                cell.textContent = "✖";
                cell.style.color = "#ff4d88";
            } else {
                cell.textContent = "◯";
                cell.style.color = "#a64dff";
            }

            let ganador = verificarGanador();

            if(ganador){
                juegoActivo = false;

                resultado.textContent = `🏆 Gana ${turno}`;
                resultado.style.color = "#ff4d88";

                ganador.forEach(index => {
                    grid.children[index].style.background = "#ffb6c1";
                });
                return;
            }

            if(!tablero.includes("")){
                juegoActivo = false;
                resultado.textContent = "🤝 Empate";
                return;
            }

            turno = turno === "X" ? "O" : "X";
            turnoTxt.textContent = "Turno: " + turno;

        });
        return cell;
    }

    // crear tablero
    tablero.forEach((_, i)=>{
        grid.appendChild(crearCelda(i));
    });

    // reiniciar
    btn.addEventListener("click", ()=>{
        juegoGato(container);
    });
}