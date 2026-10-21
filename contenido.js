/* =========================================================
   📸 CONTENIDO DE LA PÁGINA — EDITÁ SOLO ESTE ARCHIVO
   ---------------------------------------------------------
   CÓMO SUBIR TUS FOTOS:
   1. Copiá tu foto a la carpeta "fotos" (ej: fotos/sorteo-octubre.webp)
   2. Escribí ese nombre en "img" (ej: img: "fotos/sorteo-octubre.webp")
   3. Guardá y recargá la página.

   - Si la foto no existe todavía, se muestra un afiche de colores
     con el texto de "titulo" (así la página nunca se ve vacía).
   - Fotos recomendadas: cuadradas (1080x1080) para el feed y
     verticales (1080x1920) para las historias. WEBP o JPG.
   - Para achicar fotos usá convertir-webp.html
   - Para quitar una publicación, borrá su bloque { ... }.
   - El orden acá es el orden en la página (la primera sale arriba).
   ========================================================= */

const NEGOCIO = {
  whatsapp: "5493777203520",          // 3777 20-3520 → formato internacional: 549 + área + número
  telefono: "3777 20-3520",           // Cómo se muestra en la página
  instagram: "desolasol_minimarket",
  direccion: "Reimundo Reguera 957",
  ciudad: "San Roque, Corrientes",
  mapa: "Reimundo Reguera 957, San Roque, Corrientes, Argentina",

  // Fondo del encabezado (foto del frente del local)
  // Se usa la versión WEBP (liviana). Si no existe, se usa el PNG original automáticamente.
  fondoDia: "fotos/fachada.webp",
  // Opcional: foto REAL del local de noche, horizontal y de buena resolución.
  // Si no existe, se usa la foto de día con efecto nocturno automático.
  fondoNoche: "fotos/fachada-noche.webp",
};

/* ---------- CARTEL EMERGENTE (pop-up de bebidas a consignación) ----------
   activo:  true = se muestra · false = apagado
   mostrar: "siempre" → cada vez que entran a la página
            "sesion"  → una vez por visita (si cierran el navegador, vuelve a salir)
            "dia"     → una vez por día por persona
   demora:  milisegundos antes de aparecer (1500 = 1,5 segundos)            */
const POPUP = {
  activo: true,
  mostrar: "sesion",
  demora: 1500,
};

/* ---------- Fotos reales (nombres de archivo en la carpeta fotos) ---------- */
const FOTO = {
  entrada:    "fotos/WhatsApp Image 2026-10-21 at 10.18.38 AM.jpeg",   // puerta del local, carteles del Mundial
  interior:   "fotos/whatsapp-image-2026-10-21-at-10.18.39-am.webp",   // pasillo con góndolas y bebidas
  alfajores:  "fotos/whatsapp-image-2026-10-21-at-10.18.39-am-(2).webp",
  golosinas:  "fotos/WhatsApp Image 2026-10-21 at 10.33.24 AM.jpeg",   // exhibidor de golosinas
  vinos:      "fotos/WhatsApp Image 2026-10-21 at 10.36.46 AM.jpeg",   // vinos, espumantes y bebidas blancas
};

/* ---------- HISTORIAS (burbujas de arriba) ----------
   Cada historia puede tener varias fotos ("slides").
   Colores de afiche disponibles: "rojo", "amarillo", "azul"  */
const HISTORIAS = [
  {
    nombre: "El local",
    icono: "🏪",
    slides: [
      { img: FOTO.entrada,  titulo: "¡PASÁ,\nESTAMOS ABIERTOS!", texto: "Reimundo Reguera 957", color: "azul" },
      { img: FOTO.interior, titulo: "TODO EN UN\nSOLO LUGAR", texto: "Bebidas, golosinas y almacén", color: "azul" },
    ],
  },
  {
    nombre: "Golosinas",
    icono: "🍫",
    slides: [
      { img: FOTO.golosinas, titulo: "¡GOLOSINAS!", texto: "Chocolates, alfajores y caramelos", color: "amarillo" },
      { img: FOTO.alfajores, titulo: "¡DEJATE\nTENTAR!", texto: "Alfajores para todos los gustos", color: "amarillo" },
    ],
  },
  {
    nombre: "Vinos +18",
    icono: "🍷",
    slides: [
      { img: FOTO.vinos, titulo: "VINOS Y\nESPUMANTES", texto: "Venta solo a mayores de 18 años", color: "rojo" },
    ],
  },
  {
    nombre: "Sorteos",
    icono: "🎁",
    slides: [
      { img: "fotos/historia-sorteo.webp", titulo: "¡GRAN SORTEO!", texto: "Seguinos y participá en Instagram", color: "rojo" },
    ],
  },
  {
    nombre: "Horarios",
    icono: "⏰",
    slides: [
      { img: "", titulo: "LUN A JUE\n09:00 – 04:00", texto: "De corrido", color: "azul" },
      { img: "", titulo: "VIE · SÁB · DOM\n09:00 – ¡A MÁS!", texto: "🎉 Noches largas", color: "rojo" },
    ],
  },
  {
    nombre: "Ubicación",
    icono: "📍",
    slides: [
      { img: "", titulo: "REIMUNDO\nREGUERA 957", texto: "San Roque, Corrientes", color: "azul" },
    ],
  },
];

/* ---------- FEED PUBLICITARIO (galería) ----------
   tipo: "sorteo" | "promo" | "combo" | "evento" | "local"  (se usa para los filtros)
   instagramPost: link a la publicación en Instagram (opcional).
                  Si lo dejás vacío, el botón abre tu perfil. */
const PUBLICACIONES = [
  // ---- Fotos reales ----
  { img: FOTO.entrada, tipo: "evento", titulo: "¡VAMOS ARGENTINA! 🇦🇷", descripcion: "Vivimos el Mundial 2026 de sol a sol. Pasá a buscar todo para ver los partidos: bebidas, picada y golosinas. ⚽", color: "azul", instagramPost: "" },
  { img: FOTO.golosinas, tipo: "promo", titulo: "PARAÍSO DE GOLOSINAS", descripcion: "Hamlet, Cofler Block, Bon o Bon, Mogul, Cereal Mix y mucho más. Para el antojo de cualquier hora. 🍬🍫", color: "amarillo", instagramPost: "" },
  { img: FOTO.alfajores, tipo: "promo", titulo: "¡DEJATE TENTAR!", descripcion: "Alfajores para todos los gustos: Cofler Block, Bon o Bon, Chocotorta, Minitorta y muchos más. 🍫 ¡Consultá por WhatsApp!", color: "amarillo", instagramPost: "" },
  { img: FOTO.vinos, tipo: "promo", titulo: "VINOS Y ESPUMANTES", descripcion: "Malbec, espumantes, aperitivos y bebidas blancas para cada ocasión. 🍷 Venta exclusiva a mayores de 18 años.", color: "rojo", instagramPost: "" },
  { img: FOTO.interior, tipo: "local", titulo: "TODO EN UN SOLO LUGAR", descripcion: "Bebidas, vinos, golosinas, galletitas y almacén. Vení a visitarnos a Reimundo Reguera 957. ☀️", color: "azul", instagramPost: "" },

  // ---- Afiches de ejemplo (reemplazalos por tus fotos cuando las tengas) ----
  { img: "fotos/post-sorteo.webp", tipo: "sorteo", titulo: "¡SORTEO DEL MES!", descripcion: "Seguí a @desolasol_minimarket, dale like y etiquetá a 2 amigos. ¡Podés ganar!", color: "rojo", instagramPost: "" },
  { img: "fotos/post-previa.webp", tipo: "combo", titulo: "COMBO PREVIA", descripcion: "Bebida, hielo y snacks. Consultá el combo de hoy por WhatsApp. 🧊", color: "azul", instagramPost: "" },
  { img: "fotos/post-finde.webp", tipo: "evento", titulo: "FINDE ¡A MÁS!", descripcion: "Viernes, sábado y domingo atendemos desde las 09:00 ¡a más! 🎉", color: "rojo", instagramPost: "" },
  { img: "fotos/post-oferta.webp", tipo: "promo", titulo: "OFERTA DEL DÍA", descripcion: "Cada día algo distinto. Preguntá por WhatsApp. 🔥", color: "amarillo", instagramPost: "" },
];
