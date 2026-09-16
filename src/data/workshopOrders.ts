/**
 * Workshop Service Orders & Mechanic Dispatch Data for The Garage Bike Experts
 * Connects workshop bench work with mechanic assignments, payment tracking, and accounting
 */

export type ServiceStatus = 'agendado' | 'en_proceso' | 'esperando_refaccion' | 'listo_entrega' | 'entregado';
export type PaymentStatus = 'pagado_total' | 'anticipo' | 'pendiente_cobro';
export type ServicePriority = 'baja' | 'normal' | 'alta' | 'urgente';

export interface ServiceOrder {
  id: string; // 'ORD-501'
  folio: string; // 'SRV-2026-089'
  createdAt: string;
  dueDate: string; // Promised delivery date
  
  // Client & Bike Info
  clientName: string;
  clientPhone: string;
  bikeBrand: string;
  bikeModel: string;
  bikeType: 'Ruta' | 'MTB' | 'Gravel' | 'Urbana' | 'E-Bike';
  serialNumber?: string;
  
  // Mechanic Assignment
  assignedMechanicId: string; // 'e2' (Marco Ramírez)
  assignedMechanicName: string;
  
  // Technical Breakdown
  serviceCategory: 'Ajuste Básico' | 'Servicio General' | 'Cirugía Mayor / Suspensión' | 'Purga Hidráulica' | 'Garantía 30 Días';
  diagnosisNotes: string; // What customer reported
  mechanicWorklog?: string; // What mechanic did
  partsInstalled?: Array<{ name: string; qty: number; unitPrice: number }>;
  
  // Workshop Status
  status: ServiceStatus;
  priority: ServicePriority;
  
  // Financial & Payment Tracking
  laborFee: number; // Labor fee (mano de obra)
  partsFee: number; // Parts fee (refacciones)
  totalCost: number; // laborFee + partsFee
  amountPaid: number; // Amount already paid by customer
  balanceDue: number; // totalCost - amountPaid
  paymentStatus: PaymentStatus;
  paymentMethod?: 'Efectivo' | 'Tarjeta' | 'MercadoPago' | 'SPEI';
  
  // Quality Assurance
  qaChecklist: {
    torqueVerified: boolean;
    brakesTested: boolean;
    tirePressureSet: boolean;
    chainLubricated: boolean;
    testRode: boolean;
  };
}

export const INITIAL_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'ORD-501',
    folio: 'SRV-2026-089',
    createdAt: '2026-09-05T10:00:00Z',
    dueDate: '2026-09-08',
    clientName: 'Rodrigo Palacios',
    clientPhone: '9841203344',
    bikeBrand: 'Basso',
    bikeModel: 'Palta 2 Carbon Gravel',
    bikeType: 'Gravel',
    serialNumber: 'BAS2024PAL883',
    assignedMechanicId: 'e2',
    assignedMechanicName: 'Marco Ramírez',
    serviceCategory: 'Cirugía Mayor / Suspensión',
    diagnosisNotes: 'Ajuste completo previo a fondo Tulum. Purga de frenos Shimano GRX hidráulicos y lubricación con cera Squirt anti-salitre.',
    mechanicWorklog: 'Purga completada con aceite mineral Shimano original. Rotores desengrasados y centrados a 0.1mm.',
    partsInstalled: [
      { name: 'Aceite Mineral Shimano 100ml', qty: 1, unitPrice: 280 },
      { name: 'Balatas Resina Shimano L05A Ice-Tech', qty: 2, unitPrice: 460 }
    ],
    status: 'en_proceso',
    priority: 'alta',
    laborFee: 1600,
    partsFee: 1200,
    totalCost: 2800,
    amountPaid: 1500,
    balanceDue: 1300,
    paymentStatus: 'anticipo',
    paymentMethod: 'Tarjeta',
    qaChecklist: {
      torqueVerified: true,
      brakesTested: true,
      tirePressureSet: false,
      chainLubricated: true,
      testRode: false
    }
  },
  {
    id: 'ORD-502',
    folio: 'SRV-2026-090',
    createdAt: '2026-09-06T11:30:00Z',
    dueDate: '2026-09-07',
    clientName: 'Mariana Gómez',
    clientPhone: '9847654321',
    bikeBrand: 'Specialized',
    bikeModel: 'Allez Sport Carretera',
    bikeType: 'Ruta',
    serialNumber: 'WSBC019284719',
    assignedMechanicId: 'e2',
    assignedMechanicName: 'Marco Ramírez',
    serviceCategory: 'Garantía 30 Días',
    diagnosisNotes: 'Primer chequeo gratuito de 30 días. Revisión de asentamiento de chicotes de cambio y torque en poste de manubrio.',
    mechanicWorklog: 'Tensión de chicotes recalibrada. Presión de llantas tubeless ajustada a 85 PSI. Cadena lubricada.',
    partsInstalled: [],
    status: 'listo_entrega',
    priority: 'normal',
    laborFee: 0,
    partsFee: 0,
    totalCost: 0,
    amountPaid: 0,
    balanceDue: 0,
    paymentStatus: 'pagado_total',
    paymentMethod: 'Efectivo',
    qaChecklist: {
      torqueVerified: true,
      brakesTested: true,
      tirePressureSet: true,
      chainLubricated: true,
      testRode: true
    }
  },
  {
    id: 'ORD-503',
    folio: 'SRV-2026-091',
    createdAt: '2026-09-06T14:15:00Z',
    dueDate: '2026-09-09',
    clientName: 'Carlos Ruiz',
    clientPhone: '9841112233',
    bikeBrand: 'Giant',
    bikeModel: 'Talon 2 29er MTB',
    bikeType: 'MTB',
    serialNumber: 'GNT2024TAL209',
    assignedMechanicId: 'e1',
    assignedMechanicName: 'Diego Lecourtois',
    serviceCategory: 'Servicio General',
    diagnosisNotes: 'Crujido en caja de centro al subir pendiente y cambios saltan en piñón 4 y 5. Requiere reemplazo de cadena.',
    mechanicWorklog: 'Caja Hollowtech desarmada, limpia y engrasada con grasa marina Park Tool. Cadena nueva instalada.',
    partsInstalled: [
      { name: 'Cadena KMC X12 Silver', qty: 1, unitPrice: 850 }
    ],
    status: 'en_proceso',
    priority: 'alta',
    laborFee: 650,
    partsFee: 850,
    totalCost: 1500,
    amountPaid: 0,
    balanceDue: 1500,
    paymentStatus: 'pendiente_cobro',
    qaChecklist: {
      torqueVerified: true,
      brakesTested: false,
      tirePressureSet: false,
      chainLubricated: true,
      testRode: false
    }
  },
  {
    id: 'ORD-504',
    folio: 'SRV-2026-092',
    createdAt: '2026-09-07T09:00:00Z',
    dueDate: '2026-09-08',
    clientName: 'Alexander Klein',
    clientPhone: '9841893321',
    bikeBrand: 'Trek',
    bikeModel: 'Marlin 5 Gen 3 (Flota Renta)',
    bikeType: 'MTB',
    serialNumber: 'WTU281G0489L',
    assignedMechanicId: 'e2',
    assignedMechanicName: 'Marco Ramírez',
    serviceCategory: 'Ajuste Básico',
    diagnosisNotes: 'Alerta automática de horómetro: Unidad superó 45 horas en salitre. Desengrase ultrasónico y verificación de balatas.',
    mechanicWorklog: 'Cadena sumergida en tina ultrasónica. Verificación de espesor de pastillas: 1.8mm (OK).',
    partsInstalled: [],
    status: 'en_proceso',
    priority: 'normal',
    laborFee: 450,
    partsFee: 0,
    totalCost: 450,
    amountPaid: 450,
    balanceDue: 0,
    paymentStatus: 'pagado_total',
    paymentMethod: 'SPEI',
    qaChecklist: {
      torqueVerified: true,
      brakesTested: true,
      tirePressureSet: true,
      chainLubricated: true,
      testRode: false
    }
  },
  {
    id: 'ORD-505',
    folio: 'SRV-2026-093',
    createdAt: '2026-09-04T16:00:00Z',
    dueDate: '2026-09-09',
    clientName: 'Gabriel Garza',
    clientPhone: '9845551234',
    bikeBrand: 'Scott',
    bikeModel: 'Scale 965 XC Hardtail',
    bikeType: 'MTB',
    serialNumber: 'SCT2023SCL412',
    assignedMechanicId: 'e2',
    assignedMechanicName: 'Marco Ramírez',
    serviceCategory: 'Purga Hidráulica',
    diagnosisNotes: 'Maneta de freno trasero se va hasta el manubrio. Fuga en sello de caliper trasero Magura MT4.',
    mechanicWorklog: 'Esperando kit de sellos y oliva original Magura pedido a distribuidor.',
    partsInstalled: [
      { name: 'Kit Sellos & Oliva Magura Royal Blood', qty: 1, unitPrice: 380 }
    ],
    status: 'esperando_refaccion',
    priority: 'urgente',
    laborFee: 750,
    partsFee: 380,
    totalCost: 1130,
    amountPaid: 0,
    balanceDue: 1130,
    paymentStatus: 'pendiente_cobro',
    qaChecklist: {
      torqueVerified: false,
      brakesTested: false,
      tirePressureSet: false,
      chainLubricated: false,
      testRode: false
    }
  },
  {
    id: 'ORD-506',
    folio: 'SRV-2026-094',
    createdAt: '2026-09-06T12:00:00Z',
    dueDate: '2026-09-07',
    clientName: 'Sofía Mendizábal',
    clientPhone: '9848899001',
    bikeBrand: 'Merida',
    bikeModel: 'Scultura 300 Tiagra',
    bikeType: 'Ruta',
    serialNumber: 'MER2024SCU319',
    assignedMechanicId: 'e2',
    assignedMechanicName: 'Marco Ramírez',
    serviceCategory: 'Servicio General',
    diagnosisNotes: 'Instalación de cinta de manubrio Supacaz Celeste y calibrado de frenos de zapata Shimano Tiagra.',
    mechanicWorklog: 'Cinta instalada con tensión uniforme y tapones expansibles de aluminio. Zapatas alineadas a pista de frenado.',
    partsInstalled: [
      { name: 'Cinta de Manubrio Supacaz Bling Celeste', qty: 1, unitPrice: 650 }
    ],
    status: 'listo_entrega',
    priority: 'normal',
    laborFee: 400,
    partsFee: 650,
    totalCost: 1050,
    amountPaid: 1050,
    balanceDue: 0,
    paymentStatus: 'pagado_total',
    paymentMethod: 'MercadoPago',
    qaChecklist: {
      torqueVerified: true,
      brakesTested: true,
      tirePressureSet: true,
      chainLubricated: true,
      testRode: true
    }
  }
];
