// src/data/allProducts.ts
// Master catalog with all 40 official store products and cross-selling mappings

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
  fotos: string[];
  disciplina?: 'mtb' | 'gravel' | 'ruta' | 'urbano' | 'taller' | 'universal';
  suggestedIds?: string[];
}

export const MASTER_PRODUCTS: ProductItem[] = [
  // ── 1. BICICLETAS ──
  {
    id: '1',
    sku: 'BAS-PALT2',
    slug: 'basso-palta-ii-custom',
    name: 'Basso Palta 2 Carbon',
    brand: 'Basso',
    cat: 'Bicicletas',
    price: 85000,
    stock: 2,
    talla: 'M (53 cm)',
    color: 'Verde Siena Terroso',
    estado: 'Custom Build',
    disciplina: 'gravel',
    specs: 'Cuadro 100% carbono Torayca italiano T700/T800 de alto módulo. Grupo inalámbrico SRAM Rival XPLR eTap AXS 1x12 electrónico, ruedas Microtech MX25 Carbon tubeless ready, cableado 100% interno.',
    fotos: [
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'
    ],
    suggestedIds: ['POC-AXR-M', 'GAR-EDG530', 'API-BCK', 'MAU-G100']
  },
  {
    id: '2',
    sku: 'TRK-MAR5',
    slug: 'trek-marlin-5-2024',
    name: 'Trek Marlin 5 MTB 29"',
    brand: 'Trek',
    cat: 'Bicicletas',
    price: 18500,
    stock: 5,
    talla: 'M (17.5")',
    color: 'Negro / Rojo Lava',
    estado: 'Nueva',
    disciplina: 'mtb',
    specs: 'Cuadro Alpha Silver Aluminum con ruteo interno, horquilla SR Suntour XCT 30 HLO 100mm con bloqueo hidráulico, transmisión Shimano CUES 1x9 vel, frenos hidráulicos Tektro HD-M275.',
    fotos: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80'
    ],
    suggestedIds: ['POC-AXR-M', 'FOX-RNG-GL', 'TPK-JB', 'RNR-GOLD-4', 'MAX-ARD-29']
  },
  {
    id: '3',
    sku: 'SPZ-ALZ-SP',
    slug: 'specialized-allez-e5',
    name: 'Specialized Allez Sport',
    brand: 'Specialized',
    cat: 'Bicicletas',
    price: 32000,
    stock: 1,
    talla: '54 cm (M)',
    color: 'Azul Cobalto Brillante',
    estado: 'Seminueva',
    disciplina: 'ruta',
    specs: 'Aluminio E5 premium con soldaduras invisibles SmoothWelds, horquilla FACT Full Carbon, transmisión Shimano Sora 2x9 vel, ruedas Axis Sport con cubiertas RoadSport 700x26c.',
    fotos: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502744688674-c619d3864003?auto=format&fit=crop&w=1200&q=80'
    ],
    suggestedIds: ['SPZ-PRO4', 'GAR-EDG530', 'CAS-GAB3-M', 'CMB-POD620']
  },
  {
    id: '4',
    sku: 'GNT-TAL2',
    slug: 'giant-talon-2-2024',
    name: 'Giant Talon 2 27.5"',
    brand: 'Giant',
    cat: 'Bicicletas',
    price: 12500,
    stock: 3,
    talla: 'L (19")',
    color: 'Gris Grafito Mate',
    estado: 'Nueva',
    disciplina: 'mtb',
    specs: 'Cuadro Aluxx-Grade Aluminum, suspensión Suntour XCM 100mm con bloqueo hidráulico, transmisión microSHIFT Advent 1x9 de amplio rango 11-42D, ruedas Giant GX03V.',
    fotos: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'
    ],
    suggestedIds: ['GIR-FXT2', 'FOX-RNG-GL', 'STA-240', 'TPK-JB']
  },
  {
    id: 'merida-scultura-300-tiagra',
    sku: 'MER-SCU300',
    slug: 'merida-scultura-tiagra',
    name: 'Merida Scultura 300 Shimano Tiagra',
    brand: 'Merida',
    cat: 'Bicicletas',
    price: 19800,
    stock: 1,
    talla: 'S/M (52 cm)',
    color: 'Azul Eléctrico Metálico',
    estado: 'Seminueva',
    disciplina: 'ruta',
    specs: 'Cuadro Scultura Lite triple conificado, horquilla Scultura CF2 Carbono, grupo completo Shimano Tiagra 2x10, frenos Tiagra doble pivote.',
    fotos: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'
    ],
    suggestedIds: ['SPZ-PRO4', 'GAR-EDG530', 'CAS-GAB3-M', 'MAU-G100']
  },

  // ── 2. TRANSMISIÓN & DRIVETRAIN ──
  {
    id: '5',
    sku: 'SHI-CS-M6100',
    name: 'Shimano Deore M6100 12v Cassette',
    brand: 'Shimano',
    cat: 'Transmisión & Drivetrain',
    price: 3200,
    stock: 8,
    disciplina: 'mtb',
    specs: 'Tecnología Hyperglide+ con cambios continuos bajo carga. Compatible con núcleo Micro Spline de 12 velocidades. Rango 10-51 dientes.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['KMC-X12', 'SRM-NXE-RD', 'BON-AL9', 'RNR-GOLD-4']
  },
  {
    id: '6',
    sku: 'SRM-NXE-RD',
    name: 'SRAM NX Eagle 12v Derailleur',
    brand: 'SRAM',
    cat: 'Transmisión & Drivetrain',
    price: 4500,
    stock: 4,
    disciplina: 'mtb',
    specs: 'Desviador trasero SRAM NX Eagle con embrague Type 3 Roller Bearing Clutch y bloqueo Cage Lock para desmontaje rápido de rueda.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['KMC-X12', 'SHI-CS-M6100', 'BON-AL9']
  },
  {
    id: '7',
    sku: 'SHI-CRK-M6100',
    name: 'Shimano Deore M6100 Crankset',
    brand: 'Shimano',
    cat: 'Transmisión & Drivetrain',
    price: 2800,
    stock: 6,
    disciplina: 'mtb',
    specs: 'Bielas de aluminio forjado Hollowtech II monoplato de 32 dientes con perfil Dynamic Chain Engagement+ para máxima retención de cadena.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['KMC-X12', 'SHI-CS-M6100', 'BON-AL9']
  },
  {
    id: '8',
    sku: 'KMC-X12',
    name: 'KMC X12 Chain 12v',
    brand: 'KMC',
    cat: 'Transmisión & Drivetrain',
    price: 680,
    stock: 15,
    disciplina: 'universal',
    specs: '126 eslabones con eslabón de conexión rápida MissingLink. Tratamiento niquelado de alta resistencia al óxido en climas húmedos.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['RNR-GOLD-4', 'SHI-CS-M6100', 'BON-AL9']
  },

  // ── 3. FRENOS & ROTORES ──
  {
    id: '9',
    sku: 'SHI-MT200',
    name: 'Shimano MT200 Disc Brake Set',
    brand: 'Shimano',
    cat: 'Frenos',
    price: 1800,
    stock: 7,
    disciplina: 'mtb',
    specs: 'Frenos de disco hidráulicos de 2 pistones con maneta ergonómica de acero. Purga limpia y sencilla One-Way Bleeding con aceite mineral Shimano.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['SHI-B01S', 'BON-AL9']
  },
  {
    id: '10',
    sku: 'SRM-LVL-T',
    name: 'SRAM Level T Brake Set',
    brand: 'SRAM',
    cat: 'Frenos',
    price: 2400,
    stock: 3,
    disciplina: 'mtb',
    specs: 'Frenos de disco hidráulicos SRAM Level T con pinza de dos pistones DirectLink y abrazadera MatchMaker compatible con mandos de cambio.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['BON-AL9', 'SHI-B01S']
  },
  {
    id: '11',
    sku: 'SHI-B01S',
    name: 'Pastillas Shimano B01S (par)',
    brand: 'Shimano',
    cat: 'Frenos',
    price: 320,
    stock: 20,
    disciplina: 'universal',
    specs: 'Compuesto de resina sintética que proporciona una frenada progresiva y silenciosa con menor desgaste del disco de freno.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['SHI-MT200', 'BON-AL9']
  },

  // ── 4. RUEDAS & LLANTAS ──
  {
    id: '12',
    sku: 'MAX-ARD-29',
    name: 'Maxxis Ardent 29x2.25"',
    brand: 'Maxxis',
    cat: 'Ruedas & Llantas',
    price: 1200,
    stock: 10,
    disciplina: 'mtb',
    specs: 'Cubierta agresiva con tacos laterales en bloque para tracción en curvas y tacos centrales biselados para rodar rápido. Carcasa EXO Protection.',
    fotos: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['STA-240', 'MCH-29P', 'TPK-JB']
  },
  {
    id: '13',
    sku: 'SCH-MP-35',
    name: 'Schwalbe Marathon Plus 700x35c',
    brand: 'Schwalbe',
    cat: 'Ruedas & Llantas',
    price: 950,
    stock: 8,
    disciplina: 'urbano',
    specs: 'La cubierta antipinchazos por excelencia con banda SmartGuard de 5mm de goma especial flexible. Flancos reflectantes para rodar de noche.',
    fotos: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['MCH-29P', 'TPK-JB']
  },
  {
    id: '14',
    sku: 'MCH-29P',
    name: 'Cámara Michelin 29" Presta',
    brand: 'Michelin',
    cat: 'Ruedas & Llantas',
    price: 180,
    stock: 25,
    disciplina: 'universal',
    specs: 'Cámara de butilo de alta estanqueidad para ruedas de 29x1.90 a 2.50 con válvula fina Presta de 48mm.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['REM-TT02', 'TPK-JB']
  },
  {
    id: '15',
    sku: 'STA-240',
    name: 'Sellador Stans NoTubes 240ml',
    brand: 'Stans',
    cat: 'Ruedas & Llantas',
    price: 350,
    stock: 12,
    disciplina: 'universal',
    specs: 'Líquido sellador original a base de látex natural que repara pinchazos de hasta 6.5mm en menos de 1 segundo.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['MAX-ARD-29', 'TPK-JB']
  },

  // ── 5. COMPONENTES & COCKPIT ──
  {
    id: '16',
    sku: 'RF-ATL-35',
    name: 'Manubrio RaceFace Atlas 35mm',
    brand: 'RaceFace',
    cat: 'Manubrio & Tija',
    price: 1800,
    stock: 4,
    disciplina: 'mtb',
    specs: 'Manubrio de aluminio serie 7075 embutido en frío de 820mm de ancho con diámetro de 35mm para máxima rigidez en descenso y enduro.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['SHI-TIA-90', 'BON-AL9']
  },
  {
    id: '17',
    sku: 'SHI-TIA-90',
    name: 'Potencia Shimano Tiagra 90mm',
    brand: 'Shimano',
    cat: 'Manubrio & Tija',
    price: 650,
    stock: 6,
    disciplina: 'ruta',
    specs: 'Potencia de aluminio 3D forjado de 90mm de longitud con ángulo de +/- 6 grados para tubo de horquilla de 1-1/8 pulgadas.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['RF-ATL-35', 'BON-AL9']
  },
  {
    id: '18',
    sku: 'FZK-ALI-G',
    name: 'Sillín Fizik Aliante Gamma',
    brand: 'Fizik',
    cat: 'Sillín & Poste',
    price: 2200,
    stock: 3,
    disciplina: 'ruta',
    specs: 'Sillín ergonómico de perfil curvado con carcasa reforzada de nailon con carbono y raíles de K:ium para máxima absorción de vibraciones.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['KS-LEV-150', 'BON-AL9']
  },
  {
    id: '19',
    sku: 'KS-LEV-150',
    name: 'Poste Sillín KS Lev Integra 150mm',
    brand: 'KindShock',
    cat: 'Sillín & Poste',
    price: 7500,
    stock: 2,
    disciplina: 'mtb',
    specs: 'Tija telescópica dropper hidráulica con guiado de cable interno y 150mm de recorrido con cartucho de aire sellado.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['FZK-ALI-G', 'BON-AL9']
  },

  // ── 6. CASCOS & SEGURIDAD ──
  {
    id: '20',
    sku: 'POC-AXR-M',
    name: 'Casco POC Axion Race MIPS',
    brand: 'POC',
    cat: 'Cascos & Seguridad',
    price: 4800,
    stock: 5,
    talla: 'M/L (55-58 cm)',
    disciplina: 'mtb',
    specs: 'Protección rotacional MIPS Integra, visera rompible anti-latigazo cervical patentada y ventilación optimizada para clima caribeño.',
    fotos: [
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'
    ],
    suggestedIds: ['FOX-RNG-GL', 'LEZ-MD1800', 'CAT-RX3', 'CMB-POD620']
  },
  {
    id: '21',
    sku: 'GIR-FXT2',
    name: 'Casco Giro Fixture II MIPS MTB',
    brand: 'Giro',
    cat: 'Cascos & Seguridad',
    price: 2400,
    stock: 8,
    talla: 'Universal Adulto (54-61 cm)',
    disciplina: 'mtb',
    specs: 'Sistema de ajuste Roc Loc Sport, 16 canales de ventilación, carcasa In-Mold con refuerzo MIPS.',
    fotos: ['https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['FOX-RNG-GL', 'CAT-RX3', 'CMB-POD620']
  },
  {
    id: '22',
    sku: 'SPZ-PRO4',
    name: 'Casco Specialized Propero 4',
    brand: 'Specialized',
    cat: 'Cascos & Seguridad',
    price: 3200,
    stock: 3,
    talla: 'M (55-59 cm)',
    disciplina: 'ruta',
    specs: 'Desarrollado en Win Tunnel, sistema de microajuste FS3, sistema MIPS Evolve Core.',
    fotos: ['https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['CAS-GAB3-M', 'GAR-EDG530', 'MAU-G100']
  },

  // ── 7. ROPA & CALZADO ──
  {
    id: '23',
    sku: 'CAS-GAB3-M',
    name: 'Maillot Castelli Gabba 3',
    brand: 'Castelli',
    cat: 'Ropa & Calzado',
    price: 3800,
    stock: 4,
    talla: 'M',
    disciplina: 'ruta',
    specs: 'Tejido Gore-Tex Infinium Windstopper elástico en 4 direcciones, panel trasero con drenaje reflectante.',
    fotos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['SPZ-PRO4', 'GAR-EDG530', 'CMB-POD620']
  },
  {
    id: '24',
    sku: 'END-MT500-2',
    name: 'Shorts Endura MT500 II',
    brand: 'Endura',
    cat: 'Ropa & Calzado',
    price: 2100,
    stock: 6,
    talla: 'L',
    disciplina: 'mtb',
    specs: 'Pantalones cortos de trail indestructibles confeccionados con nylon Cordura impermeable en culera.',
    fotos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['FOX-RNG-GL', 'SHI-ME5-38', 'POC-AXR-M']
  },
  {
    id: '25',
    sku: 'SHI-ME5-38',
    name: 'Zapatillas Shimano ME5 MTB T38',
    brand: 'Shimano',
    cat: 'Ropa & Calzado',
    price: 3500,
    stock: 2,
    talla: '38 EU',
    disciplina: 'mtb',
    specs: 'Suela de goma Michelin de tracción extrema, dial BOA L6 milimétrico, entresuela Torbal.',
    fotos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['FOX-RNG-GL', 'END-MT500-2', 'POC-AXR-M']
  },
  {
    id: '26',
    sku: 'FOX-RNG-GL',
    name: 'Guantes Fox Ranger Gel',
    brand: 'Fox',
    cat: 'Ropa & Calzado',
    price: 850,
    stock: 10,
    talla: 'L',
    disciplina: 'mtb',
    specs: 'Acolchado ergonómico de gel TruGel en palma, puño de neopreno con cierre velcro, dedos táctiles.',
    fotos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['POC-AXR-M', 'GIR-FXT2', 'CMB-POD620']
  },

  // ── 8. NUTRICIÓN & HIDRATACIÓN ──
  {
    id: '27',
    sku: 'MAU-G100',
    name: 'Gel Energético Maurten 100',
    brand: 'Maurten',
    cat: 'Nutrición & Hidratación',
    price: 120,
    stock: 30,
    disciplina: 'universal',
    specs: 'Tecnología de hidrogel sin saborizantes artificiales, 25g de carbohidratos de absorción digestiva rápida.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['H5-ELEC47', 'CMB-POD620']
  },
  {
    id: '28',
    sku: 'H5-ELEC47',
    name: 'Sales Electrolitos High5 47 tabs',
    brand: 'High5',
    cat: 'Nutrición & Hidratación',
    price: 320,
    stock: 15,
    disciplina: 'universal',
    specs: 'Magnesio, potasio, sodio y calcio quelados, efervescencia rápida sabor bayas cítricas.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['MAU-G100', 'CMB-POD620']
  },
  {
    id: '29',
    sku: 'CMB-POD620',
    name: 'Bidón Camelbak Podium 620ml',
    brand: 'Camelbak',
    cat: 'Nutrición & Hidratación',
    price: 380,
    stock: 18,
    disciplina: 'universal',
    specs: 'Válvula autosellante Jet Valve antiderrame, polipropileno TruTaste libre de BPA.',
    fotos: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['H5-ELEC47', 'MAU-G100', 'FOX-RNG-GL']
  },

  // ── 9. ELECTRÓNICA & GPS ──
  {
    id: '30',
    sku: 'GAR-EDG530',
    name: 'Cuentakilómetros Garmin Edge 530',
    brand: 'Garmin',
    cat: 'Electrónica & GPS',
    price: 8500,
    stock: 2,
    disciplina: 'universal',
    specs: 'Mapeo Garmin Cycle Map curva a curva, métricas MTB Dynamics (Grit/Flow) y aclimatación al calor.',
    fotos: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['GAR-SCAD', 'LEZ-MD1800', 'CAT-RX3']
  },
  {
    id: '31',
    sku: 'GAR-SCAD',
    name: 'Sensor de Cadencia Garmin',
    brand: 'Garmin',
    cat: 'Electrónica & GPS',
    price: 1200,
    stock: 5,
    disciplina: 'universal',
    specs: 'Acelerómetro 3D sin imanes, conectividad ANT+ y Bluetooth Smart dual simultánea.',
    fotos: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['GAR-EDG530']
  },
  {
    id: '32',
    sku: 'ANK-20K',
    name: 'Cargador USB Portátil Anker 20k',
    brand: 'Anker',
    cat: 'Electrónica & GPS',
    price: 1100,
    stock: 4,
    disciplina: 'universal',
    specs: 'Power Bank de 20,000 mAh ultracompacto para recargar GPS y luces durante travesías largas de bikepacking.',
    fotos: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['GAR-EDG530', 'LEZ-MD1800']
  },

  // ── 10. HERRAMIENTAS & TALLER ──
  {
    id: '33',
    sku: 'BON-AL9',
    name: 'Kit Herramientas Allen 9pz Bondhus',
    brand: 'Bondhus',
    cat: 'Herramientas & Taller',
    price: 480,
    stock: 12,
    disciplina: 'taller',
    specs: 'Acero Protanium 20% más resistente a torsión, acabado ProGuard anticorrosión, punta de bola a 25°.',
    fotos: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['RNR-GOLD-4', 'TPK-JB', 'REM-TT02']
  },
  {
    id: '34',
    sku: 'RNR-GOLD-4',
    name: 'Lubricante Cadena Rock N Roll Gold',
    brand: 'Rock N Roll',
    cat: 'Herramientas & Taller',
    price: 250,
    stock: 20,
    disciplina: 'taller',
    specs: 'Limpia la suciedad interior del eslabón y sella una membrana seca protectora que repele la arena blanca de la Riviera Maya.',
    fotos: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['KMC-X12', 'BON-AL9', 'TPK-JB']
  },
  {
    id: '35',
    sku: 'TPK-JB',
    name: 'Inflador de Piso Topeak Joe Blow',
    brand: 'Topeak',
    cat: 'Herramientas & Taller',
    price: 1400,
    stock: 3,
    disciplina: 'taller',
    specs: 'Cuerpo de acero reforzado de alto calibre, manómetro analógico de 3 pulgadas, manguera extra larga de 360°.',
    fotos: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['STA-240', 'MAX-ARD-29', 'REM-TT02']
  },
  {
    id: '36',
    sku: 'REM-TT02',
    name: 'Kit Parches Rema Tip Top TT02',
    brand: 'Rema',
    cat: 'Herramientas & Taller',
    price: 80,
    stock: 35,
    disciplina: 'universal',
    specs: 'Kit de 6 parches con borde biselado naranja vulcanizante para reparación hermética inmediata de cámaras.',
    fotos: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['MCH-29P', 'TPK-JB']
  },

  // ── 11. ILUMINACIÓN & BOLSAS ──
  {
    id: '37',
    sku: 'LEZ-MD1800',
    name: 'Luz Delantera Lezyne Mega Drive 1800',
    brand: 'Lezyne',
    cat: 'Iluminación',
    price: 3200,
    stock: 4,
    disciplina: 'universal',
    specs: '1800 lúmenes con 3 emisores LED Tri-Focus, chasis de aluminio CNC con aletas de disipación térmica, batería recargable USB.',
    fotos: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['CAT-RX3', 'API-BCK', 'GAR-EDG530']
  },
  {
    id: '38',
    sku: 'CAT-RX3',
    name: 'Luz Trasera Cateye Rapid X3',
    brand: 'Cateye',
    cat: 'Iluminación',
    price: 950,
    stock: 8,
    disciplina: 'universal',
    specs: '2 tiras COB LED de alta intensidad, visibilidad lateral de 360 grados, montaje aero con bandas de silicona.',
    fotos: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['LEZ-MD1800', 'POC-AXR-M']
  },
  {
    id: '39',
    sku: 'API-BCK',
    name: 'Alforja Cuadro Apidura Backcountry',
    brand: 'Apidura',
    cat: 'Bolsas & Alforjas',
    price: 2800,
    stock: 3,
    disciplina: 'gravel',
    specs: 'Tejido laminado 420D soldado por ultrasonido 100% impermeable, tiras reforzadas Hypalon.',
    fotos: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['TPK-AWL', 'LEZ-MD1800', 'MAU-G100']
  },
  {
    id: '40',
    sku: 'TPK-AWL',
    name: 'Bolsa Sillín Topeak Aero Wedge',
    brand: 'Topeak',
    cat: 'Bolsas & Alforjas',
    price: 680,
    stock: 7,
    disciplina: 'universal',
    specs: 'Bolsa bajo asiento aerodinámica con bandas reflectantes 3M y clip para luz trasera.',
    fotos: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80'],
    suggestedIds: ['REM-TT02', 'MCH-29P', 'CAT-RX3']
  }
];

export function getAllProducts(): ProductItem[] {
  return MASTER_PRODUCTS;
}

export function getProductById(idOrSku: string): ProductItem | undefined {
  const clean = (idOrSku || '').toLowerCase();
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
    if (list.length >= limit) return list.slice(0, limit);
  }

  const sameCategory = MASTER_PRODUCTS.filter(p => p.id !== product.id && p.cat === product.cat);
  const accessories = MASTER_PRODUCTS.filter(p => p.id !== product.id && (p.cat === 'Cascos & Seguridad' || p.cat === 'Herramientas & Taller' || p.cat === 'Nutrición & Hidratación'));

  const pool = [...sameCategory, ...accessories];
  const unique = Array.from(new Set(pool));
  return unique.slice(0, limit);
}
