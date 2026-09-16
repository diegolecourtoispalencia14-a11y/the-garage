/**
 * Rental Fleet Data & Models for The Garage Bike Experts
 * Dedicated fleet separate from retail inventory with usage-based hour counters
 */

export interface RentalBike {
  id: string; // e.g. 'RENT-01'
  model: string;
  brand: string;
  category: 'MTB' | 'Gravel' | 'Ruta' | 'Urbana' | 'E-Bike';
  size: 'S' | 'M' | 'L' | 'XL';
  riderHeightRange: string; // e.g. '165 - 176 cm'
  serialNumber: string;
  dailyRate: number; // MXN per 24 hours
  weekendRate: number; // MXN for 3 days
  weeklyRate: number; // MXN for 7 days
  depositAmount: number; // MXN security deposit
  status: 'disponible' | 'en_renta' | 'reservada' | 'en_taller';
  image: string;
  features: string[];
  componentsSummary: string;
  hoursRentedTotal: number;
  hoursSinceLastService: number;
  maintenanceThresholdHours: number; // typically 40-50 hours
  lastServiceDate: string;
  publishedOnWeb?: boolean; // Whether unit is visible on /renta
  publicDescription?: string; // Optional custom marketing copy for the website
  currentRenter?: {
    contractId: string;
    clientName: string;
    clientPhone: string;
    hotel: string;
    returnExpected: string;
  };
}

export interface RentalContract {
  id: string;
  folio: string; // e.g. 'REN-8421'
  bikeId: string;
  bikeModel: string;
  clientName: string;
  clientPhone: string;
  clientIdDoc: string; // Passport / INE number
  deliveryType: 'tienda' | 'hotel';
  hotelOrAddress: string;
  startDate: string;
  endDate: string;
  days: number;
  rentalFee: number;
  depositFee: number;
  totalCharged: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'MercadoPago' | 'SPEI';
  depositStatus: 'retenido' | 'devuelto' | 'aplicado_a_danos';
  pedalPreference: 'Plataforma normal' | 'Shimano SPD MTB' | 'Look Keo / SPD-SL Ruta' | 'Trae pedales propios';
  accessoriesIncluded: {
    helmet: boolean;
    lock: boolean;
    repairKit: boolean;
    lights: boolean;
  };
  status: 'activa' | 'completada' | 'cancelada';
  hoursLogged: number;
  returnCondition?: string;
  createdAt: string;
  cashierName: string;
}

export const INITIAL_RENTAL_FLEET: RentalBike[] = [
  {
    id: 'RENT-01',
    model: 'Trek Marlin 5 Gen 3 MTB 29"',
    brand: 'Trek',
    category: 'MTB',
    size: 'M',
    riderHeightRange: '165 - 176 cm',
    serialNumber: 'WTU281G0482K',
    dailyRate: 450,
    weekendRate: 1100,
    weeklyRate: 2100,
    depositAmount: 1000,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
    features: ['Frenos Hidráulicos Tektro', 'Suspensión SR Suntour 100mm', 'Transmisión Shimano 1x9', 'Llantas Bontrager 29"'],
    componentsSummary: 'Cuadro aluminio Alpha Silver, cableado interno, monturas para portabultos.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-02',
    model: 'Trek Marlin 5 Gen 3 MTB 29"',
    brand: 'Trek',
    category: 'MTB',
    size: 'L',
    riderHeightRange: '177 - 188 cm',
    serialNumber: 'WTU281G0489L',
    dailyRate: 450,
    weekendRate: 1100,
    weeklyRate: 2100,
    depositAmount: 1000,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=900&q=80',
    features: ['Frenos Hidráulicos Tektro', 'Suspensión SR Suntour 100mm', 'Transmisión Shimano 1x9', 'Llantas Bontrager 29"'],
    componentsSummary: 'Talla grande para ciclistas altos. Revisión de frenos recién realizada.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-03',
    model: 'Basso Palta II Carbon Gravel',
    brand: 'Basso',
    category: 'Gravel',
    size: 'M',
    riderHeightRange: '170 - 180 cm',
    serialNumber: 'BAS2024PAL883',
    dailyRate: 950,
    weekendRate: 2400,
    weeklyRate: 4500,
    depositAmount: 2500,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80',
    features: ['Cuadro Carbono Toray T700', 'Grupo Shimano GRX 810 1x11', 'Frenos de Disco Hidráulico', 'Llantas Tubeless Maxxis 40c'],
    componentsSummary: 'Gravel italiana de alta gama para rodar carretera costera o brechas hacia cenotes.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-04',
    model: 'Specialized Allez E5 Sport Carretera',
    brand: 'Specialized',
    category: 'Ruta',
    size: 'M',
    riderHeightRange: '172 - 181 cm',
    serialNumber: 'WSBC019284719',
    dailyRate: 750,
    weekendRate: 1900,
    weeklyRate: 3600,
    depositAmount: 2000,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80',
    features: ['Horquilla de Carbono FACT', 'Grupo Shimano Tiagra 2x10', 'Frenos de Disco Mecánico Doble Pistón', 'Geometría Endurance'],
    componentsSummary: 'Bicicleta de ruta aerodinámica optimizada para fondo largo Playa del Carmen - Tulum.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-05',
    model: 'Electra Townie 7D Beach Cruiser',
    brand: 'Electra',
    category: 'Urbana',
    size: 'M',
    riderHeightRange: '155 - 180 cm (Unisex)',
    serialNumber: 'ELC7D2024091',
    dailyRate: 280,
    weekendRate: 700,
    weeklyRate: 1300,
    depositAmount: 500,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1501147830916-ce44a6359892?auto=format&fit=crop&w=900&q=80',
    features: ['Tecnología Flat Foot (pies al suelo)', 'Transmisión Shimano 7 Vel', 'Canastilla frontal tejida', 'Asiento ergonómico con resortes'],
    componentsSummary: 'Ideal para paseos relajados por la 5ta Avenida, ciclovías de Playacar y acceso a playas.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 60,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-06',
    model: 'Electra Townie 7D Beach Cruiser',
    brand: 'Electra',
    category: 'Urbana',
    size: 'L',
    riderHeightRange: '170 - 192 cm',
    serialNumber: 'ELC7D2024092',
    dailyRate: 280,
    weekendRate: 700,
    weeklyRate: 1300,
    depositAmount: 500,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80',
    features: ['Tecnología Flat Foot', 'Transmisión Shimano 7 Vel', 'Canastilla frontal reforzada', 'Pintura esmaltada anti-salitre'],
    componentsSummary: 'Unidad urbana para adultos. Equipada con timbre de campana y soporte para toalla de playa.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-07',
    model: 'Giant Talon 2 29er Hardtail',
    brand: 'Giant',
    category: 'MTB',
    size: 'S',
    riderHeightRange: '158 - 169 cm',
    serialNumber: 'GNT2024TAL209',
    dailyRate: 420,
    weekendRate: 1050,
    weeklyRate: 1950,
    depositAmount: 1000,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    features: ['Cuadro ALUXX-Grade', 'Frenos Tektro Hidráulicos', 'Suspensión Suntour XCM 80mm', 'Rodado 29" x 2.2"'],
    componentsSummary: 'Geometría ágil para senderos de montaña y aventura.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-01'
  },
  {
    id: 'RENT-08',
    model: 'Specialized Turbo Vado 4.0 E-Bike',
    brand: 'Specialized',
    category: 'E-Bike',
    size: 'M',
    riderHeightRange: '168 - 179 cm',
    serialNumber: 'TURBO-VAD-2024-001',
    dailyRate: 980,
    weekendRate: 2500,
    weeklyRate: 4800,
    depositAmount: 2500,
    status: 'disponible',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80',
    features: ['Motor Specialized 2.0 (70 Nm)', 'Batería 710 Wh (hasta 120 km)', 'Pantalla MasterMind con antirrobo', 'Luces LED delantera y trasera integradas'],
    componentsSummary: 'Asistencia al pedaleo suave y potente. Incluye cargador rápido original y candado inteligente.',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 60,
    lastServiceDate: '2026-09-01'
  }
];

export const INITIAL_RENTAL_CONTRACTS: RentalContract[] = [];
