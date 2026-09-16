// Database schema & seed data for BiciSaaS Operations Management
export interface TaskItem {
  id: string;
  title: string;
  cat: string;
  priority: "alta" | "media" | "baja";
  status: "pending" | "progress" | "done";
  assignee: string;
  due: string;
  notes: string;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  shift: string;
  days: string;
  color: string;
  clockIn: string | null;
  clockOut: string | null;
  certs: string[];
  hoursMonth: number;
  tasksMonthDone: number;
  tasksMonthAssigned: number;
}

export interface LeaderboardPodiumEntry {
  place: number;
  placeLabel: string;
  cardClass: "gold" | "silver" | "bronze" | "neutral";
  initials: string;
  color: string;
  name: string;
  role: string;
  score: string;
  stats: Array<{ label: string; value: string }>;
  highlight: string;
}

export interface ServiceBenchmark {
  name: string;
  description: string;
  standardTime: string;
  realTime: string;
  diff: string;
  volume: string;
  quality: string;
}

export interface CustomerReview {
  stars: string;
  comment: string;
  author: string;
  tag: string;
}

export interface OperationalMonth {
  id: string; // e.g. "2026-09"
  name: string; // e.g. "Septiembre 2026"
  status: "active" | "closed";
  startDate: string;
  endDate: string;
  closedAt?: string;
  closedBy?: string;
  summary: {
    slaEfficiency: number;
    slaTrend: string;
    avgServiceTime: string;
    avgServiceTimeDiff: string;
    workshopServices: number;
    laborRevenue: number;
    csat: number;
    csatReviewsCount: number;
  };
  leaderboard: {
    podium: LeaderboardPodiumEntry[];
  };
  benchmarks: ServiceBenchmark[];
  reviews: CustomerReview[];
  tasks: TaskItem[];
  employees: EmployeeRecord[];
}

export const seedOperationsMonths: OperationalMonth[] = [
  {
    id: "2026-06",
    name: "Junio 2026",
    status: "closed",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    closedAt: "2026-06-30 20:00",
    closedBy: "Diego López",
    summary: {
      slaEfficiency: 94.0,
      slaTrend: "Inicio de temporada media",
      avgServiceTime: "1h 22m",
      avgServiceTimeDiff: "8 min más rápido que meta",
      workshopServices: 34,
      laborRevenue: 54900,
      csat: 4.88,
      csatReviewsCount: 29
    },
    leaderboard: {
      podium: [
        {
          place: 1,
          placeLabel: "1er Lugar",
          cardClass: "gold",
          initials: "MR",
          color: "#34c759",
          name: "Marco Ramírez",
          role: "Técnico Master Taller",
          score: "96.2% Eficiencia",
          stats: [{ label: "servicios", value: "22" }, { label: "garantías", value: "0" }, { label: "CSAT", value: "4.92 / 5" }],
          highlight: "Mantenimiento a fondo de flotillas turísticas para hoteles de Playa."
        },
        {
          place: 2,
          placeLabel: "2do Lugar",
          cardClass: "silver",
          initials: "LV",
          color: "#ff9500",
          name: "Laura Vásquez",
          role: "Asesora Comercial",
          score: "93.8% Conversión",
          stats: [{ label: "cerrados", value: "$124k" }, { label: "prospectos", value: "15" }, { label: "resp.", value: "< 20m" }],
          highlight: "Gran volumen de bicicletas de iniciación Trek y Giant."
        },
        {
          place: 3,
          placeLabel: "3er Lugar",
          cardClass: "bronze",
          initials: "DL",
          color: "#0071e3",
          name: "Diego López",
          role: "Admin & Operaciones",
          score: "95.0% SLA",
          stats: [{ label: "arqueos", value: "100%" }, { label: "diferencias", value: "$0" }, { label: "horas", value: "172h" }],
          highlight: "Implementación del sistema de inventario digital."
        },
        {
          place: 4,
          placeLabel: "Logística Express",
          cardClass: "neutral",
          initials: "ST",
          color: "#af52de",
          name: "Sofía Torres",
          role: "Mensajería Local",
          score: "98.5% A Tiempo",
          stats: [{ label: "envíos", value: "27" }, { label: "promedio", value: "42m" }, { label: "demoras", value: "0" }],
          highlight: "Cobertura Centro y Playacar con cero incidencias."
        }
      ]
    },
    benchmarks: [
      { name: "Mantenimiento General Integral", description: "Limpieza ultrasonido, lubricación y ajustes", standardTime: "90 min", realTime: "79 min", diff: "-11 min (12.2%)", volume: "15 bicicletas", quality: "100% Sin garantías" },
      { name: "Purga de Frenos Hidráulicos (Par)", description: "Shimano Mineral / SRAM DOT 5.1", standardTime: "35 min", realTime: "29 min", diff: "-6 min (17.1%)", volume: "10 bicicletas", quality: "100% Tacto firme" },
      { name: "Ajuste de Transmisión", description: "Alineación de patilla con DAG-2.2", standardTime: "20 min", realTime: "17 min", diff: "-3 min (15.0%)", volume: "19 bicicletas", quality: "99.0%" },
      { name: "Ensamble de Bicicleta Nueva", description: "Armado, torque y puesta a punto", standardTime: "120 min", realTime: "110 min", diff: "-10 min (8.3%)", volume: "6 bicicletas", quality: "100% Lista para rodar" },
      { name: "Conversión a Tubeless", description: "Encintado, válvulas y sellador Stan\x27s", standardTime: "30 min", realTime: "25 min", diff: "-5 min (16.7%)", volume: "12 ruedas", quality: "100% Hermético" },
      { name: "Centrado de Ruedas", description: "Tensiómetro digital y tolerancia < 0.3mm", standardTime: "40 min", realTime: "35 min", diff: "-5 min (12.5%)", volume: "8 ruedas", quality: "100% Balance" }
    ],
    reviews: [
      { stars: "⭐⭐⭐⭐⭐", comment: "Servicio rápido y eficiente. Mi Giant Talon quedó afinada al 100% para el fin de semana.", author: "Emilio Rivas", tag: "Giant Talon · Taller" },
      { stars: "⭐⭐⭐⭐⭐", comment: "Excelente atención de Laura al cotizar las zapatillas Shimano y los pedales automáticos.", author: "Andrea Soto", tag: "Accesorios · Mostrador" },
      { stars: "⭐⭐⭐⭐⭐", comment: "Puntualidad en la entrega hasta la puerta de mi trabajo en la 10ma Avenida.", author: "Roberto Solís", tag: "Envío Local · Mensajería" }
    ],
    tasks: [
      { id: "t06-1", title: "Mantenimiento Preventivo 6 Bicis Trek Hotel Iberostar", cat: "Taller / Servicio", priority: "alta", status: "done", assignee: "e2", due: "2026-06-15", notes: "Flotilla hotelera revisada." },
      { id: "t06-2", title: "Sustitución balatas orgánicas Shimano Deore cliente Pedro G.", cat: "Taller / Servicio", priority: "media", status: "done", assignee: "e2", due: "2026-06-18", notes: "Balatas B05S instaladas." },
      { id: "t06-3", title: "Cierre de preventa Basso Palta II a cliente de Cozumel", cat: "CRM / Seguimiento", priority: "alta", status: "done", assignee: "e3", due: "2026-06-20", notes: "Depósito de anticipo confirmado." },
      { id: "t06-4", title: "Inventario mensual de lubricantes Squirt y Finish Line", cat: "Inventario", priority: "media", status: "done", assignee: "e1", due: "2026-06-28", notes: "Stock cuadró al 100%." },
      { id: "t06-5", title: "Limpieza y desinfección de racks de exhibición", cat: "Limpieza / Operación", priority: "baja", status: "done", assignee: "e2", due: "2026-06-29", notes: "Área de exhibición pulida." }
    ],
    employees: [
      { id: "e1", name: "Diego López", initials: "DL", role: "Admin & Operaciones", phone: "9841234567", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#0071e3", clockIn: null, clockOut: null, certs: ["Gestión ERP", "SAT"], hoursMonth: 172, tasksMonthDone: 8, tasksMonthAssigned: 8 },
      { id: "e2", name: "Marco Ramírez", initials: "MR", role: "Técnico Master Taller", phone: "9842345678", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#34c759", clockIn: null, clockOut: null, certs: ["Shimano T.E.C.", "Park Tool"], hoursMonth: 180, tasksMonthDone: 22, tasksMonthAssigned: 22 },
      { id: "e3", name: "Laura Vásquez", initials: "LV", role: "Asesora de Ventas & CRM", phone: "9843456789", shift: "Mañana (10am–2pm)", days: "Lun–Vie", color: "#ff9500", clockIn: null, clockOut: null, certs: ["Ventas VIP"], hoursMonth: 88, tasksMonthDone: 15, tasksMonthAssigned: 15 },
      { id: "e4", name: "Sofía Torres", initials: "ST", role: "Logística & Mensajería", phone: "9844567890", shift: "Tarde (3pm–7pm)", days: "Lun–Sáb", color: "#af52de", clockIn: null, clockOut: null, certs: ["Envíos Playa"], hoursMonth: 96, tasksMonthDone: 27, tasksMonthAssigned: 27 }
    ]
  },
  {
    id: "2026-07",
    name: "Julio 2026",
    status: "closed",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    closedAt: "2026-07-31 20:30",
    closedBy: "Diego López",
    summary: {
      slaEfficiency: 97.2,
      slaTrend: "↑ +3.2% vs Junio (Pico Verano)",
      avgServiceTime: "1h 10m",
      avgServiceTimeDiff: "20 min más rápido que meta",
      workshopServices: 45,
      laborRevenue: 73800,
      csat: 4.97,
      csatReviewsCount: 36
    },
    leaderboard: {
      podium: [
        {
          place: 1,
          placeLabel: "1er Lugar",
          cardClass: "gold",
          initials: "LV",
          color: "#ff9500",
          name: "Laura Vásquez",
          role: "Asesora de Ventas & CRM",
          score: "98.8% Conversión",
          stats: [{ label: "cerrados", value: "$185k" }, { label: "prospectos", value: "24" }, { label: "resp.", value: "< 10m" }],
          highlight: "Récord histórico de facturación en bicicletas de ruta y gravel Basso."
        },
        {
          place: 2,
          placeLabel: "2do Lugar",
          cardClass: "silver",
          initials: "MR",
          color: "#34c759",
          name: "Marco Ramírez",
          role: "Técnico Master Taller",
          score: "97.5% Eficiencia",
          stats: [{ label: "servicios", value: "28" }, { label: "garantías", value: "0" }, { label: "CSAT", value: "4.96 / 5" }],
          highlight: "Ensamble de 8 bicicletas nuevas de alta gama sin un solo contratiempo."
        },
        {
          place: 3,
          placeLabel: "3er Lugar",
          cardClass: "bronze",
          initials: "DL",
          color: "#0071e3",
          name: "Diego López",
          role: "Admin & Operaciones",
          score: "96.5% SLA",
          stats: [{ label: "SAT", value: "100%" }, { label: "auditoría", value: "100%" }, { label: "horas", value: "176h" }],
          highlight: "Cero discrepancias en inventario ante alto flujo de clientes extranjeros."
        },
        {
          place: 4,
          placeLabel: "Logística Express",
          cardClass: "neutral",
          initials: "ST",
          color: "#af52de",
          name: "Sofía Torres",
          role: "Mensajería Local",
          score: "100% A Tiempo",
          stats: [{ label: "envíos", value: "35" }, { label: "promedio", value: "36m" }, { label: "demoras", value: "0" }],
          highlight: "Entregas de refacciones express en talleres aliados de Cancún y Playa."
        }
      ]
    },
    benchmarks: [
      { name: "Mantenimiento General Integral", description: "Limpieza ultrasonido y calibración pro", standardTime: "90 min", realTime: "71 min", diff: "-19 min (21.1%)", volume: "20 bicicletas", quality: "100% Sin garantías" },
      { name: "Purga de Frenos Hidráulicos (Par)", description: "Mineral y DOT con pastillas metálicas", standardTime: "35 min", realTime: "24 min", diff: "-11 min (31.4%)", volume: "16 bicicletas", quality: "100% Tacto firme" },
      { name: "Ajuste de Transmisión", description: "Alineación y lubricación en seco Squirt", standardTime: "20 min", realTime: "15 min", diff: "-5 min (25.0%)", volume: "26 bicicletas", quality: "100%" },
      { name: "Ensamble de Bicicleta Nueva", description: "Montaje, corte de horquilla y torque oficial", standardTime: "120 min", realTime: "98 min", diff: "-22 min (18.3%)", volume: "8 bicicletas", quality: "100% Pista" },
      { name: "Conversión a Tubeless", description: "Sellador Stan\x27s Race y válvulas Muc-Off", standardTime: "30 min", realTime: "21 min", diff: "-9 min (30.0%)", volume: "18 ruedas", quality: "100% Cero fugas" },
      { name: "Centrado de Ruedas", description: "Alineación radial y lateral en soporte Park Tool", standardTime: "40 min", realTime: "30 min", diff: "-10 min (25.0%)", volume: "14 ruedas", quality: "100% Balance" }
    ],
    reviews: [
      { stars: "⭐⭐⭐⭐⭐", comment: "Vine de vacaciones con mi bici descalibrada y me la dejaron lista en 2 horas. Increíble servicio.", author: "Marc Dupont (Francia)", tag: "Specialized Allez · Servicio Express" },
      { stars: "⭐⭐⭐⭐⭐", comment: "Compré la Basso Palta II con Laura. La experiencia de asesoría y setup fue de nivel Pro Tour.", author: "Ignacio Calderón", tag: "Basso Palta II · Venta" },
      { stars: "⭐⭐⭐⭐⭐", comment: "Excelente atención y los precios de Shimano están súper competitivos.", author: "Valeria Pinto", tag: "Transmisión Deore · Taller" }
    ],
    tasks: [
      { id: "t07-1", title: "Ensamble Basso Palta II Custom Carbón cliente Ignacio C.", cat: "Taller / Servicio", priority: "alta", status: "done", assignee: "e2", due: "2026-07-10", notes: "Instalación grupo Di2 2x12." },
      { id: "t07-2", title: "Purga doble SRAM Force eTap AXS cliente David P.", cat: "Taller / Servicio", priority: "alta", status: "done", assignee: "e2", due: "2026-07-12", notes: "Líquido DOT 5.1 nuevo." },
      { id: "t07-3", title: "Campaña de verano: WhatsApp a 40 clientes frecuentes", cat: "CRM / Seguimiento", priority: "media", status: "done", assignee: "e3", due: "2026-07-18", notes: "12 citas de servicio agendadas." },
      { id: "t07-4", title: "Facturación global de ventas con tarjeta al SAT", cat: "Cobro / Cuentas", priority: "alta", status: "done", assignee: "e1", due: "2026-07-30", notes: "Conciliado con contador fiscal." }
    ],
    employees: [
      { id: "e1", name: "Diego López", initials: "DL", role: "Admin & Operaciones", phone: "9841234567", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#0071e3", clockIn: null, clockOut: null, certs: ["Gestión ERP", "SAT"], hoursMonth: 176, tasksMonthDone: 11, tasksMonthAssigned: 11 },
      { id: "e2", name: "Marco Ramírez", initials: "MR", role: "Técnico Master Taller", phone: "9842345678", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#34c759", clockIn: null, clockOut: null, certs: ["Shimano T.E.C.", "Fox Pro", "Park Tool"], hoursMonth: 184, tasksMonthDone: 28, tasksMonthAssigned: 28 },
      { id: "e3", name: "Laura Vásquez", initials: "LV", role: "Asesora de Ventas & CRM", phone: "9843456789", shift: "Mañana (10am–2pm)", days: "Lun–Vie", color: "#ff9500", clockIn: null, clockOut: null, certs: ["Ventas VIP", "Basso Specialist"], hoursMonth: 92, tasksMonthDone: 24, tasksMonthAssigned: 24 },
      { id: "e4", name: "Sofía Torres", initials: "ST", role: "Logística & Mensajería", phone: "9844567890", shift: "Tarde (3pm–7pm)", days: "Lun–Sáb", color: "#af52de", clockIn: null, clockOut: null, certs: ["Envíos Playa"], hoursMonth: 100, tasksMonthDone: 35, tasksMonthAssigned: 35 }
    ]
  },
  {
    id: "2026-08",
    name: "Agosto 2026",
    status: "closed",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    closedAt: "2026-08-31 20:15",
    closedBy: "Diego López",
    summary: {
      slaEfficiency: 95.1,
      slaTrend: "Estabilidad operativa en temporada alta",
      avgServiceTime: "1h 16m",
      avgServiceTimeDiff: "14 min más rápido que meta",
      workshopServices: 38,
      laborRevenue: 61200,
      csat: 4.92,
      csatReviewsCount: 33
    },
    leaderboard: {
      podium: [
        {
          place: 1,
          placeLabel: "1er Lugar",
          cardClass: "gold",
          initials: "MR",
          color: "#34c759",
          name: "Marco Ramírez",
          role: "Técnico Master Taller",
          score: "98.0% Eficiencia",
          stats: [{ label: "servicios", value: "24" }, { label: "garantías", value: "0" }, { label: "CSAT", value: "4.95 / 5" }],
          highlight: "Cero garantías y calibración precisa de suspensiones Fox Float."
        },
        {
          place: 2,
          placeLabel: "2do Lugar",
          cardClass: "silver",
          initials: "ST",
          color: "#af52de",
          name: "Sofía Torres",
          role: "Mensajería & Envíos",
          score: "99.2% A Tiempo",
          stats: [{ label: "envíos", value: "34" }, { label: "promedio", value: "37m" }, { label: "demoras", value: "0" }],
          highlight: "Eficiencia récord en entregas de bicicletas completas en Playacar."
        },
        {
          place: 3,
          placeLabel: "3er Lugar",
          cardClass: "bronze",
          initials: "LV",
          color: "#ff9500",
          name: "Laura Vásquez",
          role: "Asesora de Ventas & CRM",
          score: "94.5% Conversión",
          stats: [{ label: "cerrados", value: "$132k" }, { label: "prospectos", value: "18" }, { label: "resp.", value: "< 15m" }],
          highlight: "Excelente colocación de cascos POC y zapatillas Shimano."
        },
        {
          place: 4,
          placeLabel: "Control & Finanzas",
          cardClass: "neutral",
          initials: "DL",
          color: "#0071e3",
          name: "Diego López",
          role: "Admin & Operaciones",
          score: "96.0% SLA",
          stats: [{ label: "arqueos", value: "100%" }, { label: "auditoría", value: "100%" }, { label: "horas", value: "172h" }],
          highlight: "Reabastecimiento de refacciones Shimano a tiempo."
        }
      ]
    },
    benchmarks: [
      { name: "Mantenimiento General Integral", description: "Desarme, ultrasonido y armado completo", standardTime: "90 min", realTime: "75 min", diff: "-15 min (16.7%)", volume: "16 bicicletas", quality: "100% Sin garantías" },
      { name: "Purga de Frenos Hidráulicos (Par)", description: "Shimano Mineral y pastillas de resina", standardTime: "35 min", realTime: "27 min", diff: "-8 min (22.9%)", volume: "12 bicicletas", quality: "100% Tacto firme" },
      { name: "Ajuste de Transmisión", description: "Alineación de pata de cambio y cadena", standardTime: "20 min", realTime: "16 min", diff: "-4 min (20.0%)", volume: "22 bicicletas", quality: "99.5%" },
      { name: "Ensamble de Bicicleta Nueva", description: "Puesta a punto oficial", standardTime: "120 min", realTime: "104 min", diff: "-16 min (13.3%)", volume: "7 bicicletas", quality: "100% Pista" },
      { name: "Conversión a Tubeless", description: "Encintado Tubeless y sellador Stan\x27s", standardTime: "30 min", realTime: "23 min", diff: "-7 min (23.3%)", volume: "15 ruedas", quality: "100% Hermético" },
      { name: "Centrado de Ruedas", description: "Tensiómetro y ajuste de cabecillas", standardTime: "40 min", realTime: "32 min", diff: "-8 min (20.0%)", volume: "10 ruedas", quality: "100% Balance" }
    ],
    reviews: [
      { stars: "5.0", comment: "Marco arregló un problema de crujido en la biela que nadie más encontraba. Genio total.", author: "Mateo Villagómez", tag: "Trek Marlin 7 · Taller" },
      { stars: "5.0", comment: "Entrega súper puntual en Playacar Fase 2. Todo impecable.", author: "Clara Domínguez", tag: "Envío Domicilio · Sofía" },
      { stars: "5.0", comment: "Compré refacciones de freno y me asesoraron con el líquido correcto.", author: "Federico M.", tag: "Refacciones · Tienda" }
    ],
    tasks: [
      { id: "t08-1", title: "Mantenimiento Preventivo Specialized Epic World Cup", cat: "Taller / Servicio", priority: "alta", status: "done", assignee: "e2", due: "2026-08-08", notes: "Horquilla SID y amortiguador trasero." },
      { id: "t08-2", title: "Cambio de rayos rotos rueda DT Swiss cliente René L.", cat: "Taller / Servicio", priority: "media", status: "done", assignee: "e2", due: "2026-08-14", notes: "Rayos Sapim CX-Ray instalados." },
      { id: "t08-3", title: "Arqueo general de inventario de cassettes y cadenas", cat: "Inventario", priority: "alta", status: "done", assignee: "e1", due: "2026-08-25", notes: "Stock exacto con sistema." },
      { id: "t08-4", title: "Seguimiento a cotizaciones de bicicletas urbanas", cat: "CRM / Seguimiento", priority: "media", status: "done", assignee: "e3", due: "2026-08-28", notes: "4 ventas concretadas." }
    ],
    employees: [
      { id: "e1", name: "Diego López", initials: "DL", role: "Admin & Operaciones", phone: "9841234567", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#0071e3", clockIn: null, clockOut: null, certs: ["Gestión ERP", "SAT"], hoursMonth: 172, tasksMonthDone: 9, tasksMonthAssigned: 9 },
      { id: "e2", name: "Marco Ramírez", initials: "MR", role: "Técnico Master Taller", phone: "9842345678", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#34c759", clockIn: null, clockOut: null, certs: ["Shimano T.E.C.", "Fox Pro", "Park Tool"], hoursMonth: 180, tasksMonthDone: 24, tasksMonthAssigned: 24 },
      { id: "e3", name: "Laura Vásquez", initials: "LV", role: "Asesora de Ventas & CRM", phone: "9843456789", shift: "Mañana (10am–2pm)", days: "Lun–Vie", color: "#ff9500", clockIn: null, clockOut: null, certs: ["Ventas VIP"], hoursMonth: 88, tasksMonthDone: 18, tasksMonthAssigned: 18 },
      { id: "e4", name: "Sofía Torres", initials: "ST", role: "Logística & Mensajería", phone: "9844567890", shift: "Tarde (3pm–7pm)", days: "Lun–Sáb", color: "#af52de", clockIn: null, clockOut: null, certs: ["Envíos Playa"], hoursMonth: 96, tasksMonthDone: 34, tasksMonthAssigned: 34 }
    ]
  },
  {
    id: "2026-09",
    name: "Septiembre 2026",
    status: "active",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    summary: {
      slaEfficiency: 96.4,
      slaTrend: "↑ +2.8% vs mes anterior",
      avgServiceTime: "1h 14m",
      avgServiceTimeDiff: "-16 min vs meta estándar",
      workshopServices: 42,
      laborRevenue: 68400,
      csat: 4.95,
      csatReviewsCount: 38
    },
    leaderboard: {
      podium: [
        {
          place: 1,
          placeLabel: "1er Lugar",
          cardClass: "gold",
          initials: "MR",
          color: "#34c759",
          name: "Marco Ramírez",
          role: "Técnico Master Taller",
          score: "98.5% Eficiencia",
          stats: [{ label: "servicios", value: "26" }, { label: "garantías", value: "0" }, { label: "CSAT", value: "4.98 / 5" }],
          highlight: "Especialista en transmisiones Shimano Di2 y purga hidráulica."
        },
        {
          place: 2,
          placeLabel: "2do Lugar",
          cardClass: "silver",
          initials: "LV",
          color: "#ff9500",
          name: "Laura Vásquez",
          role: "Asesora de Ventas & CRM",
          score: "95.2% Conversión",
          stats: [{ label: "cerrados", value: "$158k" }, { label: "prospectos", value: "19" }, { label: "resp.", value: "< 15m" }],
          highlight: "Líder en colocación de bicicletas Basso y Specialized."
        },
        {
          place: 3,
          placeLabel: "3er Lugar",
          cardClass: "bronze",
          initials: "DL",
          color: "#0071e3",
          name: "Diego López",
          role: "Operaciones & Administración",
          score: "96.0% SLA",
          stats: [{ label: "arqueos", value: "100%" }, { label: "faltantes", value: "0" }, { label: "activas", value: "42h" }],
          highlight: "Auditoría de inventario impecable y control fiscal SAT al 100%."
        },
        {
          place: 4,
          placeLabel: "Logística Express",
          cardClass: "neutral",
          initials: "ST",
          color: "#af52de",
          name: "Sofía Torres",
          role: "Mensajería & Entregas",
          score: "100% A Tiempo",
          stats: [{ label: "envíos", value: "32" }, { label: "promedio", value: "38m" }, { label: "demoras", value: "0" }],
          highlight: "Cobertura total Playa del Carmen & Playacar en tiempo récord."
        }
      ]
    },
    benchmarks: [
      { name: "Mantenimiento General Integral", description: "Limpieza ultrasonido, lubricación, ajuste de conos y cambios", standardTime: "90 min", realTime: "74 min", diff: "-16 min (17.7%)", volume: "18 bicicletas", quality: "100% Sin garantías" },
      { name: "Purga de Frenos Hidráulicos (Par)", description: "Shimano Mineral / SRAM DOT 5.1 con cambio de balatas", standardTime: "35 min", realTime: "26 min", diff: "-9 min (25.7%)", volume: "14 bicicletas", quality: "100% Tacto firme" },
      { name: "Ajuste y Sincronización de Transmisión", description: "Alineación de patilla con herramienta Park Tool DAG-2.2", standardTime: "20 min", realTime: "16 min", diff: "-4 min (20.0%)", volume: "24 bicicletas", quality: "99.5%" },
      { name: "Ensamble de Bicicleta Nueva (Box to Trail)", description: "Armado, torqueado según fabricante, tubelizado y puesta a punto", standardTime: "120 min", realTime: "102 min", diff: "-18 min (15.0%)", volume: "8 bicicletas", quality: "100% Lista para pista" },
      { name: "Conversión a Tubeless + Sellador Stan\x27s NoTubes", description: "Encintado sellado, válvulas de aluminio y talonado con compresor", standardTime: "30 min", realTime: "23 min", diff: "-7 min (23.3%)", volume: "16 ruedas", quality: "100% Hermético" },
      { name: "Centrado y Tensión de Rayos en Rueda", description: "Tensiómetro digital y corrección lateral/radial < 0.2mm", standardTime: "40 min", realTime: "32 min", diff: "-8 min (20.0%)", volume: "11 ruedas", quality: "100% Balance" }
    ],
    reviews: [
      { stars: "5.0", comment: "Marco dejó mi Trek Marlin 5 como recién salida de tienda. El cambio de cadena y la purga de frenos quedaron perfectos. Cero ruidos.", author: "Juan Pérez M.", tag: "Trek Marlin 5 · Servicio Taller" },
      { stars: "5.0", comment: "Excelente asesoría de Laura para configurar mi Basso Palta II. Me explicó el tema de desarrollos de cassette y tubeless. Muy profesional.", author: "Carlos Méndez R.", tag: "Basso Palta II · Venta & Asesoría" },
      { stars: "5.0", comment: "La entrega en Playacar fue exactamente en 35 minutos. Sofía muy amable y cuidó al máximo la bici durante el traslado.", author: "Mariana Cordero", tag: "Specialized Allez · Envío Local" }
    ],
    tasks: [
      { id: "t101", title: "Servicio Completo Trek Marlin 5 — Juan Pérez", cat: "Taller / Servicio", priority: "alta", status: "progress", assignee: "e2", due: "2026-09-07", notes: "Limpieza ultrasonido de piñón, cambio de cadena KMC X9 y calibración de frenos hidráulicos Tektro." },
      { id: "t102", title: "Instalación de Grupo Shimano Deore 12v en Basso Palta II", cat: "Taller / Servicio", priority: "alta", status: "pending", assignee: "e2", due: "2026-09-07", notes: "Cliente Carlos Méndez. Verificar línea de cadena, torque biela Hollowtech II (14 Nm) y purga de cáliper." },
      { id: "t103", title: "Seguimiento WhatsApp a Roberto Vázquez por cotización Specialized Allez", cat: "CRM / Seguimiento", priority: "alta", status: "progress", assignee: "e3", due: "2026-09-07", notes: "Preguntó por opción de pago a 6 MSI con tarjeta Banorte y disponibilidad en talla 54." },
      { id: "t104", title: "Puesta a punto y centrado micrométrico ruedas DT Swiss", cat: "Taller / Servicio", priority: "media", status: "pending", assignee: "e2", due: "2026-09-07", notes: "Tensión de rayos en rueda trasera y reemplazo de fondo de llanta Tubeless Stan’s NoTubes." },
      { id: "t105", title: "Recepción y cotejo de pedido Shimano México (15 cassettes, 30 cadenas)", cat: "Inventario", priority: "alta", status: "pending", assignee: "e1", due: "2026-09-07", notes: "Verificar factura contra orden de compra número OC-8921 e ingresar números de serie al inventario." },
      { id: "t106", title: "Diagnóstico de crujido en caja de pedalier PressFit cliente David Garza", cat: "Taller / Servicio", priority: "alta", status: "pending", assignee: "", due: "2026-09-07", notes: "Desmontar bielas, limpiar cazoletas con solvente desengrasante y aplicar grasa marina Finish Line." },
      { id: "t107", title: "Enviar factura electrónica CFDI 4.0 a Hotel Xcaret (Flotilla Mantenimiento)", cat: "Cobro / Cuentas", priority: "alta", status: "pending", assignee: "e1", due: "2026-09-07", notes: "Factura por $24,800 MXN correspondiente al servicio mensual de 12 bicicletas híbridas." },
      { id: "t108", title: "Conteo físico de llantas Maxxis Ikon 29x2.20 y Continental GP5000", cat: "Inventario", priority: "media", status: "pending", assignee: "", due: "2026-09-07", notes: "Conciliar conteo físico de estantería B con las existencias registradas en la SaaS." },
      { id: "t109", title: "Publicar galería de fotos Basso Palta II en Instagram & Facebook", cat: "Otro", priority: "media", status: "done", assignee: "e3", due: "2026-09-07", notes: "Fotos tomadas en la Quinta Avenida. Incluir enlace directo a la página de detalle /bici/BAS-PALT2." },
      { id: "t110", title: "Desengrase de tina de lavado y reciclaje de solventes ecológicos", cat: "Limpieza / Operación", priority: "baja", status: "done", assignee: "e2", due: "2026-09-07", notes: "Mantenimiento del filtro decantador de partículas metálicas del área húmeda." },
      { id: "t111", title: "Llamar a 5 clientes para encuesta de satisfacción post-servicio taller", cat: "CRM / Seguimiento", priority: "baja", status: "pending", assignee: "", due: "2026-09-07", notes: "Confirmar que los cambios y el purgado de frenos siguen al 100% tras el primer paseo dominical." },
      { id: "t112", title: "Corte de caja de medio día y conciliación de terminal Clip / Mercado Pago", cat: "Cobro / Cuentas", priority: "media", status: "done", assignee: "e1", due: "2026-09-07", notes: "Total cobrado en mañana: $18,450 MXN. Todos los comprobantes archivados." }
    ],
    employees: [
      { id: "e1", name: "Diego López", initials: "DL", role: "Admin & Operaciones", phone: "9841234567", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#0071e3", clockIn: "09:48", clockOut: null, certs: ["Gestión ERP", "Control Fiscal SAT", "Auditoría Inventario"], hoursMonth: 42, tasksMonthDone: 3, tasksMonthAssigned: 3 },
      { id: "e2", name: "Marco Ramírez", initials: "MR", role: "Técnico Master Taller", phone: "9842345678", shift: "Completo (10am–7pm)", days: "Lun–Sáb", color: "#34c759", clockIn: "10:05", clockOut: null, certs: ["Shimano T.E.C. Certified", "Fox Racing Shox Pro", "Park Tool Master"], hoursMonth: 44, tasksMonthDone: 4, tasksMonthAssigned: 5 },
      { id: "e3", name: "Laura Vásquez", initials: "LV", role: "Asesora de Ventas & CRM", phone: "9843456789", shift: "Mañana (10am–2pm)", days: "Lun–Vie", color: "#ff9500", clockIn: "09:55", clockOut: null, certs: ["Especialista Basso & Specialized", "WhatsApp Business Pro", "Atención VIP"], hoursMonth: 22, tasksMonthDone: 2, tasksMonthAssigned: 2 },
      { id: "e4", name: "Sofía Torres", initials: "ST", role: "Logística & Mensajería", phone: "9844567890", shift: "Tarde (3pm–7pm)", days: "Lun–Sáb", color: "#af52de", clockIn: null, clockOut: null, certs: ["Rutas Playa Express", "Cuidado de Carga Frágil"], hoursMonth: 24, tasksMonthDone: 1, tasksMonthAssigned: 1 }
    ]
  }
];

export const initialOperationsData = seedOperationsMonths;
