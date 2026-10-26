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
  // CARTEL DE NEÓN: se muestra como primer anuncio del banner (ver BANNERS, tema "neon").
  // linea1 (azul): cuando el local está cerrado cambia sola a "CERRADO" con el neón apagado.
  // linea2 (rosa): frase fija.
  // destacado (rosa grande): "24/7". Para quitarlo, dejalo vacío: destacado: ""
  // fondo: foto que se muestra DESENFOCADA detrás del cartel (efecto luces de bar).
  //        Si la dejás vacía, se usa la pared de ladrillo.
  neon: {
    activo: true,
    linea1: "ABIERTO",
    destacado: "24/7",
    linea2: "DE SOL A SOL",
    fondo: "",        // sin foto: el anuncio del cartel usa un fondo nocturno de neón dibujado en código
                      // (antes: "fotos/WhatsApp Image 2026-10-21 at 10.36.46 AM.jpeg")
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
  vinos:      "fotos/WhatsApp Image 2026-10-25 at 1.02.14 PM.jpeg",    // estante de vinos: Colón dulce fresco, tintos y blancos (foto nueva)
  noche:      "fotos/WhatsApp Image 2026-10-21 at 6.04.16 PM.jpeg",    // frente del local de noche, iluminado
  helados:    "fotos/WhatsApp Image 2026-10-25 at 1.01.59 PM.jpeg",    // freezer: Cofler Block, Rocklets, Bon o Bon (foto nueva)
  aperitivos: "fotos/WhatsApp Image 2026-10-25 at 1.02.04 PM.jpeg",    // vodka Smirnoff y Skyy Infusions (foto nueva)
  cervezas:   "fotos/whatsapp-image-2026-10-22-at-10.44.38-am.webp",     // latas Stella, Brahma, Budweiser, Quilmes
  heladera:   "fotos/whatsapp-image-2026-10-22-at-10.44.38-am-(1).webp", // 1890, Heineken, Imperial, Red Bull, Smirnoff Ice
  drlemon:    "fotos/whatsapp-image-2026-10-22-at-10.44.38-am-(2).webp", // tragos listos Dr. Lemon
  salon:      "fotos/whatsapp-image-2026-10-22-at-10.44.37-am.webp",     // interior completo del local
  almacen:    "fotos/whatsapp-image-2026-10-22-at-10.44.37-am-(1).webp", // góndola de almacén
  gaseosas:   "fotos/whatsapp-image-2026-10-22-at-10.44.37-am-(2).webp", // heladera Coca-Cola: Coca, Sprite, Fanta
  vinosDulces:"fotos/WhatsApp Image 2026-10-25 at 1.02.14 PM.jpeg",    // vinos dulces Colón (durazno, frutos rojos) (foto nueva)
  snacks:     "fotos/WhatsApp Image 2026-10-23 at 7.22.31 AM.jpeg", // exhibidor real: Lay's, Doritos, Cheetos, 3D, Twistos
  limpieza:   "fotos/WhatsApp Image 2026-10-26 at 1.39.43 PM.jpeg",    // Felpita, Glade, Selton, Ayudín, Poett, Zorro (foto nueva)
  brahma:     "fotos/images-(3).webp",   // Brahma Chopp de litro
  // (la foto del estante de cigarrillos NO se usa: la ley argentina prohíbe la publicidad de tabaco)
  sorteoFutbol:  "fotos/whatsapp-image-2026-10-22-at-9.15.21-am.webp",      // captura de Instagram (se recorta)
  sorteoBebidas: "fotos/whatsapp-image-2026-10-22-at-9.15.21-am-(1).webp",  // captura de Instagram (se recorta)
};

/* ---------- BANNERS PUBLICITARIOS (carrusel en Inicio y en Promociones) ----------
   tema:     "azul" | "rojo" | "amarillo" | "evento" (violeta con burbujas) | "neon" (cartel 24/7)
   boton:    texto del botón
   enlace:   "whatsapp" (abre WhatsApp con "mensaje") o una página: "#productos", "#galeria", "#horarios"
   img:      foto que acompaña (usá fotos reales del local o de productos)
   pos:      (opcional) qué parte de la foto mostrar: "center", "center top", "center 30%", etc.
   Para quitar un banner, borrá su bloque. Si la lista queda vacía, el carrusel no se muestra. */
const BANNERS = [
  {
    // Cartel de neón ABIERTO · 24/7 · DE SOL A SOL (textos en NEGOCIO.neon).
    // Cuando el local está cerrado dice "CERRADO" con los tubos apagados.
    tema: "neon",
    boton: "Escribinos por WhatsApp",
    enlace: "whatsapp",
    mensaje: "¡Hola De Sol a Sol! ☀️ ¿Están abiertos?",
  },
  {
    // Servicio de bebidas a consignación (el mismo del cartel que aparece al entrar)
    tema: "evento",   // fondo violeta de fiesta con burbujas
    etiqueta: "Nuevo servicio · Eventos",
    titulo: "Bebidas a consignación para tu evento",
    texto: "Llevate todo lo que necesites. Solo pagás lo que consumas y devolvés lo que te sobre.",
    pasos: ["Nos escribís", "Te llevás las bebidas", "Devolvés lo que sobra"],
    boton: "Consultar por WhatsApp",
    enlace: "whatsapp",
    mensaje: "¡Hola De Sol a Sol! ☀️ Quiero consultar por el servicio de bebidas a consignación para un evento 🎉\n📅 Fecha: \n👥 Cantidad de personas: ",
    img: "",   // sin foto: texto centrado con rayos de sol
  },
  {
    tema: "rojo",
    etiqueta: "Promo almacén",
    titulo: "¡Todo en un solo lugar!",
    texto: "Bebidas, golosinas y almacén a pocas cuadras de tu casa.",
    boton: "Ver productos",
    enlace: "#productos",
    img: FOTO.salon,
    pos: "center 60%",
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
  {
    // Mensaje de buena onda para cerrar el carrusel (sin foto).
    // Cambia solo según la hora: colores de día (sol) o de noche (luna y estrellas).
    tema: "mensaje",
    manana: { titulo: "¡Buen día!",      texto: "Gracias por elegirnos. Arrancá el día con todo: te esperamos con la mejor onda." },
    tarde:  { titulo: "¡Buenas tardes!", texto: "Gracias por elegirnos. Pasá cuando quieras, siempre te atendemos con una sonrisa." },
    noche:  { titulo: "¡Buenas noches!", texto: "Gracias por elegirnos. Seguimos abiertos para vos, con la mejor onda. ¡Que tengas una linda noche!" },
  },
];

/* ---------- QUÉ ENCONTRÁS (categorías de productos) ----------
   Guardá cada foto en fotos/productos/ con el nombre indicado.
   Foto ideal: HORIZONTAL (4:3), bien iluminada, 1600 px de ancho, en WEBP.
   Mientras falte una foto, en tu compu la tarjeta muestra el nombre de archivo
   que tenés que cargar. En la página publicada se ve un fondo neutro.
   Para quitar una categoría, borrá su línea. El orden acá es el orden en la página. */
// Cuántas categorías se ven al entrar a "Productos" (el resto aparece con "Ver más")
const CATEGORIAS_INICIALES = 4;

const CATEGORIAS = [
  // Las 4 primeras son las que se ven al entrar (el resto aparece con "Ver más")
  { nombre: "Bebidas frías",       desc: "Coca-Cola, Sprite, Fanta y más, bien frías", img: FOTO.gaseosas, pos: "center 62%" },
  { nombre: "Cervezas",            desc: "Las marcas que buscás, siempre heladas",    img: FOTO.cervezas, pos: "center 55%" },
  { nombre: "Snacks",              desc: "Lay's, Doritos, Cheetos, 3D, Twistos y más", img: FOTO.snacks, pos: "center 35%" },
  { nombre: "Golosinas",           desc: "Chocolates, alfajores y caramelos",         img: FOTO.golosinas },
  { nombre: "Vinos y aperitivos",  desc: "Tintos, blancos, dulces y aperitivos",      img: FOTO.vinosDulces, pos: "center 40%" },
  { nombre: "Helados",             desc: "Palitos, bombones y potes",                 img: FOTO.helados },
  { nombre: "Almacén",             desc: "Yerba, condimentos, aceite y vinagre",      img: FOTO.almacen, pos: "center 62%" },
  { nombre: "Limpieza e higiene",  desc: "Lavandina, limpiadores, rollos de cocina, insecticida y aromatizantes", img: FOTO.limpieza, pos: "center 55%" },
  // PRÓXIMAMENTE (cuando lo tengan, borrá las dos barras "//" del comienzo de la línea):
  // { nombre: "Lácteos y fiambres",  desc: "Leche, yogur, quesos y fiambres",           img: "fotos/productos/heladera-lacteos.webp" },
];

/* ---------- TAMBIÉN EN EL LOCAL (solo texto, debajo de las categorías) ----------
   Para productos o servicios que se mencionan sin foto ni botón.
   Cigarrillos: solo mención informativa, sin marcas ni fotos (Ley 26.687 de control de tabaco). */
// icono: "mas18" (insignia +18) · "celular" · "local"
const TAMBIEN_EN_EL_LOCAL = [
  { texto: "Cigarrillos", nota: "Venta solo a mayores de 18 años", icono: "mas18" },
];
const AVISO_TABACO = "Prohibida la venta de productos de tabaco a menores de 18 años. Fumar es perjudicial para la salud.";

/* ---------- NUESTRO LOCAL (mosaico de 3 fotos) ----------
   La primera es la grande. Usá fotos reales del local.            */
const LOCAL_FOTOS = [
  { img: FOTO.salon,    alt: "Interior del minimarket De Sol a Sol con heladeras y góndolas" },
  { img: FOTO.entrada,  alt: "Entrada del minimarket De Sol a Sol" },
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
// Cuántas publicaciones se ven al entrar a "Promociones" (el resto aparece con "Ver más")
// compu: 6 (dos filas de 3) · celular: 5 (una destacada + dos filas de 2)
const PUBLICACIONES_INICIALES = { compu: 6, celular: 5 };

const PUBLICACIONES = [
  // ---- Sorteos reales (capturas de Instagram RECORTADAS: se muestra solo el afiche) ----
  // recorte: cuánto se recorta de cada borde (en %) y la proporción del afiche que queda.
  {
    img: FOTO.sorteoFutbol, tipo: "sorteo",
    titulo: "Sorteo: Fútbol de salón",
    descripcion: "Sorteamos 3 entradas para compartir la Super Liga SR. ¡Gracias a todos los que participaron! Seguinos en Instagram para no perderte el próximo sorteo.",
    recorte: { arriba: 19.3, abajo: 28.5, izquierda: 0, derecha: 0, proporcion: 0.88 },
    color: "azul", instagramPost: "",
  },
  {
    img: FOTO.sorteoBebidas, tipo: "sorteo",
    titulo: "Sorteo de bebidas para celebrar",
    descripcion: "Sorteamos vodka, energizante y un pack de cerveza para festejar entre amigos. Seguinos en Instagram y enterate del próximo sorteo. Solo para mayores de 18 años.",
    recorte: { arriba: 19.7, abajo: 37.6, izquierda: 14, derecha: 11.6, proporcion: 0.8 },
    color: "azul", instagramPost: "",
  },

  // ---- Fotos reales ----
  { img: FOTO.golosinas, tipo: "promo", titulo: "Golosinas para todos los gustos", descripcion: "Hamlet, Cofler Block, Bon o Bon, Mogul, Cereal Mix y mucho más, para el antojo de cualquier hora.", color: "azul", instagramPost: "" },
  { img: FOTO.alfajores, tipo: "promo", titulo: "Alfajores", descripcion: "Cofler Block, Bon o Bon, Chocotorta, Minitorta y muchos más. Consultá disponibilidad por WhatsApp.", color: "azul", instagramPost: "" },
  { img: FOTO.heladera, tipo: "promo", titulo: "Cervezas y energizantes bien fríos", descripcion: "Quilmes 1890, Heineken, Imperial, Michelob, Red Bull, Smirnoff Ice y más, listos en la heladera. Venta de alcohol solo a mayores de 18 años.", color: "azul", instagramPost: "" },
  { img: FOTO.brahma, tipo: "promo", titulo: "Brahma Chopp de litro", descripcion: "La Brahma de litro, bien helada y lista para compartir. Venta exclusiva a mayores de 18 años.", color: "azul", instagramPost: "" },
  { img: FOTO.vinosDulces, tipo: "promo", titulo: "Vinos dulces y frescos", descripcion: "Colón Selecto dulce fresco de durazno y frutos rojos, además de tintos, blancos y espumantes para cada ocasión. Venta exclusiva a mayores de 18 años.", color: "azul", instagramPost: "" },
  { img: FOTO.gaseosas, tipo: "promo", titulo: "Gaseosas bien frías", descripcion: "Coca-Cola, Sprite, Fanta y más, en distintos tamaños y siempre en la heladera.", color: "azul", instagramPost: "" },
  { img: FOTO.drlemon, tipo: "promo", titulo: "Tragos listos Dr. Lemon", descripcion: "Pomelo, limón, gin tonic, tropical gin y más sabores, bien fríos para tu juntada. Venta exclusiva a mayores de 18 años.", color: "azul", instagramPost: "" },
  { img: FOTO.aperitivos, tipo: "promo", titulo: "Vodkas saborizados", descripcion: "Skyy Infusions (Pineapple, Jungle y más) y Smirnoff en todos sus sabores para tu previa. También fernet y aperitivos. Venta exclusiva a mayores de 18 años.", color: "azul", instagramPost: "" },
  { img: FOTO.helados, tipo: "promo", titulo: "Helados", descripcion: "Cofler Block, Rocklets, Bon o Bon, potes y palitos para el calor. Consultá sabores por WhatsApp.", color: "azul", instagramPost: "" },
  { img: FOTO.entrada, tipo: "evento", titulo: "Mundial 2026", descripcion: "Pasá a buscar todo para ver los partidos: bebidas, picada y golosinas.", color: "azul", instagramPost: "" },

  // ---- Para agregar más: copiá una línea de arriba y cambiá la foto y los textos.
  //      Ejemplo:
  // { img: "fotos/combo-previa.webp", tipo: "combo", titulo: "Combo previa", descripcion: "Bebida y snacks.", color: "azul", instagramPost: "" },
];
