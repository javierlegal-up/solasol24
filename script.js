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
  promo: "Promociones",
  combo: "Combos",
  sorteo: "Sorteos",
  evento: "Eventos",
  local: "El local",
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
    if (aMas(day)) return { state: "open", title: "¡Abiertos ahora!", sub: "Hoy atendemos desde las 09:00 ¡a más!" };
    return { state: "open", title: "¡Abiertos ahora!", sub: `Hoy hasta las 04:00 · cerramos en ${fmtDuration(24 * 60 - mins + close)}` };
  }
  if (mins < close) {
    if (aMas(prev)) return { state: "open", title: "¡Abiertos ahora!", sub: "Noche de finde: seguimos ¡a más!" };
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

  // Cartel de neón: "ABIERTO" (o el texto configurado) / "CERRADO" con el neón apagado
  const neon = NEGOCIO.neon || {};
  const n1 = $("#neon1"), n2 = $("#neon2");
  if (n1) n1.textContent = st.state === "closed" ? "CERRADO" : (neon.linea1 || "ABIERTO");
  if (n2) n2.textContent = neon.linea2 || "DE SOL A SOL";
  const n3 = $("#neon3");
  if (n3) {
    n3.textContent = neon.destacado ?? "24/7";
    n3.hidden = !n3.textContent;
  }
  $("#footerStatusSub").textContent = st.sub;
  updateShift(now, st);
  $("#statusText").textContent = `${icon} ${st.title}`;
  $("#statusSub").textContent = st.sub;

  setTheme(modoForzado ? modoForzado === "dia" : esDeDia(now));

  const leads = [
    [4, 12, "Pan, lácteos y todo para el desayuno. Consultanos lo que necesites por WhatsApp."],
    [12, 19, "Bebidas, golosinas y almacén a pocas cuadras. Consultanos lo que necesites por WhatsApp."],
    [19, 24, "Bebidas frías y todo para la noche. Consultanos por WhatsApp."],
    [0, 4, "Seguimos abiertos de madrugada. Consultanos por WhatsApp."],
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
      : HORARIO.diasAMas.includes(shiftDay) ? "Hoy abiertos ¡a más!"
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

/** true si, según la hora LOCAL del visitante, es de día (configurable en contenido.js) */
function esDeDia(now = new Date()) {
  const dia = NEGOCIO.horaDia ?? 6;
  const noche = NEGOCIO.horaNoche ?? 19;
  const h = now.getHours();
  return h >= dia && h < noche;
}

function setTheme(isDay) {
  document.body.classList.toggle("is-day", isDay);
  document.body.classList.toggle("is-night", !isDay);
  const btn = $("#modeToggle");
  if (btn) {
    // Solo ícono: de día muestra la LUNA (pasar a noche), de noche muestra el SOL (pasar a día)
    const luna = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8z"/></svg>`;
    const sol = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>`;
    btn.innerHTML = isDay ? luna : sol;
    btn.setAttribute("aria-label", isDay ? "Ver la página en modo noche" : "Ver la página en modo día");
    btn.title = isDay ? "Modo noche" : "Modo día";
  }
  updateHeroVideo(isDay);
}

/* ---------- Video de portada según día / noche ----------
   - Solo descarga el video que corresponde (ahorra datos).
   - Si no hay video, falla o el usuario pidió "menos movimiento" / ahorro de datos,
     se queda la foto con su efecto de día o de noche.                          */
const sinVideo =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  (navigator.connection && navigator.connection.saveData);

function updateHeroVideo(isDay) {
  const vDia = $("#heroVideoDia"), vNoche = $("#heroVideoNoche");
  if (!vDia || !vNoche) return;
  const activo = isDay ? vDia : vNoche;
  const otro = isDay ? vNoche : vDia;
  const archivo = isDay ? NEGOCIO.videoDia : NEGOCIO.videoNoche;

  // apagar el del otro horario (fundido)
  otro.classList.remove("on");
  if (!otro.paused) setTimeout(() => otro.pause(), 1200);

  if (!archivo || sinVideo || activo.dataset.error) { activo.classList.remove("on"); return; }

  // cargar el video la primera vez que se necesita
  if (!activo.dataset.loaded) {
    activo.dataset.loaded = "1";
    activo.addEventListener("canplay", () => activo.classList.add("on"), { once: true });
    activo.addEventListener("error", () => { activo.dataset.error = "1"; activo.classList.remove("on"); }, { once: true });
    activo.src = encodeURI(archivo);
    activo.load();
  } else if (activo.readyState >= 3) {
    activo.classList.add("on");
  }
  if (activo.paused) activo.play().catch(() => {});
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

  // Noche con cartel de neón sobre pared de ladrillo (configurable en contenido.js)
  document.body.classList.toggle("neon-on", !!(NEGOCIO.neon && NEGOCIO.neon.activo !== false));
  // Fondo desenfocado detrás del neón (si la foto no carga, queda la pared de ladrillo)
  if (NEGOCIO.neon && NEGOCIO.neon.fondo) {
    const nf = new Image();
    nf.onload = () => {
      root.setProperty("--bg-neon", cssUrl(NEGOCIO.neon.fondo));
      root.setProperty("--bg-neon-pos", NEGOCIO.neon.fondoPos || "center");
      root.setProperty("--bg-neon-blur", (NEGOCIO.neon.desenfoque ?? 16) + "px");
      root.setProperty("--bg-neon-bright", String(NEGOCIO.neon.brillo ?? 0.42));
      document.body.classList.add("neon-photo");
    };
    nf.src = encodeURI(NEGOCIO.neon.fondo);
  }

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
  if (!box) return;
  const total = window.innerWidth < 600 ? 18 : 35; // pocas estrellas: sutil y fluido
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
  if ($("#marquee")) $("#marquee").innerHTML = html + html;
}

/* =========================================================
   HISTORIAS
   ========================================================= */
const seen = new Set(JSON.parse(localStorage.getItem("dsas_seen") || "[]"));
const STORY_MS = 5000;
let sv = { i: 0, j: 0, timer: null, startedAt: 0, remaining: STORY_MS, downAt: 0 };

function renderStories() {
  if (!$("#stories")) return; // la barra de historias fue quitada de la página
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
  $("#filters").innerHTML = [["todos", "Todo"], ...tipos.map((t) => [t, TIPOS[t]])]
    .map(([id, label]) => `<button class="chip ${id === filtro ? "active" : ""}" data-filter="${id}">${label}</button>`)
    .join("");
}

function renderFeed() {
  visibles = filtro === "todos" ? PUBLICACIONES : PUBLICACIONES.filter((p) => p.tipo === filtro);
  // Tarjetas limpias: foto real + categoría + título + descripción breve
  $("#feed").innerHTML = visibles.map((p, i) => `
    <button class="card" data-post="${i}" aria-label="Ver ${esc(p.titulo)}">
      <span class="card-media">${mediaHTML(p)}</span>
      <span class="card-body">
        ${TIPOS[p.tipo] ? `<span class="card-cat">${TIPOS[p.tipo]}</span>` : ""}
        <span class="card-title">${esc(p.titulo)}</span>
        ${p.descripcion ? `<span class="card-desc">${esc(p.descripcion)}</span>` : ""}
        <span class="card-more">Ver detalle →</span>
      </span>
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

/* =========================================================
   NUESTRO LOCAL · MARCAS · RESEÑAS
   ========================================================= */
function renderLocal() {
  const box = $("#localMosaic");
  if (box && typeof LOCAL_FOTOS !== "undefined") {
    box.innerHTML = LOCAL_FOTOS.slice(0, 3).map((f, i) => `
      <figure class="mosaic-item m${i + 1}">
        <img src="${esc(encodeURI(f.img))}" alt="${esc(f.alt || "")}" loading="lazy" onerror="this.closest('figure').classList.add('empty')" />
      </figure>`).join("");
  }

  // Carrusel de marcas: 2 filas en sentidos opuestos, loop infinito
  const marquee = $("#brandsMarquee");
  if (!marquee) return;
  if (typeof MARCAS === "undefined" || !MARCAS.length) { marquee.closest(".brands").hidden = true; return; }
  // (el detalle de repetidas se calcula abajo)

  // --- Detectar marcas repetidas (mismo nombre o mismo archivo) ---
  // En tu compu (localhost / archivo local) se muestran con la etiqueta "REPETIDO · ELIMINAR".
  // En la página publicada, las repetidas se ocultan solas.
  const enLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  const vistos = new Set();
  const repetidas = [];
  const marcas = MARCAS
    .map((m) => (typeof m === "string" ? { nombre: m, logo: "" } : m))
    .map((m) => {
      const kNombre = "n:" + m.nombre.trim().toLowerCase();
      const kLogo = m.logo ? "l:" + m.logo.trim().toLowerCase() : null;
      const dup = vistos.has(kNombre) || (kLogo && vistos.has(kLogo));
      vistos.add(kNombre); if (kLogo) vistos.add(kLogo);
      if (dup) repetidas.push(`${m.nombre} → ${m.logo || "(sin logo)"}`);
      return { ...m, dup };
    })
    .filter((m) => !m.dup || enLocal);
  if (repetidas.length) console.warn("Marcas repetidas (eliminar):\n" + repetidas.join("\n"));

  // cada marca: logo + su nombre debajo (o solo el nombre si falta el logo)
  const items = (arr) => arr.map((m) => {
    const badge = m.dup ? `<em class="brand-dup">Repetido · eliminar</em>` : "";
    const cls = m.dup ? ` class="is-dup"` : "";
    return m.logo
      ? `<li${cls} title="${esc(m.nombre)}">${badge}
           <img src="${esc(encodeURI(m.logo))}" alt="${esc(m.nombre)}" loading="lazy" decoding="async"
                onerror="this.remove()" />
           <span class="brand-name">${esc(m.nombre)}</span>
         </li>`
      : `<li${cls}>${badge}<span class="brand-name only">${esc(m.nombre)}</span></li>`;
  }).join("");
  const half = Math.ceil(marcas.length / 2);
  const rowA = marcas.length > 6 ? marcas.slice(0, half) : marcas;
  const rowB = marcas.length > 6 ? marcas.slice(half) : [...marcas].reverse();
  // cada fila se repite hasta llenar bien el ancho, y luego se duplica para el loop
  const fill = (arr) => { let out = []; while (out.length < 10) out = out.concat(arr); return out; };
  const row = (arr, reverse) => {
    const list = fill(arr);
    const dur = Math.max(list.length * 3.2, 24); // velocidad pareja según cantidad
    return `
      <div class="brands-row${reverse ? " reverse" : ""}" style="--dur:${dur}s">
        <ul class="brands-track">${items(list)}</ul>
        <ul class="brands-track" aria-hidden="true">${items(list)}</ul>
      </div>`;
  };
  marquee.innerHTML = row(rowA, false) + row(rowB, true);
}

function renderReviews() {
  const sec = $("#resenas");
  if (!sec || typeof RESENAS === "undefined" || !RESENAS.length) return; // sin reseñas: queda oculta
  const stars = (n) => {
    const k = Math.max(1, Math.min(5, Math.round(n || 5)));
    return `<span class="stars-rating" aria-label="${k} de 5 estrellas">${"★".repeat(k)}<span>${"★".repeat(5 - k)}</span></span>`;
  };
  $("#reviews").innerHTML = RESENAS.slice(0, 6).map((r) => `
    <figure class="review">
      ${stars(r.estrellas)}
      <blockquote>“${esc(r.texto)}”</blockquote>
      <figcaption>
        <span class="review-avatar">${esc((r.nombre || "?").trim().charAt(0).toUpperCase())}</span>
        <span><b>${esc(r.nombre || "Cliente")}</b>${r.fecha ? `<small>${esc(r.fecha)}</small>` : ""}</span>
      </figcaption>
    </figure>`).join("");
  if (typeof RESENAS_LINK !== "undefined" && RESENAS_LINK) {
    $("#reviewsLink").href = RESENAS_LINK;
    $("#reviewsMore").hidden = false;
  }
  sec.hidden = false;
}

/* ---------- BANNERS PUBLICITARIOS (carrusel) ---------- */
function renderBanners() {
  const lista = typeof BANNERS !== "undefined" ? BANNERS : [];
  $$("[data-banner]").forEach((root) => {
    if (!lista.length) {
      root.hidden = true;
      const sec = root.closest(".banner-sec");
      if (sec) sec.hidden = true;
      return;
    }
    const slides = lista.map((b, i) => {
      const esWa = b.enlace === "whatsapp";
      const href = esWa ? waLink(b.mensaje || "¡Hola De Sol a Sol! ☀️") : (b.enlace || "#galeria");
      const ext = esWa ? ' target="_blank" rel="noopener"' : "";
      const tema = ["azul", "rojo", "amarillo"].includes(b.tema) ? b.tema : "azul";
      return `
        <article class="bn-slide bn-${tema}${b.img ? "" : " bn-noimg"}" role="group" aria-label="${i + 1} de ${lista.length}">
          <div class="bn-text">
            ${b.etiqueta ? `<span class="bn-tag">${esc(b.etiqueta)}</span>` : ""}
            <h3>${esc(b.titulo)}</h3>
            ${b.texto ? `<p>${esc(b.texto)}</p>` : ""}
            <a class="bn-btn" href="${href}"${ext}>
              ${esWa ? `<svg width="18" height="18"><use href="#i-wa" /></svg>` : ""}${esc(b.boton || "Ver más")}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          ${b.img ? `<div class="bn-media"><img src="${esc(encodeURI(b.img))}" alt="" loading="lazy"
                style="object-position:${esc(b.pos || "center")}" onerror="this.parentNode.remove()" /></div>` : ""}
        </article>`;
    }).join("");
    const dots = lista.length > 1
      ? `<div class="bn-dots">${lista.map((_, i) => `<button type="button" aria-label="Ver banner ${i + 1}" data-go="${i}"></button>`).join("")}</div>`
      : "";
    const nav = lista.length > 1
      ? `<button type="button" class="bn-nav bn-prev" aria-label="Anterior"><svg width="18" height="18" style="transform:rotate(180deg)"><use href="#i-chevron" /></svg></button>
         <button type="button" class="bn-nav bn-next" aria-label="Siguiente"><svg width="18" height="18"><use href="#i-chevron" /></svg></button>`
      : "";
    const count = lista.length > 1 ? `<span class="bn-count" aria-hidden="true">1 / ${lista.length}</span>` : "";
    const hint = lista.length > 1
      ? `<p class="bn-hint">Deslizá para ver más <svg width="14" height="14"><use href="#i-chevron" /></svg></p>` : "";
    // .bn-frame: marco con el trazo de neón animado que recorre el borde
    root.innerHTML = `<div class="bn-frame"><div class="bn-track">${slides}</div></div>${count}${nav}${dots}${hint}`;
    if (lista.length > 1) setupBanner(root, lista.length);
  });
}

function setupBanner(root, total) {
  const track = $(".bn-track", root);
  const dots = $$(".bn-dots button", root);
  let idx = 0, pausedUntil = 0;

  const go = (i) => {
    idx = (i + total) % total;
    track.scrollTo({ left: track.clientWidth * idx, behavior: "smooth" });
  };
  const sync = () => {
    if (!track.clientWidth) return;
    idx = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, k) => d.classList.toggle("on", k === idx));
    const c = $(".bn-count", root);
    if (c) c.textContent = `${idx + 1} / ${total}`;
  };

  // Aviso de deslizamiento en celular: la primera vez que se ve el banner, se "asoma" el siguiente
  if (window.matchMedia("(hover: none)").matches && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      setTimeout(() => {
        if (idx !== 0) return;
        track.scrollTo({ left: track.clientWidth * 0.18, behavior: "smooth" });
        setTimeout(() => track.scrollTo({ left: 0, behavior: "smooth" }), 650);
      }, 900);
    }, { threshold: 0.6 });
    io.observe(root);
  }
  let tick = false;
  track.addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; sync(); }); } }, { passive: true });
  dots.forEach((d) => d.addEventListener("click", () => { pausedUntil = Date.now() + 10000; go(+d.dataset.go); }));
  $(".bn-prev", root)?.addEventListener("click", () => { pausedUntil = Date.now() + 10000; go(idx - 1); });
  $(".bn-next", root)?.addEventListener("click", () => { pausedUntil = Date.now() + 10000; go(idx + 1); });
  ["pointerenter", "touchstart", "focusin"].forEach((ev) =>
    root.addEventListener(ev, () => { pausedUntil = Date.now() + 10000; }, { passive: true })
  );
  sync();

  // Avance automático cada 6 s (se pausa si el usuario interactúa o pidió "menos movimiento")
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  setInterval(() => {
    if (Date.now() < pausedUntil || document.hidden || !root.offsetParent) return;
    go(idx + 1);
  }, 6000);
}

/* ---------- QUÉ ENCONTRÁS: tarjetas de categorías ---------- */
function renderCategorias() {
  const box = $("#cats");
  if (!box || typeof CATEGORIAS === "undefined" || !CATEGORIAS.length) {
    if (box) box.closest(".section").hidden = true;
    return;
  }
  const enLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  box.innerHTML = CATEGORIAS.map((c) => {
    const msg = `¡Hola De Sol a Sol! ☀️ ¿Qué tienen de ${c.nombre.toLowerCase()}?`;
    const archivo = (c.img || "").split("/").pop();
    return `
      <a class="cat" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="Consultar por ${esc(c.nombre)}">
        <span class="cat-media" data-file="${esc(archivo)}">
          ${c.img ? `<img src="${esc(encodeURI(c.img))}" alt="${esc(c.nombre)}" loading="lazy"
                onerror="this.parentNode.classList.add('missing'); this.remove()" />` : ""}
          ${enLocal ? `<span class="cat-missing">📷 Falta foto<br /><code>fotos/productos/${esc(archivo)}</code></span>` : ""}
        </span>
        <span class="cat-body">
          <b>${esc(c.nombre)}</b>
          <small>${esc(c.desc || "")}</small>
          <span class="cat-cta"><svg width="14" height="14"><use href="#i-wa" /></svg> Consultar</span>
        </span>
      </a>`;
  }).join("");
  // si no hay imagen definida, también se marca como faltante
  $$(".cat-media", box).forEach((m) => { if (!m.querySelector("img")) m.classList.add("missing"); });
}

/* =========================================================
   PÁGINAS INDIVIDUALES (sin scroll infinito)
   Cada sección pertenece a una página (atributo data-page).
   La dirección cambia según la página: #inicio, #galeria, #productos, #local, #horarios
   ========================================================= */
const PAGINA_DE = {
  inicio: "inicio", accesos: "inicio", destacados: "inicio",
  galeria: "promos",
  productos: "productos",
  local: "local", resenas: "local",
  horarios: "contacto", ubicacion: "contacto",
};
const TITULO_DE = {
  inicio: "DE SOL A SOL · Minimarket · San Roque, Corrientes",
  promos: "Promociones y combos · DE SOL A SOL",
  productos: "Productos · DE SOL A SOL",
  local: "Nuestro local · DE SOL A SOL",
  contacto: "Horarios y ubicación · DE SOL A SOL",
};
let paginaActual = null;

function showPage() {
  const id = decodeURIComponent((location.hash || "").slice(1)) || "inicio";
  const pagina = PAGINA_DE[id] || "inicio";
  paginaActual = pagina;

  $$("[data-page]").forEach((el) => el.classList.toggle("page-on", el.dataset.page === pagina));
  document.body.classList.add("pages-ready");
  $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === pagina));
  document.body.dataset.page = pagina;
  document.title = TITULO_DE[pagina];
  alternateSections();

  // ¿Es el comienzo de una página o un punto dentro de ella (ej: #ubicacion)?
  const destino = document.getElementById(id);
  const esInicioDePagina = !destino || destino.hasAttribute("data-page");
  if (esInicioDePagina) {
    window.scrollTo({ top: 0, behavior: "instant" });
  } else {
    requestAnimationFrame(() => destino.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
}

function setupPages() {
  window.addEventListener("hashchange", showPage);
  // Tocar el enlace de la página en la que ya estás → vuelve arriba
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (href === "#" || href === "") return;
    if (href === location.hash || (href === "#inicio" && !location.hash)) {
      e.preventDefault();
      showPage();
    }
  });
  // Botón "volver arriba" del pie: sube dentro de la página actual
  $("#toTop")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  showPage();
}

/** Fondos alternados (gris / blanco) según las secciones visibles en la página actual */
function alternateSections() {
  const secs = $$("main > .section, main > .ig-band")
    .filter((s) => !s.hidden && (!s.dataset.page || s.classList.contains("page-on")));
  secs.forEach((s, i) => {
    s.classList.toggle("bg-soft", i % 2 === 0);
    s.classList.toggle("bg-white", i % 2 === 1);
  });
}

/* =========================================================
   PIE DE PÁGINA INTERACTIVO
   ========================================================= */
function toast(text) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // respaldo para navegadores sin permiso de portapapeles
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** Barra "Turno de hoy": 09:00 → 04:00 (o "¡a más!" el finde) con marcador de la hora actual */
function updateShift(now, st) {
  const box = $(".f-shift");
  if (!box) return;
  const open = HORARIO.abre * 60;
  const close = HORARIO.cierra * 60;
  const total = 24 * 60 - open + close; // 19 h de turno
  const mins = now.getHours() * 60 + now.getMinutes();
  const prev = (now.getDay() + 6) % 7;

  let elapsed = null, shiftDay = now.getDay();
  if (mins >= open) elapsed = mins - open;
  else if (st.state !== "closed") { elapsed = 24 * 60 - open + mins; shiftDay = prev; }

  const late = HORARIO.diasAMas.includes(shiftDay);
  const pct = elapsed === null ? 0 : Math.min(elapsed / total, 1) * 100;

  box.classList.toggle("late", late);
  box.classList.toggle("closed", elapsed === null);
  $("#shiftFill").style.width = pct + "%";
  $("#shiftNow").style.left = pct + "%";
  $("#shiftEnd").textContent = late ? "¡a más!" : "04:00";
  $("#shiftLabel").textContent =
    elapsed === null ? "Abre a las 09:00"
    : late && elapsed >= total ? "Noche extendida"
    : late ? "Hoy hasta tarde"
    : `Quedan ${fmtDuration(Math.max(total - elapsed, 0))}`;
}

function setupFooter() {
  // 1) Consulta rápida → WhatsApp
  const form = $("#footerForm"), input = $("#footerMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
      input.focus();
      return;
    }
    window.open(waLink(`¡Hola De Sol a Sol! ☀️ ${q}`), "_blank", "noopener");
    input.value = "";
  });
  $("#footerChips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    input.value = b.dataset.q;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });

  // 2) Copiar dirección / número / usuario
  $$(".f-copy").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!(await copyText(btn.dataset.copy))) return toast("No se pudo copiar");
      toast(`✓ ${btn.dataset.ok || "Copiado"}`);
      const use = btn.querySelector("use");
      btn.classList.add("done");
      use.setAttribute("href", "#i-check");
      setTimeout(() => { btn.classList.remove("done"); use.setAttribute("href", "#i-copy"); }, 1600);
    })
  );

  // 3) Compartir la página
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: "DE SOL A SOL · Minimarket", text: "Minimarket en San Roque, Corrientes", url: location.href.split("?")[0] };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelado */ }
    } else if (await copyText(data.url)) {
      toast("✓ Enlace copiado");
    }
  });

  // 4) Secciones plegables en celular
  $$(".f-toggle").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (window.innerWidth > 600) return;
      const col = btn.closest(".f-col");
      const open = col.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    })
  );

  // 5) Anillo de progreso del botón "volver arriba"
  const ring = $("#topRing");
  const LEN = 125.66;
  let tick = false;
  const paint = () => {
    tick = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    ring.style.strokeDashoffset = String(LEN * (1 - p));
  };
  window.addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
  paint();
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
  $("#modeToggle")?.addEventListener("click", () => {
    modoForzado = document.body.classList.contains("is-day") ? "noche" : "dia";
    setTheme(modoForzado === "dia");
  });

  // Historias
  $("#stories")?.addEventListener("click", (e) => {
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
  renderBanners();
  renderCategorias();
  renderLocal();
  renderReviews();
  setupPages();   // muestra solo la página actual (incluye los fondos alternados)
  bindEvents();
  setupFooter();
  setupPromo();

  // ya está todo en su lugar: se habilitan las transiciones (día ↔ noche será con fundido)
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("preload")));
});
