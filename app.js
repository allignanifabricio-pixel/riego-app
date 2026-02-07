const calendario = document.getElementById("calendario");
const tituloSemana = document.getElementById("tituloSemana");
const form = document.getElementById("formRiego");
const formContainer = document.getElementById("formContainer");
const zonaSwipe = document.getElementById("zonaSwipe");

let semanaOffset = 0;
let editandoId = null;

/* 🌙 modo oscuro */
if (localStorage.getItem("oscuro") === "true") {
  document.body.classList.add("oscuro");
}

document.getElementById("modoOscuro").onclick = () => {
  document.body.classList.toggle("oscuro");
  localStorage.setItem(
    "oscuro",
    document.body.classList.contains("oscuro")
  );
};

/* ➕ formulario */
document.getElementById("btnAgregar").onclick = () => {
  formContainer.classList.toggle("oculto");
  editandoId = null;
  form.reset();
};

/* 👉 swipe semanas */
let startX = 0;

zonaSwipe.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

zonaSwipe.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) semanaOffset--;
  if (diff < -50) semanaOffset++;
  renderSemana();
});

document.addEventListener("DOMContentLoaded", renderSemana);

/* 💾 guardar / editar */
form.addEventListener("submit", e => {
  e.preventDefault();

  let riegos = JSON.parse(localStorage.getItem("riegos")) || [];

  const data = {
    id: editandoId ?? Date.now(),
    inicio: fechaInicio.value,
    arbol: arbol.value,
    frecuencia: parseInt(frecuencia.value)
  };

  if (editandoId) {
    riegos = riegos.map(r => (r.id === editandoId ? data : r));
  } else {
    riegos.push(data);
  }

  localStorage.setItem("riegos", JSON.stringify(riegos));
  form.reset();
  formContainer.classList.add("oculto");
  editandoId = null;
  renderSemana();
});

/* 📆 render semana */
function renderSemana() {
  calendario.innerHTML = "";

  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(
    hoy.getDate() - ((hoy.getDay() || 7) - 1) + semanaOffset * 7
  );

  // 🟢 TÍTULO: NOMBRE DEL MES
  tituloSemana.textContent = lunes.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
  }).toUpperCase();

  const riegos = JSON.parse(localStorage.getItem("riegos")) || [];

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + i);
    const iso = fecha.toISOString().split("T")[0];

    const dia = document.createElement("div");
    dia.className = "dia";
    dia.innerHTML = `
      <h3>
        ${fecha.toLocaleDateString("es-ES", { weekday: "long" })}
        ${fecha.getDate()}
      </h3>
    `;

    riegos.forEach(r => {
      if (tocaRiego(r, iso)) {
        const div = document.createElement("div");
        div.className = "riego";
        div.innerHTML = `
          <div>
            🌳 <b>${r.arbol}</b><br>
            🔁 Cada ${r.frecuencia} días<br>
            ⏭ Próx: ${sumarDias(iso, r.frecuencia)}
          </div>
          <div class="acciones">
            <button onclick="editar(${r.id})">✏️</button>
            <button onclick="borrar(${r.id})">🗑️</button>
          </div>
        `;
        dia.appendChild(div);
      }
    });

    calendario.appendChild(dia);
  }
}

/* 🔁 riego */
function tocaRiego(r, fecha) {
  const d0 = new Date(r.inicio);
  const d = new Date(fecha);
  const diff = Math.floor((d - d0) / 86400000);
  return diff >= 0 && diff % r.frecuencia === 0;
}

/* 🗑️ borrar */
function borrar(id) {
  if (!confirm("¿Eliminar este árbol y todos sus riegos?")) return;

  let riegos = JSON.parse(localStorage.getItem("riegos")) || [];
  riegos = riegos.filter(r => r.id !== id);
  localStorage.setItem("riegos", JSON.stringify(riegos));
  renderSemana();
}

/* ✏️ editar */
function editar(id) {
  const r = (JSON.parse(localStorage.getItem("riegos"))
