// src/data/googleProfileConfig.ts
// Configuración oficial de Google Business Profile & Google Maps para The Garage

export interface GoogleBusinessProfile {
  businessName: string;
  legalName: string;
  brandTagline: string;
  accountEmail: string;
  verifiedPhone: string;
  websiteUrl: string;
  addressFormatted: string;
  googlePlaceId: string;
  googleCid: string;
  reviewShortlink: string;
  googleMapsDirectUrl: string;
  googleKnowledgeSearchUrl: string;
  serviceAreaType: "StoreAndServiceArea";
  primaryCategory: string;
  secondaryCategories: string[];
  serviceAreas: string[];
  verificationStatus: "in_progress" | "verified";
  rating: {
    average: number;
    count: number;
    bestRating: number;
  };
  operatingHours: Record<string, string>;
  seoKeywords: string[];
}

export const GOOGLE_PROFILE_CONFIG: GoogleBusinessProfile = {
  businessName: "The Garage Bike Experts",
  legalName: "The Garage Bike Experts Playa del Carmen",
  brandTagline: "Taller de Precisión & Boutique de Ciclismo en la Riviera Maya",
  accountEmail: "diego.lecourtoispalencia14@gmail.com",
  verifiedPhone: "+52 984 138 1493",
  websiteUrl: "https://the-garage-dw4.pages.dev",
  addressFormatted: "Av. Ich Xeel, Cataluña, 77725 Playa del Carmen, Q.R.",
  googlePlaceId: "thegarage-pdc-cataluna",
  googleCid: "12984920491823901928",
  // Google Maps direct query URL: opens the business location in Google Maps reliably
  googleMapsDirectUrl: "https://www.google.com/maps/search/?api=1&query=The+Garage+Bike+Experts+Av+Ich+Xeel+Catalu%C3%B1a+Playa+del+Carmen",
  reviewShortlink: "https://www.google.com/maps/search/?api=1&query=The+Garage+Bike+Experts+Av+Ich+Xeel+Catalu%C3%B1a+Playa+del+Carmen",
  googleKnowledgeSearchUrl: "https://www.google.com/search?q=The+Garage+Bike+Experts+Playa+del+Carmen",
  serviceAreaType: "StoreAndServiceArea",
  primaryCategory: "Tienda de bicicletas",
  secondaryCategories: [
    "Taller de reparación de bicicletas",
    "Distribuidor de componentes ciclistas",
    "Boutique de indumentaria y nutrición deportiva"
  ],
  serviceAreas: [
    "Playa del Carmen (Cataluña, Centro, Playacar, Ejidal, Gonzalo Guerrero)",
    "Puerto Aventuras",
    "Tulum (Centro, Aldea Zama, La Veleta)",
    "Puerto Morelos",
    "Cancún (Zona Sur, Huayacán)"
  ],
  verificationStatus: "in_progress",
  rating: {
    average: 5.0,
    count: 38,
    bestRating: 5.0
  },
  operatingHours: {
    "Lunes a Sábado": "09:00 - 19:00",
    "Viernes": "09:00 - 18:00 (Rodada The Garage Ride en la tarde)",
    "Domingo": "Cerrado"
  },
  seoKeywords: [
    "tienda de bicicletas playa del carmen",
    "taller de bicicletas playa del carmen",
    "reparacion de bicicletas riviera maya",
    "basso bikes mexico",
    "mantenimiento shimano sram playa del carmen",
    "comprar bicicleta playa del carmen",
    "nutricion wayfar caribe",
    "rodadas playa del carmen the garage"
  ]
};

export function buildGoogleReviewWhatsAppMsg(clientName = '', bikeOrService = '', customLink?: string) {
  const greeting = clientName ? '¡Hola ' + clientName + '!' : '¡Hola!';
  const serviceDetail = bikeOrService ? ' con tu ' + bikeOrService : '';
  const link = customLink || GOOGLE_PROFILE_CONFIG.reviewShortlink;
  const text = greeting + ' Muchas gracias por confiar en The Garage' + serviceDetail + '.\n\n' +
    '¿Nos apoyarías con 1 minuto dejando tu calificación de 5 estrellas en nuestro perfil de Google? ⭐⭐⭐⭐⭐\n\n' +
    'Tu reseña nos ayuda enormemente a que más ciclistas de la Riviera Maya nos conozcan y confíen en el taller:\n' +
    link + '\n\n' +
    '¡Buenas rodadas y nos vemos el viernes!';

  return 'https://wa.me/529841381493?text=' + encodeURIComponent(text);
}
