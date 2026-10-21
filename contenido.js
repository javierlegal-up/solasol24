/* =========================================================
   📸 CONTENIDO DE LA PÁGINA — EDITA SOLO ESTE ARCHIVO
   ---------------------------------------------------------
   CÓMO SUBIR TUS FOTOS:
   1. Copia tu foto a la carpeta "fotos" (ej: fotos/sorteo-octubre.jpg)
   2. Escribe ese nombre en "img" (ej: img: "fotos/sorteo-octubre.jpg")
   3. Guarda y recarga la página.

   - Si la foto no existe todavía, se muestra un afiche de colores
     con el texto de "titulo" (así la página nunca se ve vacía).
   - Fotos recomendadas: cuadradas (1080x1080) para el feed y
     verticales (1080x1920) para las historias. JPG o WEBP.
   - Para quitar una publicación, borra su bloque { ... }.
   - El orden aquí es el orden en la página (la primera sale arriba).
   ========================================================= */

const NEGOCIO = {
  whatsapp: "",                       // ⚠️ Tu número con código de país, sin + ni espacios. Argentina: "549" + área + número. Ej: "5491112345678"
  instagram: "desolasol_minimarket",
  direccion: "Reimundo Reguera 957",
  mapa: "Reimundo Reguera 957, Argentina", // Agrega la ciudad para que el mapa sea exacto. Ej: "Reimundo Reguera 957, Ciudad, Argentina"
};

/* ---------- HISTORIAS (burbujas de arriba) ----------
   Cada historia puede tener varias fotos ("slides").
   Colores de afiche disponibles: "rojo", "amarillo", "azul"  */
const HISTORIAS = [
  {
    nombre: "Sorteos",
    icono: "🎁",
    slides: [
      { img: "fotos/historia-sorteo.jpg", titulo: "¡GRAN SORTEO!", texto: "Síguenos y participa en Instagram", color: "rojo" },
    ],
  },
  {
    nombre: "Ofertas",
    icono: "🔥",
    slides: [
      { img: "fotos/historia-oferta-1.jpg", titulo: "OFERTA DEL DÍA", texto: "Pregunta por WhatsApp", color: "amarillo" },
      { img: "fotos/historia-oferta-2.jpg", titulo: "BEBIDAS HELADAS", texto: "Siempre frías 🧊", color: "rojo" },
    ],
  },
  {
    nombre: "Horarios",
    icono: "⏰",
    slides: [
      { img: "fotos/historia-horarios.jpg", titulo: "LUN A JUE\n09:00 – 04:00", texto: "De corrido", color: "azul" },
      { img: "", titulo: "VIE · SÁB · DOM\n09:00 – ¡A MÁS!", texto: "🎉 Noches largas", color: "rojo" },
    ],
  },
  {
    nombre: "El local",
    icono: "🏪",
    slides: [
      { img: "fotos/WhatsApp Image 2026-10-21 at 10.18.39 AM.jpeg", titulo: "TODO EN UN\nSOLO LUGAR", texto: "Bebidas, golosinas y almacén", color: "azul" },
    ],
  },
  {
    nombre: "Alfajores",
    icono: "🍫",
    slides: [
      { img: "fotos/WhatsApp Image 2026-10-21 at 10.18.39 AM (2).jpeg", titulo: "¡DEJATE\nTENTAR!", texto: "Alfajores para todos los gustos", color: "amarillo" },
    ],
  },
  {
    nombre: "Ubicación",
    icono: "📍",
    slides: [
      { img: "", titulo: "REIMUNDO\nREGUERA 957", texto: "Te esperamos en el barrio", color: "azul" },
    ],
  },
];

/* ---------- FEED PUBLICITARIO (galería) ----------
   tipo: "sorteo" | "promo" | "combo" | "evento"  (se usa para los filtros)
   instagramPost: link a la publicación en Instagram (opcional).
                  Si lo dejas vacío, el botón abre tu perfil. */
const PUBLICACIONES = [
  // ---- Fotos reales ----
  { img: "fotos/WhatsApp Image 2026-10-21 at 10.18.39 AM (2).jpeg", tipo: "promo", titulo: "¡DEJATE TENTAR!", descripcion: "Alfajores para todos los gustos: Cofler Block, Bon o Bon, Chocotorta, Minitorta y muchos más. 🍫 ¡Consultá por WhatsApp!", color: "amarillo", instagramPost: "" },
  { img: "fotos/WhatsApp Image 2026-10-21 at 10.18.39 AM.jpeg", tipo: "local", titulo: "TODO EN UN SOLO LUGAR", descripcion: "Bebidas, vinos, golosinas, galletitas y almacén. Vení a visitarnos a Reimundo Reguera 957. ☀️", color: "azul", instagramPost: "" },

  // ---- Afiches de ejemplo (reemplazalos por tus fotos) ----
  { img: "fotos/post-1.jpg", tipo: "sorteo", titulo: "¡SORTEO DEL MES!", descripcion: "Sigue a @desolasol_minimarket, dale like y etiqueta a 2 amigos. ¡Puedes ganar!", color: "rojo", instagramPost: "" },
  { img: "fotos/post-2.jpg", tipo: "promo",  titulo: "BEBIDAS + HIELO", descripcion: "Todo bien helado para la previa del finde. 🧊🥤", color: "amarillo", instagramPost: "" },
  { img: "fotos/post-3.jpg", tipo: "combo",  titulo: "COMBO PREVIA", descripcion: "Bebida, hielo y snacks. Consulta el combo de hoy por WhatsApp.", color: "azul", instagramPost: "" },
  { img: "fotos/post-4.jpg", tipo: "evento", titulo: "FINDE ¡A MÁS!", descripcion: "Viernes, sábado y domingo atendemos desde las 09:00 ¡a más!", color: "rojo", instagramPost: "" },
  { img: "fotos/post-5.jpg", tipo: "promo",  titulo: "DESAYUNO DE BARRIO", descripcion: "Pan, leche y huevos desde las 09:00.", color: "amarillo", instagramPost: "" },
  { img: "fotos/post-6.jpg", tipo: "combo",  titulo: "ANTOJO DE MADRUGADA", descripcion: "Helado, chocolates y papas hasta las 04:00. 🌙", color: "azul", instagramPost: "" },
  { img: "fotos/post-7.jpg", tipo: "sorteo", titulo: "GANADOR/A 🏆", descripcion: "¡Felicidades al ganador del sorteo! Atento al próximo.", color: "amarillo", instagramPost: "" },
  { img: "fotos/post-8.jpg", tipo: "evento", titulo: "PARTIDO EN CASA", descripcion: "Día de partido: bebidas, cervezas (+18) y picoteo. ⚽", color: "rojo", instagramPost: "" },
  { img: "fotos/post-9.jpg", tipo: "promo",  titulo: "OFERTA DEL DÍA", descripcion: "Cada día algo distinto. Pregunta por WhatsApp. 🔥", color: "azul", instagramPost: "" },
];
