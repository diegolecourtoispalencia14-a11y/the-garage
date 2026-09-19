// src/data/allProducts.ts
// Catálogo Maestro Oficial The Garage — 15 Bicicletas Exclusivas (Venta & Renta)

export interface ProductItem {
  id: string;
  sku: string;
  slug?: string;
  name: string;
  brand: string;
  cat: string;
  price: number;
  stock: number;
  specs: string;
  talla?: string;
  color?: string;
  estado?: string;
  disciplina?: "mtb" | "gravel" | "ruta" | "urbano" | "taller" | "universal" | "infantil";
  suggestedIds?: string[];
  precioRenta?: number;
  modalidad?: string;
  fotos?: string[];
}

export const MASTER_PRODUCTS: ProductItem[] = [
  // ── 1. BICICLETAS (CATÁLOGO OFICIAL THE GARAGE) ──
  {
    id: "giant-tcr",
    sku: "GNT-TCR-M",
    slug: "giant-tcr",
    name: "Giant TCR Advanced Carbon",
    brand: "Giant",
    cat: "Ruta",
    price: 29900,
    stock: 1,
    talla: "M (54 cm)",
    color: "Azul Cobalto Brillante",
    estado: "Seminueva",
    disciplina: "ruta",
    specs: "Cuadro y poste de carbón, transmisión Shimano Tiagra 2x10 vel, manubrio y ruedas de aluminio. Pedales no incluidos.",
    fotos: [
      "/img/catalogo/giant-tcr-1.jpg",
      "/img/catalogo/giant-tcr-2.jpg"
    ],
    modalidad: "Venta",
    suggestedIds: ["giant-defy", "liv-avail", "specialized-crosstrail-r29"]
  },
  {
    id: "scott-r29",
    sku: "SCT-ASP-29S",
    slug: "scott-r29",
    name: "Scott Aspect R29 Deore 12V",
    brand: "Scott",
    cat: "MTB",
    price: 12800,
    precioRenta: 300,
    stock: 1,
    talla: "S",
    color: "Negro con vivos Naranja Amber",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro aluminio hidroformado, transmisión Shimano Deore 1x12 vel, frenos de disco hidráulicos, suspensión delantera hidráulica sin bloqueo.",
    fotos: [
      "/img/catalogo/scott-r29-1.jpg",
      "/img/catalogo/scott-r29-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["orbea-onna-r29", "giant-stance-r29", "trinx-r29"]
  },
  {
    id: "specialized-crosstrail-r29",
    sku: "SPZ-CROSS-M",
    slug: "specialized-crosstrail-r29",
    name: "Specialized Crosstrail 29 Disc",
    brand: "Specialized",
    cat: "Urbana",
    price: 7900,
    precioRenta: 300,
    stock: 1,
    talla: "M",
    color: "Negro Mate con vivos Amarillo Neón",
    estado: "Seminueva",
    disciplina: "urbano",
    specs: "Cuadro de aluminio A1 Premium, frenos de disco mecánicos, transmisión Shimano Altus 2x8 vel, llantas 700x38C mixtas.",
    fotos: [
      "/img/catalogo/specialized-crosstrail-r29-1.jpg",
      "/img/catalogo/specialized-crosstrail-r29-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["giant-defy", "scott-r29", "mercurio-ranger-r29"]
  },
  {
    id: "giant-defy",
    sku: "GNT-DEFY-M",
    slug: "giant-defy",
    name: "Giant Defy Aluxx Road",
    brand: "Giant",
    cat: "Ruta",
    price: 13500,
    precioRenta: 300,
    stock: 1,
    talla: "M",
    color: "Blanco Perla con detalles Plata",
    estado: "Seminueva",
    disciplina: "ruta",
    specs: "Cuadro de aluminio ALUXX y manillar integrado de carbón, transmisión Shimano 2x10 vel (palancas Tiagra, multi Ultegra, cambio 105).",
    fotos: [
      "/img/catalogo/giant-defy-1.jpg",
      "/img/catalogo/giant-defy-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["giant-tcr", "liv-avail", "specialized-crosstrail-r29"]
  },
  {
    id: "liv-avail",
    sku: "LIV-AVAIL-S",
    slug: "liv-avail",
    name: "Liv Avail Aluxx Road Mujer",
    brand: "Liv",
    cat: "Ruta",
    price: 9900,
    precioRenta: 300,
    stock: 1,
    talla: "S",
    color: "Blanco y Aqua",
    estado: "Seminueva",
    disciplina: "ruta",
    specs: "Bicicleta de aluminio con geometría femenina Liv 3F, transmisión Shimano Claris 2x8 vel, rines 700c.",
    fotos: [
      "/img/catalogo/liv-avail-1.jpg",
      "/img/catalogo/liv-avail-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["giant-defy", "giant-tcr", "specialized-crosstrail-r29"]
  },
  {
    id: "giant-stance-r29",
    sku: "GNT-STN-29S",
    slug: "giant-stance-r29",
    name: "Giant Stance 29 Doble Suspensión",
    brand: "Giant",
    cat: "MTB",
    price: 14500,
    precioRenta: 300,
    stock: 1,
    talla: "S",
    color: "Gris Titanio / Gunmetal",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Transmisión Shimano Deore 1x12 vel, suspensión RockShox hidráulica con bloqueo, frenos hidráulicos, llantas tubeless.",
    fotos: [
      "/img/catalogo/giant-stance-r29-1.jpg",
      "/img/catalogo/giant-stance-r29-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["trek-top-fuel-r29", "giant-stance-r27", "orbea-onna-r29"]
  },
  {
    id: "mercurio-ranger-r27",
    sku: "MER-RNG-27",
    slug: "mercurio-ranger-r27",
    name: "Mercurio Ranger 27.5 Sport",
    brand: "Mercurio",
    cat: "MTB",
    price: 2999,
    precioRenta: 300,
    stock: 1,
    talla: "M",
    color: "Negro Mate con Verde Lima",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro de aluminio hidroformado rodada 27.5, suspensión delantera, transmisión microSHIFT 3x7 vel, freno de disco delantero.",
    fotos: [
      "/img/catalogo/mercurio-ranger-r27-1.jpg",
      "/img/catalogo/mercurio-ranger-r27-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["mercurio-ranger-r29", "trinx-r29", "orbea-onna-r29"]
  },
  {
    id: "trek-top-fuel-r29",
    sku: "TRK-TF-29L",
    slug: "trek-top-fuel-r29",
    name: "Trek Top Fuel 29 Carbon Full Suspension",
    brand: "Trek",
    cat: "MTB",
    price: 44500,
    stock: 1,
    talla: "L",
    color: "Gris Titanio con acentos Rojo Escarlata",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro aluminio con manillar Bontrager de carbono, transmisión Shimano SLX/XT 12 vel, suspensión RockShox SID 120mm, shock trasero RockShox Deluxe Ultimate, frenos SRAM DB8.",
    fotos: [
      "/img/catalogo/trek-top-fuel-r29-1.jpg",
      "/img/catalogo/trek-top-fuel-r29-2.jpg"
    ],
    modalidad: "Venta",
    suggestedIds: ["giant-stance-r29", "orbea-onna-r29", "scott-r29"]
  },
  {
    id: "orbea-onna-r29",
    sku: "ORB-ONNA-29M",
    slug: "orbea-onna-r29",
    name: "Orbea Onna 29 Hardtail",
    brand: "Orbea",
    cat: "MTB",
    price: 13000,
    precioRenta: 300,
    stock: 1,
    talla: "M",
    color: "Terracota Metálico",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro aluminio hidroformado, suspensión de aire con bloqueo remoto, transmisión monoplato 1x12 vel Shimano Deore, frenos hidráulicos.",
    fotos: [
      "/img/catalogo/orbea-onna-r29-1.jpg",
      "/img/catalogo/orbea-onna-r29-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["scott-r29", "trinx-r29", "giant-stance-r29"]
  },
  {
    id: "mercurio-ranger-r29",
    sku: "MER-RNG-29M",
    slug: "mercurio-ranger-r29",
    name: "Mercurio Ranger 29 Sport",
    brand: "Mercurio",
    cat: "MTB",
    price: 3000,
    precioRenta: 300,
    stock: 1,
    talla: "M",
    color: "Rojo con Negro",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro de aluminio rodada 29, transmisión Shimano 3x7 vel, frenos mecánicos de disco, suspensión delantera.",
    fotos: [
      "/img/catalogo/mercurio-ranger-r29-1.jpg",
      "/img/catalogo/mercurio-ranger-r29-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["mercurio-ranger-r27", "trinx-r29", "scott-r29"]
  },
  {
    id: "giant-stance-r27",
    sku: "GNT-STN-27M",
    slug: "giant-stance-r27",
    name: "Giant Stance 27.5 Full Suspension",
    brand: "Giant",
    cat: "MTB",
    price: 15000,
    stock: 1,
    talla: "M",
    color: "Negro con acentos Rojo y Naranja",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro R27.5, transmisión Shimano Deore 1x10 vel, suspensión de aire con bloqueo, frenos de disco hidráulicos, llantas tubeless Maxxis.",
    fotos: [
      "/img/catalogo/giant-stance-r27-1.jpg",
      "/img/catalogo/giant-stance-r27-2.jpg"
    ],
    modalidad: "Venta",
    suggestedIds: ["giant-stance-r29", "trek-top-fuel-r29", "mercurio-ranger-r27"]
  },
  {
    id: "trinx-r29",
    sku: "TRX-QST-29S",
    slug: "trinx-r29",
    name: "Trinx Quest M100 R29",
    brand: "Trinx",
    cat: "MTB",
    price: 7800,
    precioRenta: 300,
    stock: 1,
    talla: "S",
    color: "Azul Petróleo con detalles Flúor",
    estado: "Seminueva",
    disciplina: "mtb",
    specs: "Cuadro aluminio 6061, frenos Shimano MT200 hidráulicos, transmisión Shimano 2x8 vel, suspensión hidráulica con bloqueo.",
    fotos: [
      "/img/catalogo/trinx-r29-1.jpg",
      "/img/catalogo/trinx-r29-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["scott-r29", "orbea-onna-r29", "mercurio-ranger-r29"]
  },
  {
    id: "gt-stomper-r24",
    sku: "GT-STMP-24",
    slug: "gt-stomper-r24",
    name: "GT Stomper 24 Infantil/Juvenil",
    brand: "GT",
    cat: "Infantil",
    price: 3900,
    precioRenta: 250,
    stock: 1,
    talla: "Juvenil",
    color: "Azul Celeste con Naranja Neón",
    estado: "Seminueva",
    disciplina: "infantil",
    specs: "Cuadro aluminio ligero GT LegitFit rodada 24, transmisión Shimano Altus 1x8 vel, frenos mecánicos.",
    fotos: [
      "/img/catalogo/gt-stomper-r24-1.jpg",
      "/img/catalogo/gt-stomper-r24-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["giant-talon-jr-r24", "specialized-riprock-r12"]
  },
  {
    id: "giant-talon-jr-r24",
    sku: "GNT-TLJR-24",
    slug: "giant-talon-jr-r24",
    name: "Giant Talon Jr 24 Infantil/Juvenil",
    brand: "Giant",
    cat: "Infantil",
    price: 6900,
    precioRenta: 250,
    stock: 1,
    talla: "Juvenil",
    color: "Azul Marino con Verde Lima",
    estado: "Seminueva",
    disciplina: "infantil",
    specs: "Cuadro aluminio ALUXX-Grade rodada 24, transmisión Shimano 1x7 vel, frenos de disco mecánicos, suspensión delantera.",
    fotos: [
      "/img/catalogo/giant-talon-jr-r24-1.jpg",
      "/img/catalogo/giant-talon-jr-r24-2.jpg"
    ],
    modalidad: "Las dos",
    suggestedIds: ["gt-stomper-r24", "specialized-riprock-r12"]
  },
  {
    id: "specialized-riprock-r12",
    sku: "SPZ-RIP-12",
    slug: "specialized-riprock-r12",
    name: "Specialized Riprock 12 Infantil",
    brand: "Specialized",
    cat: "Infantil",
    price: 3800,
    stock: 1,
    talla: "Infantil R12",
    color: "Rosa Fucsia con detalles Turquesa",
    estado: "Seminueva",
    disciplina: "infantil",
    specs: "Cuadro aluminio Specialized A1 Premium R12, freno contrapedal trasero, ruedas de equilibrio desmontables, canastilla tejida y timbre.",
    fotos: [
      "/img/catalogo/specialized-riprock-r12-1.jpg",
      "/img/catalogo/specialized-riprock-r12-2.jpg",
      "/img/catalogo/specialized-riprock-r12-3.jpg"
    ],
    modalidad: "Venta",
    suggestedIds: ["gt-stomper-r24", "giant-talon-jr-r24"]
  }
];

export function getAllProducts(): ProductItem[] {
  return MASTER_PRODUCTS;
}

export function getProductById(idOrSku: string): ProductItem | undefined {
  const clean = (idOrSku || "").toLowerCase();
  return MASTER_PRODUCTS.find(p =>
    p.id.toLowerCase() === clean ||
    p.sku.toLowerCase() === clean ||
    (p.slug && p.slug.toLowerCase() === clean) ||
    p.name.toLowerCase().includes(clean)
  );
}

export function getRelatedProducts(product: ProductItem, limit: number = 4): ProductItem[] {
  if (product.suggestedIds && product.suggestedIds.length) {
    const list = product.suggestedIds
      .map(id => MASTER_PRODUCTS.find(p => p.id === id || p.sku === id || p.slug === id))
      .filter((p): p is ProductItem => !!p && p.id !== product.id && p.sku !== product.sku);
    if (list.length >= 1) return list.slice(0, limit);
  }

  const sameCategory = MASTER_PRODUCTS.filter(p => p.id !== product.id && (p.disciplina === product.disciplina || p.cat === product.cat));
  const otherBikes = MASTER_PRODUCTS.filter(p => p.id !== product.id && p.disciplina !== product.disciplina);

  const pool = [...sameCategory, ...otherBikes];
  const unique = Array.from(new Set(pool));
  return unique.slice(0, limit);
}
