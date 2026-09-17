/**
 * Rental Fleet Data & Models for The Garage Bike Experts
 * Dedicated fleet separate from retail inventory with usage-based hour counters
 */

export interface RentalBike {
  id: string; // e.g. 'RENT-01'
  model: string;
  brand: string;
  category: 'MTB' | 'Gravel' | 'Ruta' | 'Urbana' | 'E-Bike' | 'Infantil';
  size: 'S' | 'M' | 'L' | 'XL' | 'Juvenil';
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
  forSale?: boolean; // Si también está en venta
  salePrice?: number; // Precio de venta en MXN
  saleSlug?: string; // Slug a su página de venta en /bici/[id]
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
    model: 'Specialized Crosstrail R29',
    brand: 'Specialized',
    category: 'Urbana',
    size: 'M',
    riderHeightRange: '168 - 178 cm',
    serialNumber: 'TG-SPZ-CR01',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/specialized-crosstrail-r29-1.jpg',
    features: ['Transmisión Shimano Altus 2x8', 'Frenos de Disco', 'Rodada 29" Híbrida', 'Cuadro de Aluminio A1'],
    componentsSummary: 'Bicicleta híbrida y urbana de aluminio con transmisión Shimano Altus 2x8 vel. Ideal para rodar por Playa del Carmen.',
    forSale: true,
    salePrice: 7900,
    saleSlug: 'specialized-crosstrail-r29',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-02',
    model: 'Giant Defy Endurance Road',
    brand: 'Giant',
    category: 'Ruta',
    size: 'M',
    riderHeightRange: '170 - 180 cm',
    serialNumber: 'TG-GNT-DEF02',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/giant-defy-1.jpg',
    features: ['Manillar Integrado de Carbón', 'Transmisión Shimano 2x10 Tiagra/105', 'Multiplicación Shimano Ultegra', 'Cuadro Aluminio ALUXX'],
    componentsSummary: 'Ruta endurance con manillar integrado de carbón y componentes Shimano Ultegra/105/Tiagra.',
    forSale: true,
    salePrice: 13500,
    saleSlug: 'giant-defy',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-03',
    model: 'Liv Avail Road',
    brand: 'Liv',
    category: 'Ruta',
    size: 'S',
    riderHeightRange: '158 - 169 cm',
    serialNumber: 'TG-LIV-AVL03',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/liv-avail-1.jpg',
    features: ['Geometría Femenina Liv', 'Transmisión Shimano Claris 2x8', 'Cuadro Aluminio Ligero', 'Rodada 700c'],
    componentsSummary: 'Bicicleta de ruta para mujer. Ligera, ágil y calibrada para rodadas recreativas o fondos en el Caribe.',
    forSale: true,
    salePrice: 9900,
    saleSlug: 'liv-avail',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-04',
    model: 'Giant Stance 29 Doble Suspensión',
    brand: 'Giant',
    category: 'MTB',
    size: 'S',
    riderHeightRange: '160 - 172 cm',
    serialNumber: 'TG-GNT-ST2904',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/giant-stance-r29-1.jpg',
    features: ['Suspensión RockShox con Bloqueo', 'Transmisión Shimano Deore 1x12', 'Frenos Hidráulicos', 'Llantas Tubeless 29"'],
    componentsSummary: 'MTB doble suspensión con amortiguación RockShox y monoplato Deore 12V para senderos y cenotes.',
    forSale: true,
    salePrice: 14500,
    saleSlug: 'giant-stance-r29',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-05',
    model: 'Orbea Onna 29 Hardtail',
    brand: 'Orbea',
    category: 'MTB',
    size: 'M',
    riderHeightRange: '168 - 180 cm',
    serialNumber: 'TG-ORB-ONN05',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/orbea-onna-r29-1.jpg',
    features: ['Suspensión de Aire con Bloqueo', 'Transmisión Shimano Deore 1x12', 'Frenos de Disco Hidráulicos', 'Geometría XC Moderna'],
    componentsSummary: 'Montaña española con horquilla de aire, monoplato Deore 12V y frenos hidráulicos.',
    forSale: true,
    salePrice: 13000,
    saleSlug: 'orbea-onna-r29',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-06',
    model: 'Scott Aspect R29',
    brand: 'Scott',
    category: 'MTB',
    size: 'S',
    riderHeightRange: '160 - 172 cm',
    serialNumber: 'TG-SCT-ASP06',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/scott-r29-1.jpg',
    features: ['Transmisión Shimano Deore 1x12', 'Frenos Hidráulicos', 'Suspensión Delantera Hidráulica', 'Llantas Maxxis 29"'],
    componentsSummary: 'MTB de alto rendimiento con transmisión Shimano Deore de 12 velocidades y frenos hidráulicos.',
    forSale: true,
    salePrice: 12800,
    saleSlug: 'scott-r29',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-07',
    model: 'Trinx Quest R29',
    brand: 'Trinx',
    category: 'MTB',
    size: 'S',
    riderHeightRange: '160 - 172 cm',
    serialNumber: 'TG-TRX-QST07',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/trinx-r29-1.jpg',
    features: ['Frenos Hidráulicos Shimano MT200', 'Transmisión Shimano 2x8', 'Suspensión con Bloqueo', 'Cuadro Aluminio 6061'],
    componentsSummary: 'MTB ágil con frenos hidráulicos Shimano MT200 y suspensión con bloqueo.',
    forSale: true,
    salePrice: 7800,
    saleSlug: 'trinx-r29',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 45,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-08',
    model: 'Mercurio Ranger 29 Sport',
    brand: 'Mercurio',
    category: 'MTB',
    size: 'M',
    riderHeightRange: '168 - 182 cm',
    serialNumber: 'TG-MER-R2908',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/mercurio-ranger-r29-1.jpg',
    features: ['Cuadro Aluminio R29', 'Transmisión Shimano 3x7', 'Frenos de Disco', 'Suspensión Frontal'],
    componentsSummary: 'Bicicleta de montaña rodada 29, transmisión Shimano 21 velocidades y frenos de disco.',
    forSale: true,
    salePrice: 3000,
    saleSlug: 'mercurio-ranger-r29',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-09',
    model: 'Mercurio Ranger 27.5 Sport',
    brand: 'Mercurio',
    category: 'MTB',
    size: 'M',
    riderHeightRange: '162 - 176 cm',
    serialNumber: 'TG-MER-R2709',
    dailyRate: 300,
    weekendRate: 750,
    weeklyRate: 1450,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/mercurio-ranger-r27-1.jpg',
    features: ['Cuadro Aluminio R27.5', 'Transmisión microSHIFT 3x7', 'Freno Disco Delantero', 'Suspensión Delantera'],
    componentsSummary: 'Bicicleta versátil rodada 27.5 para paseos y caminos de terracería suave.',
    forSale: true,
    salePrice: 2999,
    saleSlug: 'mercurio-ranger-r27',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-10',
    model: 'GT Stomper 24 Juvenil',
    brand: 'GT',
    category: 'Infantil',
    size: 'Juvenil',
    riderHeightRange: '125 - 145 cm',
    serialNumber: 'TG-GT-ST2410',
    dailyRate: 250,
    weekendRate: 600,
    weeklyRate: 1200,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/gt-stomper-r24-1.jpg',
    features: ['Geometría GT LegitFit', 'Transmisión Shimano Altus 1x8', 'Frenos Mecánicos', 'Rodada 24" Ligera'],
    componentsSummary: 'Bicicleta infantil y juvenil rodada 24 adaptada a la ergonomía de ciclistas jóvenes.',
    forSale: true,
    salePrice: 3900,
    saleSlug: 'gt-stomper-r24',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  },
  {
    id: 'RENT-11',
    model: 'Giant Talon Jr 24',
    brand: 'Giant',
    category: 'Infantil',
    size: 'Juvenil',
    riderHeightRange: '130 - 150 cm',
    serialNumber: 'TG-GNT-JR2411',
    dailyRate: 250,
    weekendRate: 600,
    weeklyRate: 1200,
    depositAmount: 500,
    status: 'disponible',
    image: '/img/catalogo/giant-talon-jr-r24-1.jpg',
    features: ['Frenos de Disco Mecánicos', 'Suspensión Delantera', 'Transmisión Shimano 1x7', 'Cuadro ALUXX-Grade'],
    componentsSummary: 'MTB juvenil rodada 24 con suspensión delantera y frenos de disco.',
    forSale: true,
    salePrice: 6900,
    saleSlug: 'giant-talon-jr-r24',
    hoursRentedTotal: 0,
    hoursSinceLastService: 0,
    maintenanceThresholdHours: 50,
    lastServiceDate: '2026-09-17'
  }
];

export const INITIAL_RENTAL_CONTRACTS: RentalContract[] = [];
