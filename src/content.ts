/** Todo el texto de la página vive aquí. Los componentes no llevan texto suelto. */
import imagenes from './datos/imagenes.json';
import sondasDatos from './datos/sondas.json';

const base = import.meta.env.BASE_URL;
export const IMG = imagenes;
export const SONDAS = sondasDatos;
export const escalaUrl = (id: string) => `${base}escala/${id}.webp`;
export const pilarUrl = (id: string) => `${base}pilares/${id}.webp`;
export const sondaUrl = (id: string) => `${base}sondas/${id}.webp`;

export const C = 299_792.458; // km/s
export const UA = 149_597_870.7; // km

export const portada = {
  antetitulo: 'Atlas espacial · fotos de la NASA y de Webb',
  titulo: 'Potencias de diez',
  bajada: 'Siete fotos, de una persona flotando junto a la Tierra a la luz más vieja que hemos visto. Desliza y aléjate.',
  invitacion: 'Desliza para alejarte',
  escala: 'Lo que ves mide',
  luz: 'La luz lo cruza en',
  etiqueta: 'Zoom hacia fuera en siete fotos: un astronauta, la Estación Espacial, la Tierra, la Tierra y la Luna, la Tierra vista desde Voyager 1, una ilustración de la Vía Láctea y el campo profundo de Webb',
};

/** Etapas del zoom. exp = log10 del ancho aproximado de lo que se ve, en metros. */
export const etapas: {id: string; exp: number; medida: string; luz: string; titulo: string; texto: string; aqui?: string; marca?: number[]}[] = [
  {
    id: 'astronauta',
    exp: 1,
    medida: '10 metros',
    luz: '33 nanosegundos',
    titulo: 'Una persona',
    texto: 'Bruce McCandless, el 7 de febrero de 1984: el primer paseo espacial sin cable. Con una mochila de propulsión se alejó casi 100 metros del transbordador Challenger.',
  },
  {
    id: 'iss',
    exp: 2,
    medida: '100 metros',
    luz: '0,36 microsegundos',
    titulo: 'Una casa en órbita',
    texto: 'La Estación Espacial Internacional mide 109 metros de punta a punta, casi un campo de fútbol americano, y da una vuelta a la Tierra cada 90 minutos. Foto de la tripulación del Atlantis, mayo de 2010.',
  },
  {
    id: 'tierra',
    exp: 7.1,
    medida: '12.742 km',
    luz: '0,04 segundos',
    titulo: 'Un planeta',
    texto: 'La Tierra entera, fotografiada por la tripulación del Apolo 17 el 7 de diciembre de 1972, de camino a la Luna, a unos 29.000 km.',
  },
  {
    id: 'tierraluna',
    exp: 8.6,
    medida: '384.400 km',
    luz: '1,3 segundos',
    titulo: 'Un planeta y su luna',
    texto: 'La sonda Galileo, el 16 de diciembre de 1992, a 6,2 millones de kilómetros: la Tierra y la Luna en la misma foto. Entre las dos caben treinta Tierras en fila.',
  },
  {
    id: 'puntoazul',
    exp: 12.8,
    medida: '6.000 millones de km',
    luz: '5 horas y media',
    titulo: 'Un punto azul pálido',
    texto: 'El 14 de febrero de 1990, Voyager 1 se dio la vuelta y fotografió la Tierra desde 6.000 millones de km: menos de un píxel dentro de un rayo de luz del Sol. Está en el círculo.',
    aqui: 'La Tierra',
    marca: [0.5945, 0.5195],
  },
  {
    id: 'vialactea',
    exp: 21,
    medida: '100.000 años luz',
    luz: '100.000 años',
    titulo: 'Una galaxia',
    texto: 'Nadie ha visto nuestra galaxia desde fuera: esto es una ilustración hecha con datos del telescopio Spitzer. El Sol está a unos 26.000 años luz del centro, en el círculo.',
    aqui: 'Estás aquí',
    marca: [0.5, 0.69],
  },
  {
    id: 'campoprofundo',
    exp: 26,
    medida: 'Miles de millones de años luz',
    luz: 'más de 13.000 millones de años',
    titulo: 'Miles de galaxias',
    texto: 'El primer campo profundo de Webb, julio de 2022: un trozo de cielo del tamaño de un grano de arena sostenido con el brazo extendido. Casi cada punto es una galaxia, y la luz de algunas salió hace más de 13.000 millones de años.',
  },
];

export const intro = {
  antetitulo: 'Qué es esto',
  titulo: 'Fotos que pagamos entre todos',
  cuerpo: [
    'Las imágenes de la NASA son de dominio público: las pagan los contribuyentes de EE. UU. y cualquiera puede usarlas. Las de Webb y Hubble que publica ESA llevan licencia CC BY 4.0, que solo pide citar.',
    'Todas las de esta página son fotos reales salvo una, la Vía Láctea, que es una ilustración: desde dentro de la galaxia no hay forma de fotografiarla entera.',
  ],
  cifras: [
    {valor: '10²⁵', texto: 'veces más ancho: de la primera foto a la última'},
    {valor: '7', texto: 'fotos, de 1972 a 2022'},
    {valor: '1', texto: 'ilustración, avisada'},
  ],
};

export const pilares = {
  antetitulo: 'El mismo sitio, dos telescopios',
  titulo: 'Los Pilares de la Creación',
  cuerpo: 'Columnas de gas y polvo de la nebulosa del Águila, a unos 6.500 años luz, donde están naciendo estrellas. Desliza: Hubble a la izquierda, Webb a la derecha.',
  hubble: {nombre: 'Hubble · 2014', texto: 'Luz visible. El polvo tapa casi todo lo que hay dentro.'},
  webb: {nombre: 'Webb · 2022', texto: 'Infrarrojo cercano. El polvo se vuelve transparente y aparecen miles de estrellas, algunas recién encendidas en los bordes de los pilares.'},
  pie: 'Las esquinas negras de la imagen de Webb quedan fuera de su campo de visión.',
  regla: {
    titulo: 'Qué luz ve cada uno',
    visible: 'Lo que ve el ojo',
    hubble: 'Hubble (esta foto)',
    webb: 'Webb NIRCam',
    unidad: 'micras',
  },
  rango: 'Mover el corte entre Hubble y Webb',
};

export const sondas = {
  antetitulo: 'Las que siguen en camino',
  titulo: 'Cinco naves saliendo del sistema solar',
  cuerpo: 'Sus distancias al Sol se calculan en vivo con los datos de JPL Horizons del 16 de noviembre de 2026. La regla es logarítmica: cada marca es diez veces más lejos que la anterior.',
  hito: 'El 18 de noviembre de 2026, Voyager 1 llega a un día luz de la Tierra: la primera cosa hecha por personas que se aleja tanto.',
  luz: 'luz desde el Sol',
  kms: 'km/s',
  lista: [
    {
      id: 'voyager1',
      nombre: 'Voyager 1',
      lanzada: 'Lanzada el 5 de septiembre de 1977',
      estado: 'Salió de la heliosfera en agosto de 2012. Sigue enviando datos con dos instrumentos.',
      vivo: true,
    },
    {
      id: 'voyager2',
      nombre: 'Voyager 2',
      lanzada: 'Lanzada el 20 de agosto de 1977',
      estado: 'La única que ha visitado Urano y Neptuno. Salió de la heliosfera en noviembre de 2018 y sigue enviando datos.',
      vivo: true,
    },
    {
      id: 'pioneer10',
      nombre: 'Pioneer 10',
      lanzada: 'Lanzada el 3 de marzo de 1972',
      estado: 'La primera en cruzar el cinturón de asteroides y pasar junto a Júpiter. Su última señal llegó en enero de 2003.',
      vivo: false,
    },
    {
      id: 'pioneer11',
      nombre: 'Pioneer 11',
      lanzada: 'Lanzada el 6 de abril de 1973',
      estado: 'La primera que visitó Saturno. Calló en septiembre de 1995.',
      vivo: false,
    },
    {
      id: 'newhorizons',
      nombre: 'New Horizons',
      lanzada: 'Lanzada el 19 de enero de 2006',
      estado: 'Pasó junto a Plutón en julio de 2015 y junto a Arrokoth el 1 de enero de 2019.',
      vivo: true,
    },
  ],
  silencio: 'sin contacto',
  marcas: [
    {ua: 1, nombre: 'Tierra'},
    {ua: 5.2, nombre: 'Júpiter'},
    {ua: 9.5, nombre: 'Saturno'},
    {ua: 30, nombre: 'Neptuno'},
    {ua: 120, nombre: 'Heliopausa'},
    {ua: 2000, nombre: 'Nube de Oort (borde interior, estimado)'},
  ],
  oort: 'A su velocidad, Voyager 1 tardará unos 300 años en llegar al borde interior de la nube de Oort y unos 30.000 en atravesarla.',
  ua: 'UA',
  uaExplica: '1 UA = la distancia de la Tierra al Sol, unos 150 millones de km',
};

export const creditos = {
  antetitulo: 'Fuentes',
  titulo: 'Cómo está hecha',
  cuerpo:
    'Imágenes de Wikimedia Commons, reducidas y convertidas a WebP. Las de la NASA son de dominio público; la comparación de los Pilares es de NASA, ESA, CSA y STScI bajo licencia CC BY 4.0. Distancias y velocidades de las sondas: JPL Horizons (NASA/JPL). Ninguna agencia patrocina ni revisa esta página.',
  licencia: (l: string) => (l === 'Public domain' ? 'Dominio público' : l),
  fuentes: [
    {texto: 'JPL Horizons', url: 'https://ssd.jpl.nasa.gov/horizons/'},
    {texto: 'Dónde están las Voyager (NASA)', url: 'https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/'},
    {texto: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/deed.es'},
    {texto: 'Instrument Serif e Instrument Sans (SIL OFL)', url: 'https://fonts.google.com/'},
  ],
  volver: 'Volver arriba',
  wordmark: 'Atlas espacial',
  firma: 'Textos y código hechos con IA (Claude) y revisados, como pieza de portfolio.',
};
