// =====================
//  CLASE PRODUCTO
// =====================

class Producto {
  constructor(nombre, precio) {
    this.name = nombre;
    this.price = precio;
  }
}

// =====================
//  VARIABLES GLOBALES
// =====================

let cart = loadCart();

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");

// =====================
//  AUXILIARES
// =====================

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

const formatCurrency = n => Number(n).toLocaleString("es-AR");

// =====================
//  CALCULAR TOTALES
// =====================

function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const descuento = subtotal * 0.1; // 10% fijo
  const total = subtotal - descuento;
  return { subtotal, descuento, total };
}

// =====================
//  RENDER DEL CARRITO
// =====================

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p class='text-muted'> ¡Tu carrito está vacío! </p>";
    cartTotalElement.textContent = "0";
    cartBadge.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");

    div.innerHTML = `
      <span>${item.name} - $${formatCurrency(item.price)}</span>
      <button type="button" class="btn-close" aria-label="Close" data-remove-index="${index}"></button>
    `;
    cartItemsContainer.appendChild(div);
  });

  const { subtotal, descuento, total } = calculateTotal();

  // BOTÓN DE CERRAR EN EL MODAL
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.matches("[data-remove-index]")) {
      const index = parseInt(e.target.dataset.removeIndex, 10);
      removeFromCart(index);
    }
  });

  cartItemsContainer.innerHTML += `
    <hr>
    <p>Subtotal: $${formatCurrency(subtotal)}</p>
    <p>Descuento (10%): -$${formatCurrency(descuento)}</p>
    <h5>Total: $${formatCurrency(total)}</h5>
  `;

  cartTotalElement.textContent = formatCurrency(total);
  cartBadge.textContent = cart.length;

  saveCart();
}

// =====================
//  CRUD DEL CARRITO
// =====================

function addToCart(name, price) {
  const producto = new Producto(name, price);
  cart.push(producto);
  renderCart();
  showFeedback(`${name} agregado al carrito 🛒`, 2400);
}

function removeFromCart(index) {
  const removed = cart[index]?.name || "Producto";
  cart = cart.filter((_, i) => i !== index);
  renderCart();
  showFeedback(`${removed} eliminado ❌`, 2400);
}

function clearCart() {
  cart = [];
  renderCart();
  saveCart();
  showFeedback("¡Carrito vacío!", 2400);
}

function checkout() {
  if (cart.length === 0) {
    showFeedback("¡El carrito está vacío!", 2400);
    return;
  }

  // Fecha y hora en formato 24hs
  const fecha = new Date().toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  // Guardar en localStorage
  localStorage.setItem("ultimaCompra", fecha);

  // Feedback de compra
  showFeedback(`¡Compra realizada con éxito! ✅ (${fecha})`, 4000);

  // Limpiar carrito
  cart = [];
  renderCart();
  saveCart();
}

// =====================
//  FEEDBACK AL USUARIO
// =====================

function showFeedback(msg, duration = 3000) {
  const div = document.createElement("div");
  div.className = "alert alert-success position-fixed bottom-0 end-0 m-3 shadow";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), duration);
}

// =====================
//  EVENTOS
// =====================

document.querySelectorAll(".card").forEach(card => {
  const button = card.querySelector("button");
  const name = card.querySelector(".card-title").textContent;
  const priceText = card.querySelector("strong").textContent.replace("$", "").trim();
  const price = parseInt(priceText);

  button.addEventListener("click", () => addToCart(name, price));
});

// =====================
//  INIT
// =====================

renderCart();

