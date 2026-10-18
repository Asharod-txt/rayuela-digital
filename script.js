const movimientosNivel1 = [
  { id: 1, nombre: "1. Agacharse", desc: "Flexiona rodillas manteniendo la espalda recta y regresa a posición erguida.", img: "assets/oso 1.png" },
  { id: 2, nombre: "2. Salto Pie Izquierdo", desc: "Levanta el pie derecho y realiza 3 saltos consecutivos en el izquierdo.", img: "assets/oso 2.png" },
  { id: 3, nombre: "3. Salto Pie Derecho", desc: "Levanta el pie izquierdo y realiza 3 saltos consecutivos en el derecho.", img: "assets/oso 3.png" },
  { id: 4, nombre: "4. Levantar Ambas Manos", desc: "Eleva los dos brazos extendidos por encima de la cabeza.", img: "assets/oso 4.png" },
  { id: 5, nombre: "5. Mano Derecha Arriba", desc: "Eleva únicamente el brazo derecho hacia el techo.", img: "assets/oso 5.png" },
  { id: 6, nombre: "6. Mano Izquierda Arriba", desc: "Eleva únicamente el brazo izquierdo hacia el techo.", img: "assets/oso 6.png" },
  { id: 7, nombre: "7. Medio Giro a Derecha", desc: "Gira el cuerpo mirando hacia atrás por el lado derecho.", img: "assets/oso 7.png" },
  { id: 8, nombre: "8. Medio Giro a Izquierda", desc: "Gira el cuerpo mirando hacia atrás por el lado izquierdo.", img: "assets/oso 8.png" },
  { id: 9, nombre: "9. Giro 360° Completo", desc: "Da una vuelta completa sobre tu propio eje hasta quedar de frente.", img: "assets/oso 9.png" },
  { id: 10, nombre: "10. De Puntas de Pies", desc: "Eleva los talones y mantén el equilibrio sobre las puntas de los pies.", img: "assets/oso 10.png" }
];

const movimientosNivel2 = [
  { id: 1, nombre: "1. Postura de la Montaña (Tadasana)", desc: "Pies al ancho de caderas, brazos a los lados, columna alineada.", img: "assets/jaguar 1.png" },
  { id: 2, nombre: "2. Sentadilla Lateral Derecha", desc: "Paso a la derecha, flexiona rodilla a 90° y estira pierna izquierda.", img: "assets/jaguar 2.png" },
  { id: 3, nombre: "3. Postura del Funambulista (Tándem)", desc: "Coloca un pie exactamente frente al otro tocando talón con punta.", img: "assets/jaguar 3.png" },
  { id: 4, nombre: "4. Marcha Estática con Pausa", desc: "Eleva una rodilla a la altura de la cadera y mantén 3 segundos.", img: "assets/jaguar 4.png" },
  { id: 5, nombre: "5. Postura del Árbol (Vrikshasana)", desc: "Planta del pie en el muslo/pantorrilla contraria, palmas al pecho.", img: "assets/jaguar 5.png" },
  { id: 6, nombre: "6. El Avión (Guerrero III)", desc: "Inclina el torso y extiende una pierna atrás paralela al suelo.", img: "assets/jaguar 6.png" },
  { id: 7, nombre: "7. Desplante/Zancada Derecha", desc: "Paso largo al frente, flexiona ambas rodillas a 90°.", img: "assets/jaguar 7.png" },
  { id: 8, nombre: "8. Sentadilla Lateral Izquierda", desc: "Paso a la izquierda, flexiona rodilla a 90° y estira derecha.", img: "assets/jaguar 8.png" },
  { id: 9, nombre: "9. Desplante/Zancada Izquierda", desc: "Paso largo con pie izquierdo al frente, flexiona rodillas a 90°.", img: "assets/jaguar 9.png" },
  { id: 10, nombre: "10. Zancada Baja con Apertura", desc: "Apoya rodilla trasera en suelo, eleva torso y brazos al techo.", img: "assets/jaguar 10.png" }
];

let nivelActual = 1;
let casillaActual = 1;
let movimientosAsignados = [];
let temporizadorGeneral = null;
let temporizadorMovimiento = null;
let segundosTotales = 0;
let segundosMovimiento = 15;
let juegoEnPausa = true;

window.onload = () => {
  cambiarNivel();
};

function cambiarNivel() {
  nivelActual = parseInt(document.getElementById("select-level").value);
  casillaActual = 1;
  segundosTotales = 0;
  segundosMovimiento = 15;
  pausarJuego();
  
  document.getElementById("timer-display").innerText = "00:00";
  document.getElementById("move-timer").innerText = segundosMovimiento;
  document.getElementById("btn-toggle-play").innerText = "▶️ Iniciar";

  const animalImg = document.getElementById("animal-emblem");

  if (nivelActual === 1) {
    movimientosAsignados = [...movimientosNivel1];
    animalImg.src = "assets/oso perezoso.png";
  } else {
    movimientosAsignados = [...movimientosNivel2].sort(() => Math.random() - 0.5);
    animalImg.src = "assets/jaguar.png";
  }

  actualizarPistaVisual();
  cargarInstruccionCasilla(casillaActual);
}

function actualizarPistaVisual() {
  for (let i = 1; i <= 10; i++) {
    const tile = document.getElementById(`tile-${i}`);
    tile.className = "tile";
    if (i < casillaActual) {
      tile.classList.add("completed");
    } else if (i === casillaActual) {
      tile.classList.add("active");
    } else {
      tile.classList.add("disabled");
    }
  }
}

function cargarInstruccionCasilla(numCasilla) {
  const mov = movimientosAsignados[numCasilla - 1];
  document.getElementById("move-title").innerText = mov.nombre;
  document.getElementById("move-desc").innerText = mov.desc;
  document.getElementById("move-image").src = mov.img;
  segundosMovimiento = 15;
  document.getElementById("move-timer").innerText = segundosMovimiento;
}

function togglePlayPause() {
  if (juegoEnPausa) {
    iniciarMovimientoConConteo();
  } else {
    pausarJuego();
    document.getElementById("btn-toggle-play").innerText = "▶️ Reanudar";
  }
}

function pausarJuego() {
  juegoEnPausa = true;
  clearInterval(temporizadorGeneral);
  clearInterval(temporizadorMovimiento);
}

function iniciarMovimientoConConteo() {
  const overlay = document.getElementById("countdown-overlay");
  const numDisplay = document.getElementById("countdown-number");
  overlay.classList.remove("hidden");

  let conteo = 3;
  numDisplay.innerText = conteo;

  const intervaloConteo = setInterval(() => {
    conteo--;
    if (conteo > 0) {
      numDisplay.innerText = conteo;
    } else if (conteo === 0) {
      numDisplay.innerText = "¡GO!";
    } else {
      clearInterval(intervaloConteo);
      overlay.classList.add("hidden");
      
      juegoEnPausa = false;
      document.getElementById("btn-toggle-play").innerText = "⏸️ Pausa";
      iniciarCronometros();
    }
  }, 900);
}

function iniciarCronometros() {
  clearInterval(temporizadorGeneral);
  clearInterval(temporizadorMovimiento);

  temporizadorGeneral = setInterval(() => {
    segundosTotales++;
    let min = Math.floor(segundosTotales / 60).toString().padStart(2, '0');
    let sec = (segundosTotales % 60).toString().padStart(2, '0');
    document.getElementById("timer-display").innerText = `${min}:${sec}`;
  }, 1000);

  temporizadorMovimiento = setInterval(() => {
    if (segundosMovimiento > 0) {
      segundosMovimiento--;
      document.getElementById("move-timer").innerText = segundosMovimiento;
    } else {
      completarCasillaActual();
    }
  }, 1000);
}

function completarCasillaActual() {
  if (casillaActual < 10) {
    casillaActual++;
    actualizarPistaVisual();
    cargarInstruccionCasilla(casillaActual);
  } else {
    pausarJuego();
    lanzarConfetiVictoria();
  }
}

function lanzarConfetiVictoria() {
  document.getElementById("victory-overlay").classList.remove("hidden");
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function reiniciarJuego() {
  document.getElementById("victory-overlay").classList.add("hidden");
  cambiarNivel();
}