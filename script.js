/* =========================================================
   DE SOL A SOL - MINIMARKET 24H
   ⚙️ EDITA AQUÍ los datos de tu negocio
   ========================================================= */
const CONFIG = {
  whatsapp: "56900000000",            // Número con código de país, sin + ni espacios
  phoneLabel: "+56 9 0000 0000",      // Cómo se muestra el número
  address: "Av. Principal 123, Tu Ciudad",
  mapQuery: "Av. Principal 123, Tu Ciudad", // Texto o "lat,lng" para el mapa
  instagram: "https://instagram.com/desolasol",
  facebook: "https://facebook.com/desolasol",
  currency: "$",
  open24h: true,                      // true = siempre abierto
};

/* Catálogo de ejemplo — reemplaza nombres y precios por los tuyos */
const PRODUCTS = [
  { id: 1,  name: "Bebida 1.5L",            cat: "bebidas",   emoji: "🥤", price: 1990 },
  { id: 2,  name: "Agua mineral 1.6L",      cat: "bebidas",   emoji: "💧", price: 990  },
  { id: 3,  name: "Bolsa de hielo 2kg",     cat: "bebidas",   emoji: "🧊", price: 1500 },
  { id: 4,  name: "Energética 473ml",       cat: "bebidas",   emoji: "⚡", price: 1690 },
  { id: 5,  name: "Papas fritas 230g",      cat: "snacks",    emoji: "🍟", price: 2290 },
  { id: 6,  name: "Chocolate barra",        cat: "snacks",    emoji: "🍫", price: 1190 },
  { id: 7,  name: "Galletas surtidas",      cat: "snacks",    emoji: "🍪", price: 990  },
  { id: 8,  name: "Helado 1L",              cat: "snacks",    emoji: "🍦", price: 3490 },
  { id: 9,  name: "Pan (1 kg)",             cat: "abarrotes", emoji: "🍞", price: 2200 },
  { id: 10, name: "Leche entera 1L",        cat: "abarrotes", emoji: "🥛", price: 1150 },
  { id: 11, name: "Huevos (12 un.)",        cat: "abarrotes", emoji: "🥚", price: 3290 },
  { id: 12, name: "Arroz 1kg",              cat: "abarrotes", emoji: "🍚", price: 1490 },
  { id: 13, name: "Papel higiénico x4",     cat: "cuidado",   emoji: "🧻", price: 2490 },
  { id: 14, name: "Pasta dental",           cat: "cuidado",   emoji: "🪥", price: 1790 },
  { id: 15, name: "Shampoo 400ml",          cat: "cuidado",   emoji: "🧴", price: 2990 },
  { id: 16, name: "Pañales (paquete)",      cat: "cuidado",   emoji: "👶", price: 8990 },
];

const CAT_LABEL = {
  bebidas: "Bebidas & Hielo",
  snacks: "Snacks & Golosinas",
  abarrotes: "Abarrotes & Lácteos",
  cuidado: "Cuidado Personal",
};

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => CONFIG.currency + n.toLocaleString("es-CL");
const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Datos del negocio ---------- */
function applyConfig() {
  $("#addressText").textContent = CONFIG.address;
  $("#phoneText").textContent = CONFIG.phoneLabel;
  $("#igLink").href = CONFIG.instagram;
  $("#fbLink").href = CONFIG.facebook;
  $("#year").textContent = new Date().getFullYear();
  const q = encodeURIComponent(CONFIG.mapQuery);
  $("#mapFrame").src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  $("#directionsBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  $$(".js-whatsapp").forEach((a) => {
    a.href = waLink(a.dataset.msg || "¡Hola De Sol a Sol! 👋");
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- Reloj + estado en vivo ---------- */
function updateClock() {
  const now = new Date();
  const h = now.getHours();
  $("#clock").textContent = now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });

  let greet = "🌙 ¡Buenas noches!";
  if (h >= 6 && h < 12) greet = "☀️ ¡Buenos días!";
  else if (h >= 12 && h < 20) greet = "🌤️ ¡Buenas tardes!";
  $("#greeting").textContent = greet;

  if (CONFIG.open24h) {
    $("#heroStatus").textContent = "¡Abiertos ahora!";
    $("#statusText").textContent = "🟢 ¡Estamos abiertos ahora!";
    $("#statusSub").textContent =
      h >= 6 && h < 20
        ? "De sol a sol… y también de noche. Atendemos 24/7."
        : "¿Antojo nocturno? Seguimos atendiendo. 24/7.";
  }
}

/* ---------- Estrellas del hero ---------- */
function makeStars() {
  const box = $(".stars");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    const size = Math.random() * 2 + 1;
    s.style.width = s.style.height = size + "px";
    box.appendChild(s);
  }
}

/* ---------- Productos ---------- */
function renderProducts(filter = "todos") {
  const list = filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
  $("#products").innerHTML = list
    .map(
      (p, i) => `
      <article class="product" style="animation-delay:${i * 40}ms">
        <div class="product-emoji">${p.emoji}</div>
        <span class="tag">${CAT_LABEL[p.cat]}</span>
        <h4>${p.name}</h4>
        <div class="product-foot">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="Agregar ${p.name}">+</button>
        </div>
      </article>`
    )
    .join("");
}

function setFilter(filter) {
  $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === filter));
  renderProducts(filter);
}

/* ---------- Carrito / Pedido ---------- */
let cart = JSON.parse(localStorage.getItem("dsas_cart") || "{}");

function saveCart() {
  localStorage.setItem("dsas_cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  const p = PRODUCTS.find((x) => x.id === id);
  toast(`✅ ${p.name} agregado`);
  const c = $("#cartCount");
  c.classList.remove("bump");
  void c.offsetWidth;
  c.classList.add("bump");
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
}

function cartEntries() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === +id), qty }))
    .filter((p) => p.name);
}

function renderCart() {
  const items = cartEntries();
  const count = items.reduce((a, p) => a + p.qty, 0);
  const total = items.reduce((a, p) => a + p.qty * p.price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#cartItems").innerHTML = items.length
    ? items
        .map(
          (p) => `
        <li class="cart-item">
          <span class="ci-emoji">${p.emoji}</span>
          <div class="ci-info">${p.name}<small>${money(p.price * p.qty)}</small></div>
          <div class="qty">
            <button data-qty="-1" data-id="${p.id}" aria-label="Quitar uno">−</button>
            <span>${p.qty}</span>
            <button data-qty="1" data-id="${p.id}" aria-label="Agregar uno">+</button>
          </div>
        </li>`
        )
        .join("")
    : `<li class="empty">Tu pedido está vacío 🛒<br/>Agrega productos para comenzar.</li>`;
}

function sendOrder() {
  const items = cartEntries();
  if (!items.length) return toast("Agrega productos primero 🙂");
  const lines = items.map((p) => `• ${p.qty} x ${p.name} — ${money(p.qty * p.price)}`);
  const total = items.reduce((a, p) => a + p.qty * p.price, 0);
  const msg =
    `¡Hola De Sol a Sol! ☀️ Quiero hacer este pedido:\n\n${lines.join("\n")}\n\n` +
    `*Total aprox: ${money(total)}*\n\n📍 Mi dirección: `;
  window.open(waLink(msg), "_blank", "noopener");
}

function openCart(open) {
  $("#cartPanel").classList.toggle("open", open);
  $("#cartPanel").setAttribute("aria-hidden", !open);
  $("#overlay").classList.toggle("show", open);
}

/* ---------- Eventos ---------- */
function bindEvents() {
  // Menú móvil
  $("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

  // Sombra en nav al hacer scroll
  window.addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", window.scrollY > 10));

  // Filtros
  $("#filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) setFilter(chip.dataset.filter);
  });

  // Tarjetas de categoría -> filtran productos
  $$(".cat-card").forEach((card) =>
    card.addEventListener("click", () => {
      setFilter(card.dataset.cat);
      $("#productos").scrollIntoView({ behavior: "smooth" });
    })
  );

  // Agregar al carrito
  $("#products").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (btn) addToCart(+btn.dataset.id);
  });

  // Cantidades en el carrito
  $("#cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qty]");
    if (btn) changeQty(+btn.dataset.id, +btn.dataset.qty);
  });

  $("#cartBtn").addEventListener("click", () => openCart(true));
  $("#closeCart").addEventListener("click", () => openCart(false));
  $("#overlay").addEventListener("click", () => openCart(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && openCart(false));
  $("#sendOrder").addEventListener("click", sendOrder);
  $("#clearCart").addEventListener("click", () => { cart = {}; saveCart(); });
}

/* ---------- Animación al hacer scroll ---------- */
function revealOnScroll() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  makeStars();
  updateClock();
  setInterval(updateClock, 30000);
  renderProducts();
  renderCart();
  bindEvents();
  revealOnScroll();
});
