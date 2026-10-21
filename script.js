/* =========================================================
   DE SOL A SOL · MINIMARKET — Lógica de la página
   (El contenido se edita en contenido.js, no aquí)
   ========================================================= */

const HORARIO = {
  abre: 9,              // 09:00 todos los días
  cierra: 4,            // Lun–Jue hasta las 04:00 del día siguiente
  diasAMas: [5, 6, 0],  // Vie, Sáb, Dom: "¡a más!" (0 = domingo)
};

const TIPOS = {
  sorteo: "🎁 Sorteos",
  promo: "🔥 Promos",
  combo: "🛍️ Combos",
  evento: "🎉 Eventos",
  local: "🏪 El local",
};

const MARQUEE = [
  "☀️ DE SOL A SOL", "✦", "SORTEOS", "✦", "🔥 PROMOS", "✦", "BEBIDAS HELADAS", "✦",
  "LUN–JUE HASTA LAS 4 AM", "✦", "🎉 VIE–DOM ¡A MÁS!", "✦", "📍 REIMUNDO REGUERA 957", "✦",
];

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, "0");
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waLink = (msg) => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(msg)}`;
const igProfile = `https://instagram.com/${NEGOCIO.instagram}`;

function fmtDuration(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h} h ${m} min`;
  return h ? `${h} h` : `${m} min`;
}

/** Foto + afiche de respaldo (si la foto no existe, queda el afiche). */
function mediaHTML(it, sub) {
  const color = ["rojo", "amarillo", "azul"].includes(it.color) ? it.color : "azul";
  const art = `
    <div class="art art-${color}">
      <span class="art-title">${esc(it.titulo)}</span>
      ${sub ? `<span class="art-text">${esc(sub)}</span>` : ""}
      <svg aria-hidden="true"><use href="#sun" /></svg>
    </div>`;
  const img = it.img
    ? `<img class="media-img" src="${esc(encodeURI(it.img))}" alt="${esc(it.titulo)}" loading="lazy" onerror="this.remove()" />`
    : "";
  return art + img;
}

/* =========================================================
   Horario real → estado en vivo
   ========================================================= */
function getStatus(now = new Date()) {
  const day = now.getDay();
  const prev = (day + 6) % 7;
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = HORARIO.abre * 60;
  const close = HORARIO.cierra * 60;
  const aMas = (d) => HORARIO.diasAMas.includes(d);

  if (mins >= open) {
    if (aMas(day)) return { state: "open", title: "¡Abiertos ahora!", sub: "Hoy atendemos desde las 09:00 ¡a más! 🎉" };
    return { state: "open", title: "¡Abiertos ahora!", sub: `Hoy hasta las 04:00 · cerramos en ${fmtDuration(24 * 60 - mins + close)}` };
  }
  if (mins < close) {
    if (aMas(prev)) return { state: "open", title: "¡Abiertos ahora!", sub: "Noche de finde: seguimos ¡a más! 🎉" };
    return { state: "open", title: "¡Abiertos ahora!", sub: `Cerramos a las 04:00 · quedan ${fmtDuration(close - mins)}` };
  }
  const toOpen = fmtDuration(open - mins);
  if (aMas(prev)) return { state: "maybe", title: "Noche extendida", sub: `Escríbenos para confirmar · si no, abrimos a las 09:00 (en ${toOpen})` };
  return { state: "closed", title: "Cerrado por ahora", sub: `Abrimos hoy a las 09:00 · en ${toOpen}` };
}

function updateStatus() {
  const now = new Date();
  const h = now.getHours();
  const st = getStatus(now);
  const icon = { open: "🟢", maybe: "🟡", closed: "🔴" }[st.state];

  document.body.classList.remove("st-open", "st-maybe", "st-closed");
  document.body.classList.add(`st-${st.state}`);
  $("#tbStatus").textContent = `${st.title} · ${pad(h)}:${pad(now.getMinutes())}`;
  $("#heroStatus").textContent = st.title;
  $("#drawerStatus").textContent = st.title;
  $("#footerStatus").textContent = st.title;
  $("#statusText").textContent = `${icon} ${st.title}`;
  $("#statusSub").textContent = st.sub;

  const isDay = modoForzado ? modoForzado === "dia" : h >= 7 && h < 19;
  setTheme(isDay);

  const leads = [
    [4, 12, "¡Buenos días, vecino! ☀️ Sorteos, promos y novedades del barrio. Pregúntanos por WhatsApp."],
    [12, 19, "¡Buenas tardes! 🌤️ Revisa las promos de hoy y escríbenos lo que necesites."],
    [19, 24, "¡Se viene la noche! 🌙 Bebidas heladas y todo para la previa. Consulta por WhatsApp."],
    [0, 4, "¿Antojo de madrugada? 🌙 Mientras el barrio duerme, nosotros seguimos."],
  ];
  $("#heroLead").textContent = leads.find(([a, b]) => h >= a && h < b)[2];

  const shiftDay = h < HORARIO.cierra ? (now.getDay() + 6) % 7 : now.getDay();
  $$(".hours-row, .dh-row, .fh-row").forEach((row) =>
    row.classList.toggle("today", row.dataset.days.split(",").map(Number).includes(shiftDay))
  );

  // Subtítulo de "Horarios" en el menú
  const hint = $("#drawerHoursHint");
  if (hint) {
    hint.textContent =
      st.state === "closed" ? "Abrimos hoy a las 09:00"
      : st.state === "maybe" ? "Noche extendida · consultá"
      : HORARIO.diasAMas.includes(shiftDay) ? "Hoy abiertos ¡a más! 🎉"
      : "Hoy abiertos hasta las 04:00";
  }
}

/* =========================================================
   Día / Noche del fondo
   - Automático según la hora (07:00–19:00 = día)
   - Forzar para probar: index.html?modo=noche  o  ?modo=dia
   - Botón "Ver de noche / Ver de día" en el encabezado
   ========================================================= */
let modoForzado = (() => {
  const m = new URLSearchParams(location.search).get("modo");
  return m === "noche" || m === "dia" ? m : null;
})();

function setTheme(isDay) {
  document.body.classList.toggle("is-day", isDay);
  document.body.classList.toggle("is-night", !isDay);
  const btn = $("#modeToggle");
  if (btn) btn.textContent = isDay ? "🌙 Ver de noche" : "☀️ Ver de día";
}

function setupBackgrounds() {
  const root = document.documentElement.style;
  const cssUrl = (p) => `url("${encodeURI(p)}")`;
  // Foto de día: usa la WEBP liviana; si no existe, el PNG original
  const RESPALDO = "fotos/Minimarket De Sol a Sol bajo el sol.png";
  const daySrc = NEGOCIO.fondoDia || RESPALDO;
  const day = new Image();
  day.onload = () => root.setProperty("--bg-day", cssUrl(daySrc));
  day.onerror = () => root.setProperty("--bg-day", cssUrl(RESPALDO));
  day.src = encodeURI(daySrc);

  // Si hay foto real de noche y existe, se usa; si no, queda el efecto automático.
  if (NEGOCIO.fondoNoche) {
    const img = new Image();
    img.onload = () => {
      root.setProperty("--bg-night", cssUrl(NEGOCIO.fondoNoche));
      document.body.classList.add("has-night-photo");
    };
    img.src = encodeURI(NEGOCIO.fondoNoche);
  }
}

/* =========================================================
   Decoración
   ========================================================= */
function renderStars() {
  const box = $("#stars");
  const total = window.innerWidth < 600 ? 28 : 60; // menos estrellas en celular = más fluido
  for (let i = 0; i < total; i++) {
    const s = document.createElement("span");
    const size = Math.random() * 2.2 + 1;
    s.className = "star";
    Object.assign(s.style, {
      left: Math.random() * 100 + "%", top: Math.random() * 100 + "%",
      width: size + "px", height: size + "px", animationDelay: Math.random() * 3 + "s",
    });
    box.appendChild(s);
  }
}

function renderMarquee() {
  const html = MARQUEE.map((t) => `<span>${t}</span>`).join("");
  $("#marquee").innerHTML = html + html;
}

/* =========================================================
   HISTORIAS
   ========================================================= */
const seen = new Set(JSON.parse(localStorage.getItem("dsas_seen") || "[]"));
const STORY_MS = 5000;
let sv = { i: 0, j: 0, timer: null, startedAt: 0, remaining: STORY_MS, downAt: 0 };

function renderStories() {
  $("#stories").innerHTML = HISTORIAS.map((h, i) => {
    const first = h.slides[0] || {};
    return `
      <button class="story ${seen.has(h.nombre) ? "seen" : ""}" data-story="${i}" aria-label="Ver historia ${esc(h.nombre)}">
        <span class="story-ring"><span class="story-inner">
          ${esc(h.icono || "☀️")}
          ${first.img ? `<img src="${esc(encodeURI(first.img))}" alt="" loading="lazy" onerror="this.remove()" />` : ""}
        </span></span>
        <span class="story-name">${esc(h.nombre)}</span>
      </button>`;
  }).join("");
}

function openStory(i) {
  sv.i = i; sv.j = 0;
  $("#storyViewer").classList.add("open");
  $("#storyViewer").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  showSlide();
}

function closeStory() {
  clearTimeout(sv.timer);
  $("#storyViewer").classList.remove("open", "paused");
  $("#storyViewer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  renderStories();
}

function showSlide() {
  const story = HISTORIAS[sv.i];
  const slide = story.slides[sv.j];
  seen.add(story.nombre);
  localStorage.setItem("dsas_seen", JSON.stringify([...seen]));

  $("#svName").textContent = `${story.icono || ""} ${story.nombre}`;
  $("#svMedia").innerHTML = mediaHTML(slide, slide.texto);
  $("#svProgress").innerHTML = story.slides
    .map((_, k) => `<span class="sv-bar ${k < sv.j ? "done" : k === sv.j ? "active" : ""}" style="--dur:${STORY_MS}ms"><i></i></span>`)
    .join("");
  $("#svWa").href = waLink(`¡Hola De Sol a Sol! ☀️ Vi su historia "${(slide.titulo || story.nombre).replace(/\n/g, " ")}" y quiero consultar.`);

  $("#storyViewer").classList.remove("paused");
  clearTimeout(sv.timer);
  sv.remaining = STORY_MS;
  sv.startedAt = Date.now();
  sv.timer = setTimeout(nextSlide, STORY_MS);
}

function nextSlide() {
  const story = HISTORIAS[sv.i];
  if (sv.j < story.slides.length - 1) { sv.j++; return showSlide(); }
  if (sv.i < HISTORIAS.length - 1) { sv.i++; sv.j = 0; return showSlide(); }
  closeStory();
}

function prevSlide() {
  if (sv.j > 0) { sv.j--; return showSlide(); }
  if (sv.i > 0) { sv.i--; sv.j = HISTORIAS[sv.i].slides.length - 1; return showSlide(); }
  showSlide();
}

function pauseStory() {
  clearTimeout(sv.timer);
  sv.remaining -= Date.now() - sv.startedAt;
  $("#storyViewer").classList.add("paused");
}

function resumeStory() {
  if (!$("#storyViewer").classList.contains("paused")) return;
  $("#storyViewer").classList.remove("paused");
  sv.startedAt = Date.now();
  sv.timer = setTimeout(nextSlide, Math.max(sv.remaining, 300));
}

/* =========================================================
   FEED + LIGHTBOX
   ========================================================= */
let filtro = "todos";
let visibles = [];
let lbIndex = 0;

function renderFilters() {
  const tipos = [...new Set(PUBLICACIONES.map((p) => p.tipo))].filter((t) => TIPOS[t]);
  $("#filters").innerHTML = [["todos", "⭐ Todo"], ...tipos.map((t) => [t, TIPOS[t]])]
    .map(([id, label]) => `<button class="chip ${id === filtro ? "active" : ""}" data-filter="${id}">${label}</button>`)
    .join("");
}

function renderFeed() {
  visibles = filtro === "todos" ? PUBLICACIONES : PUBLICACIONES.filter((p) => p.tipo === filtro);
  $("#feed").innerHTML = visibles.map((p, i) => `
    <button class="post" data-post="${i}" style="animation-delay:${i * 50}ms" aria-label="Ver ${esc(p.titulo)}">
      ${TIPOS[p.tipo] ? `<span class="post-tag">${TIPOS[p.tipo]}</span>` : ""}
      ${mediaHTML(p, "@" + NEGOCIO.instagram)}
    </button>`).join("");
}

function openLightbox(i) {
  lbIndex = i;
  fillLightbox();
  $("#lightbox").classList.add("open");
  $("#lightbox").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function fillLightbox() {
  const p = visibles[lbIndex];
  $("#lbMedia").innerHTML = mediaHTML(p, "@" + NEGOCIO.instagram);
  $("#lbTag").textContent = TIPOS[p.tipo] || "";
  $("#lbTitle").textContent = p.titulo;
  $("#lbDesc").textContent = p.descripcion || "";
  $("#lbWa").href = waLink(`¡Hola De Sol a Sol! ☀️ Vi la publicación "${p.titulo}" y quiero consultar.`);
  $("#lbIg").href = p.instagramPost || igProfile;
  const many = visibles.length > 1;
  $("#lbPrev").style.visibility = many ? "visible" : "hidden";
  $("#lbNext").style.visibility = many ? "visible" : "hidden";
}

function closeLightbox() {
  $("#lightbox").classList.remove("open");
  $("#lightbox").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function stepLightbox(d) {
  lbIndex = (lbIndex + d + visibles.length) % visibles.length;
  fillLightbox();
}

/* =========================================================
   Enlaces y eventos
   ========================================================= */
function applyLinks() {
  $("#year").textContent = new Date().getFullYear();
  const q = encodeURIComponent(NEGOCIO.mapa || NEGOCIO.direccion);
  $("#mapFrame").src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  $("#directionsBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  $("#footerMap").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $$(".ig-link").forEach((a) => Object.assign(a, { href: igProfile, target: "_blank", rel: "noopener" }));
  $$(".js-whatsapp").forEach((a) =>
    Object.assign(a, { href: waLink(a.dataset.msg || "¡Hola De Sol a Sol! ☀️"), target: "_blank", rel: "noopener" })
  );
}

/* =========================================================
   POP-UP PROMOCIONAL (configurable en contenido.js → POPUP)
   ========================================================= */
function shouldShowPromo() {
  if (typeof POPUP === "undefined" || !POPUP.activo) return false;
  if (new URLSearchParams(location.search).get("popup") === "1") return true; // forzar para probar
  const today = new Date().toISOString().slice(0, 10);
  if (POPUP.mostrar === "sesion") return !sessionStorage.getItem("dsas_promo");
  if (POPUP.mostrar === "dia") return localStorage.getItem("dsas_promo_day") !== today;
  return true; // "siempre"
}

function renderConfetti() {
  const box = $("#promo .confetti");
  if (!box || box.childElementCount) return;
  const colors = ["#ffd000", "#e3171b", "#ffffff", "#25d366", "#ff9800"];
  for (let i = 0; i < 26; i++) {
    const c = document.createElement("i");
    Object.assign(c.style, {
      left: Math.random() * 100 + "%",
      background: colors[i % colors.length],
      animationDuration: 3 + Math.random() * 4 + "s",
      animationDelay: -Math.random() * 6 + "s",
      width: 5 + Math.random() * 6 + "px",
      borderRadius: Math.random() > .5 ? "50%" : "2px",
    });
    box.appendChild(c);
  }
}

let promoLastFocus = null;
function openPromo() {
  // no interrumpir si el usuario ya abrió otra cosa
  if ($(".lightbox.open, .story-viewer.open, .drawer.open")) return;
  renderConfetti();
  promoLastFocus = document.activeElement;
  $("#promo").classList.add("open");
  $("#promo").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  setTimeout(() => $("#promoCta").focus({ preventScroll: true }), 400);
}

function closePromo() {
  if (!$("#promo").classList.contains("open")) return;
  $("#promo").classList.remove("open");
  $("#promo").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  sessionStorage.setItem("dsas_promo", "1");
  localStorage.setItem("dsas_promo_day", new Date().toISOString().slice(0, 10));
  if (promoLastFocus) promoLastFocus.focus({ preventScroll: true });
}

function setupPromo() {
  $("#promoClose").addEventListener("click", closePromo);
  $("#promoLater").addEventListener("click", closePromo);
  $("#promoCta").addEventListener("click", () => setTimeout(closePromo, 300));
  $("#promo").addEventListener("click", (e) => { if (e.target.id === "promo") closePromo(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePromo(); });
  if (shouldShowPromo()) setTimeout(openPromo, POPUP.demora ?? 1500);
}

function toggleDrawer(force) {
  const drawer = $("#drawer");
  const open = typeof force === "boolean" ? force : !drawer.classList.contains("open");
  if (open === drawer.classList.contains("open")) return;
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  $("#drawerOverlay").classList.toggle("show", open);
  $("#menuBtn").classList.toggle("open", open);
  $("#menuBtn").setAttribute("aria-expanded", String(open));
  $("#menuBtn").setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("no-scroll", open);
  if (open) setTimeout(() => $("#drawerClose").focus(), 300);
}

function onSwipe(el, left, right) {
  let x0 = null;
  el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? left : right)();
    x0 = null;
  });
}

function bindEvents() {
  // Navegación
  // Menú hamburguesa
  $("#menuBtn").addEventListener("click", () => toggleDrawer());
  $("#mbMenu").addEventListener("click", () => toggleDrawer(true));
  $("#drawerClose").addEventListener("click", () => toggleDrawer(false));
  $("#drawerOverlay").addEventListener("click", () => toggleDrawer(false));
  $$(".drawer-links a, .drawer-actions a").forEach((a) => a.addEventListener("click", () => toggleDrawer(false)));
  // deslizar el panel hacia la izquierda para cerrarlo
  onSwipe($("#drawer"), () => toggleDrawer(false), () => {});

  // Barra inferior: se esconde mientras se hace scroll (arriba o abajo) y vuelve al soltar
  const bar = $(".mobile-bar");
  let barTimer;
  window.addEventListener("scroll", () => {
    bar.classList.add("hidden");
    clearTimeout(barTimer);
    barTimer = setTimeout(() => bar.classList.remove("hidden"), 450);
  }, { passive: true });
  window.addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  // Barra inferior: resalta "Llegar" u "Horarios" según la sección visible
  let spyTick = false;
  const spy = () => {
    spyTick = false;
    const mid = window.innerHeight * 0.5;
    const inView = (id) => { const r = $("#" + id).getBoundingClientRect(); return r.top < mid && r.bottom > mid; };
    const current = inView("ubicacion") ? "ubicacion" : inView("horarios") ? "horarios" : "";
    $$(".mb-item[data-spy]").forEach((el) => el.classList.toggle("active", el.dataset.spy === current));
  };
  window.addEventListener("scroll", () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });

  // Día / noche manual
  $("#modeToggle").addEventListener("click", () => {
    modoForzado = document.body.classList.contains("is-day") ? "noche" : "dia";
    setTheme(modoForzado === "dia");
  });

  // Historias
  $("#stories").addEventListener("click", (e) => {
    const b = e.target.closest("[data-story]");
    if (b) openStory(+b.dataset.story);
  });
  $("#svClose").addEventListener("click", closeStory);
  [["#svPrev", prevSlide], ["#svNext", nextSlide]].forEach(([sel, fn]) => {
    const el = $(sel);
    el.addEventListener("pointerdown", () => { sv.downAt = Date.now(); pauseStory(); });
    el.addEventListener("pointerup", () => {
      const held = Date.now() - sv.downAt > 250;
      if (held) resumeStory(); else fn();
    });
    el.addEventListener("pointerleave", resumeStory);
  });
  $("#storyViewer").addEventListener("click", (e) => { if (e.target.id === "storyViewer") closeStory(); });

  // Feed
  $("#filters").addEventListener("click", (e) => {
    const c = e.target.closest("[data-filter]");
    if (!c) return;
    filtro = c.dataset.filter;
    renderFilters();
    renderFeed();
  });
  $("#feed").addEventListener("click", (e) => {
    const p = e.target.closest("[data-post]");
    if (p) openLightbox(+p.dataset.post);
  });

  // Lightbox
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
  $("#lbNext").addEventListener("click", () => stepLightbox(1));
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
  onSwipe($("#lbMedia"), () => stepLightbox(1), () => stepLightbox(-1));

  // Teclado
  document.addEventListener("keydown", (e) => {
    const lb = $("#lightbox").classList.contains("open");
    const st = $("#storyViewer").classList.contains("open");
    if (e.key === "Escape") { if (lb) closeLightbox(); if (st) closeStory(); toggleDrawer(false); }
    if (e.key === "ArrowRight") { if (lb) stepLightbox(1); if (st) nextSlide(); }
    if (e.key === "ArrowLeft") { if (lb) stepLightbox(-1); if (st) prevSlide(); }
  });
}

/* =========================================================
   Init
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyLinks();
  setupBackgrounds();
  renderStars();
  renderMarquee();
  renderStories();
  renderFilters();
  renderFeed();
  updateStatus();
  setInterval(updateStatus, 30000);
  bindEvents();
  setupPromo();
});
