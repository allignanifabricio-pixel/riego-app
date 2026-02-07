document.addEventListener("DOMContentLoaded", () => {
  mostrarRiegos();

  // modo oscuro
  const btnModo = document.getElementById("modoOscuro");
  btnModo.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");
  });
});

const form = document.getElementById("formRiego");

form.addEventListener("submit", e => {
  e.preventDefault();

  const fecha = document.getElementById("fecha").value;
  const nota = document.getElementById("nota").value;

  let riegos = JSON.parse(localStorage.getItem("riegos")) || [];
  const indexEditando = form.dataset.editando;

  if (indexEditando !== undefined) {
    riegos[indexEditando] = { fecha, nota };
    delete form.dataset.editando;
  } else {
    riegos.push({ fecha, nota });
  }

  localStorage.setItem("riegos", JSON.stringify(riegos));
  form.reset();
  mostrarRiegos();
});

function mostrarRiegos() {
  const lista = document.getElementById("listaRiegos");
  lista.innerHTML = "";

  const riegos = JSON.parse(localStorage.getItem("riegos")) || [];

  riegos.forEach((riego, index) => {
    const li = document.createElement("li");
    li.className = "riego-item";

    li.innerHTML = `
      <span>📅 ${riego.fecha} ${riego.nota ? "– " + riego.nota : ""}</span>
      <div class="acciones">
        <button onclick="editarRiego(${index})">✏️</button>
        <button onclick="borrarRiego(${index})">🗑️</button>
      </div>
    `;

    lista.appendChild(li);
  });
}

function borrarRiego(index) {
  let riegos = JSON.parse(localStorage.getItem("riegos")) || [];

  if (!confirm("¿Seguro que querés borrar este riego?")) return;

  riegos.splice(index, 1);
  localStorage.setItem("riegos", JSON.stringify(riegos));
  mostrarRiegos();
}

function editarRiego(index) {
  const riegos = JSON.parse(localStorage.getItem("riegos")) || [];
  const riego = riegos[index];

  document.getElementById("fecha").value = riego.fecha;
  document.getElementById("nota").value = riego.nota || "";

  form.dataset.editando = index;
}
