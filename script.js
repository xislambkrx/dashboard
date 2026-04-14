const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuToggle");
const overlay = document.getElementById("overlay");
const icon = menuBtn.querySelector("i");

/* =========================
   SIDEBAR TOGGLE
========================= */
function toggleSidebar() {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");

  if (sidebar.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
}

menuBtn.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

/* =========================
   DATA
========================= */
let products = JSON.parse(localStorage.getItem("products")) || [];

const tbody = document.querySelector("tbody");

/* =========================
   SAVE
========================= */
function save() {
  localStorage.setItem("products", JSON.stringify(products));
}

/* =========================
   RENDER TABLE
========================= */
function render() {
  tbody.innerHTML = "";

  let totalConsumed = 0;
  let totalRemaining = 0;

  products.forEach((p, i) => {
    const remaining = p.available - p.consumed;

    totalConsumed += p.consumed;
    totalRemaining += remaining;

    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.type}</td>
        <td>${p.available}</td>
        <td>${p.consumed}</td>
        <td>${remaining}</td>
        <td>
          <button onclick="openEdit(${i})">✏️</button>
          <button onclick="deleteProduct(${i})">❌</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalConsumed").textContent = totalConsumed;
  document.getElementById("totalRemaining").textContent = totalRemaining;
}

/* =========================
   DELETE PRODUCT
========================= */
function deleteProduct(i) {
  products.splice(i, 1);
  save();
  render();
}

/* =========================
   ADD PRODUCT MODAL
========================= */
const addModal = document.getElementById("modal");

document.getElementById("addProductBtn").onclick = () => {
  addModal.style.display = "flex";
};

document.getElementById("closeModal").onclick = () => {
  addModal.style.display = "none";
};

document.getElementById("saveProduct").onclick = () => {
  const type = document.getElementById("newType").value;
  const available = +document.getElementById("newAvailable").value;

  if (!type || available < 0) return;

  products.push({
    type,
    available,
    consumed: 0
  });

  save();
  render();
  addModal.style.display = "none";
};

/* =========================
   EDIT PRODUCT MODAL
========================= */
const editModal = document.getElementById("editModal");

let editIndex = null;

function openEdit(i) {
  editIndex = i;

  const p = products[i];

  document.getElementById("editType").value = p.type;
  document.getElementById("editAvailable").value = p.available;
  document.getElementById("editConsumed").value = p.consumed;

  editModal.style.display = "flex";
}

document.getElementById("closeEdit").onclick = () => {
  editModal.style.display = "none";
};

document.getElementById("updateProduct").onclick = () => {
  const type = document.getElementById("editType").value;
  const available = +document.getElementById("editAvailable").value;
  const consumed = +document.getElementById("editConsumed").value;

  if (editIndex === null) return;

  products[editIndex] = {
    type,
    available,
    consumed
  };

  save();
  render();

  editModal.style.display = "none";
};

/* =========================
   CLOSE MODAL ON OUTSIDE CLICK
========================= */
window.onclick = (e) => {
  if (e.target === addModal) addModal.style.display = "none";
  if (e.target === editModal) editModal.style.display = "none";
};

/* =========================
   INIT
========================= */
render();


}


let deferredPrompt;
const installBtn = document.getElementById('installBtn');
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('App installed');
    }
    deferredPrompt = null;
  });
});
