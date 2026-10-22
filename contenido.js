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

  // ---------- PORTADA DE DÍA / NOCHE ----------
  // Se elige según la hora local del celular o compu de cada visitante.
  horaDia: 6,      // desde las 06:00 se muestra la versión de DÍA
  horaNoche: 19,   // desde las 19:00 se muestra la versión de NOCHE

  // Videos de portada (opcionales). Formato MP4 (H.264), horizontal, sin audio,
  // de 10 a 20 segundos y menos de 5 MB. Si están vacíos o no existen, se usan las fotos.
  videoDia: "",    // ej: "fotos/video-dia.mp4"
  videoNoche: "",  // ej: "fotos/video-noche.mp4"

  // Fondo del encabezado (foto del frente del local)
  // Se usa la versión WEBP (liviana). Si no existe, se usa el PNG original automáticamente.
  fondoDia: "fotos/fachada.webp",
  // Foto REAL del local de noche. Se muestra de noche en celular y tablet.
  // En compu se usa el efecto nocturno sobre la foto de día (porque esta foto es vertical).
  // Si el archivo no existe, se usa el efecto nocturno en todos lados.
  // De noche, la portada muestra una pared de ladrillo con un CARTEL DE NEÓN.
  // linea1 (azul): cuando el local está cerrado cambia sola a "CERRADO" con el neón apagado.
  // linea2 (rosa): frase fija. Para volver al efecto de noche anterior: activo: false
  // destacado (rosa grande): "24/7". Para quitarlo, dejalo vacío: destacado: ""
  // fondo: foto que se muestra DESENFOCADA detrás del cartel (efecto luces de bar).
  //        Si la dejás vacía, se usa la pared de ladrillo.
  neon: {
    activo: true,
    linea1: "ABIERTO",
    destacado: "24/7",
    linea2: "DE SOL A SOL",
    fondo: "fotos/WhatsApp Image 2026-10-21 at 10.36.46 AM.jpeg",   // góndola de vinos con luces LED azules
    fondoPos: "center 30%",                                          // parte de la foto a mostrar (la de las luces)
    desenfoque: 16,   // 0 = nítida · 16 = muy desenfocada (efecto luces de bar)
    brillo: 0.42,     // 0.3 = muy oscura · 1 = como es la foto original
    // Para usar la imagen de la calle de noche (cuando la tengas en la carpeta fotos):
    //   fondo: "fotos/fondo-noche.webp", fondoPos: "center", desenfoque: 2, brillo: 0.75,
  },

  fondoNoche: "",   // vacío = sin foto de noche: se usa el efecto nocturno sobre la foto de día
                    // (para volver a usar la foto real: "fotos/WhatsApp Image 2026-10-21 at 6.04.16 PM.jpeg")
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
  alfajores:  "fotos/whatsapp-image-2026-10-21-at-10.18.39-am-(2).webp",
  golosinas:  "fotos/WhatsApp Image 2026-10-21 at 10.33.24 AM.jpeg",   // exhibidor de golosinas
  vinos:      "fotos/WhatsApp Image 2026-10-21 at 10.36.46 AM.jpeg",   // vinos, espumantes y bebidas blancas
  noche:      "fotos/WhatsApp Image 2026-10-21 at 6.04.16 PM.jpeg",    // frente del local de noche, iluminado
};

/* ---------- BANNERS PUBLICITARIOS (carrusel en Inicio y en Promociones) ----------
   tema:     "azul" | "rojo" | "amarillo"
   boton:    texto del botón
   enlace:   "whatsapp" (abre WhatsApp con "mensaje") o una página: "#productos", "#galeria", "#horarios"
   img:      foto que acompaña (usá fotos reales del local o de productos)
   pos:      (opcional) qué parte de la foto mostrar: "center", "center top", "center 30%", etc.
   Para quitar un banner, borrá su bloque. Si la lista queda vacía, el carrusel no se muestra. */
const BANNERS = [
  {
    tema: "azul",
    etiqueta: "Atención directa",
    titulo: "¡Hacé tu pedido por WhatsApp!",
    texto: "Escribinos lo que necesitás y te respondemos al toque.",
    boton: "Escribinos",
    enlace: "whatsapp",
    mensaje: "¡Hola De Sol a Sol! ☀️ Quiero hacer un pedido.",
    img: "",   // sin foto: el banner se muestra solo con texto y los rayos de sol
  },
  {
    tema: "rojo",
    etiqueta: "Promo almacén",
    titulo: "¡Todo en un solo lugar!",
    texto: "Bebidas, golosinas y almacén a pocas cuadras de tu casa.",
    boton: "Ver productos",
    enlace: "#productos",
    img: FOTO.golosinas,
    pos: "center 40%",
  },
  {
    tema: "amarillo",
    etiqueta: "Solo por hoy",
    titulo: "Ofertas imperdibles",
    texto: "Preguntá por las ofertas del día antes de que se terminen.",
    boton: "Consultar ofertas",
    enlace: "whatsapp",
    mensaje: "¡Hola De Sol a Sol! ☀️ ¿Qué ofertas tienen hoy?",
    img: FOTO.alfajores,
    pos: "center 65%",
  },
];

/* ---------- QUÉ ENCONTRÁS (categorías de productos) ----------
   Guardá cada foto en fotos/productos/ con el nombre indicado.
   Foto ideal: HORIZONTAL (4:3), bien iluminada, 1600 px de ancho, en WEBP.
   Mientras falte una foto, en tu compu la tarjeta muestra el nombre de archivo
   que tenés que cargar. En la página publicada se ve un fondo neutro.
   Para quitar una categoría, borrá su línea. El orden acá es el orden en la página. */
const CATEGORIAS = [
  { nombre: "Bebidas frías",       desc: "Gaseosas, aguas y jugos bien fríos",        img: "fotos/productos/heladera-bebidas.webp" },
  { nombre: "Cervezas",            desc: "Las marcas que buscás, siempre heladas",    img: "fotos/productos/heladera-cervezas.webp" },
  { nombre: "Snacks",              desc: "Papas, palitos, maní y más",                img: "fotos/productos/snacks.webp" },
  { nombre: "Golosinas",           desc: "Chocolates, alfajores y caramelos",         img: FOTO.golosinas },
  { nombre: "Helados",             desc: "Palitos, bombones y potes",                 img: "fotos/productos/freezer-helados.webp" },
  { nombre: "Hielo",               desc: "Bolsas de hielo para tu evento",            img: "fotos/productos/hielo.webp" },
  { nombre: "Lácteos y fiambres",  desc: "Leche, yogur, quesos y fiambres",           img: "fotos/productos/heladera-lacteos.webp" },
  { nombre: "Almacén",             desc: "Fideos, arroz, aceite y enlatados",         img: "fotos/productos/almacen.webp" },
  { nombre: "Panificados",         desc: "Pan, galletitas y budines",                 img: "fotos/productos/panificados.webp" },
  { nombre: "Vinos y aperitivos",  desc: "Tintos, blancos, espumantes y aperitivos",  img: FOTO.vinos },
  { nombre: "Carbón y leña",       desc: "Todo para el asado",                        img: "fotos/productos/carbon.webp" },
  { nombre: "Limpieza e higiene",  desc: "Lo básico para tu casa",                    img: "fotos/productos/limpieza-higiene.webp" },
];

/* ---------- NUESTRO LOCAL (mosaico de 3 fotos) ----------
   La primera es la grande. Usá fotos reales del local.            */
const LOCAL_FOTOS = [
  { img: FOTO.entrada,  alt: "Entrada del minimarket De Sol a Sol" },
  { img: FOTO.vinos,    alt: "Góndola de vinos y bebidas" },
  { img: FOTO.golosinas, alt: "Exhibidor de golosinas" },
];

/* ---------- MARCAS (carrusel con logo + nombre) ---------- */
// Carrusel de dos filas con el LOGO de cada marca y su nombre debajo.
// Guardá cada logo en la carpeta fotos/marcas/ (WEBP, PNG transparente o SVG).
// Si un logo falta, se muestra solo el nombre en texto.
// Si una marca se repite (mismo nombre), en tu compu (localhost) aparece con la etiqueta
// "REPETIDO · ELIMINAR"; en la página publicada se oculta sola.
const MARCAS = [
  // ---- Gaseosas ----
  { nombre: "Coca-Cola",     logo: "fotos/marcas/images.webp" },
  { nombre: "Pepsi",         logo: "fotos/marcas/images-(17).webp" },
  { nombre: "Fanta",         logo: "fotos/marcas/images-(16).webp" },

  // ---- Cervezas ----
  { nombre: "Quilmes 1890",  logo: "fotos/marcas/images-(4).webp" },
  { nombre: "Heineken",      logo: "fotos/marcas/images-(5).webp" },
  { nombre: "Stella Artois", logo: "fotos/marcas/images-(7).webp" },
  { nombre: "Corona",        logo: "fotos/marcas/images-(10).webp" },
  { nombre: "Amstel",        logo: "fotos/marcas/images-(12).webp" },
  { nombre: "Imperial",      logo: "fotos/marcas/images-(8).webp" },
  { nombre: "Patagonia",     logo: "fotos/marcas/images-(6).webp" },
  { nombre: "Andes Origen",  logo: "fotos/marcas/images-(9).webp" },
  { nombre: "Isenbeck",      logo: "fotos/marcas/images-(11).webp" },
  { nombre: "Miller",        logo: "fotos/marcas/images-(13).webp" },

  // ---- Aperitivos y sidras ----
  { nombre: "Gancia",        logo: "fotos/marcas/images-(3).webp" },
  { nombre: "Secco",         logo: "fotos/marcas/images-(19).webp" },

  // ---- Golosinas ----
  { nombre: "Arcor",         logo: "fotos/marcas/images-(1).webp" },
  { nombre: "Mogul",         logo: "fotos/marcas/images-(2).webp" },
];

/* ---------- RESEÑAS ----------
   Copiá reseñas REALES (por ejemplo de tu perfil de Google Maps), con permiso.
   Mientras la lista esté vacía, la sección no se muestra.
   estrellas: de 1 a 5                                                    */
const RESENAS = [
  // { nombre: "María G.", estrellas: 5, texto: "Siempre abierto cuando lo necesito y muy buena atención.", fecha: "Octubre 2026" },
];
const RESENAS_LINK = ""; // link a tus reseñas de Google (opcional)

/* ---------- HISTORIAS (burbujas de arriba) ----------
   Cada historia puede tener varias fotos ("slides").
   Colores de afiche disponibles: "rojo", "amarillo", "azul"  */
const HISTORIAS = [
  {
    nombre: "El local",
    icono: "🏪",
    slides: [
      { img: FOTO.entrada,  titulo: "¡PASÁ,\nESTAMOS ABIERTOS!", texto: "Reimundo Reguera 957", color: "azul" },
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
];

/* ---------- FEED PUBLICITARIO (galería) ----------
   tipo: "sorteo" | "promo" | "combo" | "evento" | "local"  (se usa para los filtros)
   instagramPost: link a la publicación en Instagram (opcional).
                  Si lo dejás vacío, el botón abre tu perfil. */
const PUBLICACIONES = [
  // ---- Fotos reales ----
  { img: FOTO.golosinas, tipo: "promo", titulo: "Golosinas para todos los gustos", descripcion: "Hamlet, Cofler Block, Bon o Bon, Mogul, Cereal Mix y mucho más, para el antojo de cualquier hora.", color: "azul", instagramPost: "" },
  { img: FOTO.alfajores, tipo: "promo", titulo: "Alfajores", descripcion: "Cofler Block, Bon o Bon, Chocotorta, Minitorta y muchos más. Consultá disponibilidad por WhatsApp.", color: "azul", instagramPost: "" },
  { img: FOTO.vinos, tipo: "promo", titulo: "Vinos y espumantes", descripcion: "Malbec, espumantes, aperitivos y bebidas blancas para cada ocasión. Venta exclusiva a mayores de 18 años.", color: "azul", instagramPost: "" },
  { img: FOTO.entrada, tipo: "evento", titulo: "Mundial 2026", descripcion: "Pasá a buscar todo para ver los partidos: bebidas, picada y golosinas.", color: "azul", instagramPost: "" },

  // ---- Para agregar más: copiá una línea de arriba y cambiá la foto y los textos.
  //      Ejemplo:
  // { img: "fotos/combo-previa.webp", tipo: "combo", titulo: "Combo previa", descripcion: "Bebida, hielo y snacks.", color: "azul", instagramPost: "" },
];
