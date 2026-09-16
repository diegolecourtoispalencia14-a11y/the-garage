// Vector SVG Icon Registry for The Garage & BiciSaaS
// Replaces raw system emojis with crisp, professional, scalable vector glyphs

export interface IconOptions {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export const ICONS = {
  // E-commerce & Logistics
  cart: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
  },
  box: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
  },
  store: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`;
  },
  deliveryMoto: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
  },
  eye: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  },
  compare: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`;
  },
  whatsapp: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${c}" class="${opts.className || 'tg-svg-icon'}"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.152.57 4.17 1.564 5.91l-1.564 5.708 5.867-1.538c1.701.928 3.652 1.458 5.727 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/></svg>`;
  },
  sparkles: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`;
  },
  starFilled: (opts: IconOptions = {}) => {
    const s = opts.size || 16;
    const c = opts.color || '#f59e0b';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${c}" stroke="${c}" stroke-width="1" class="${opts.className || 'tg-svg-icon'}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  },
  google: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" class="${opts.className || 'tg-svg-icon'}"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;
  },
  lock: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  },
  shieldCheck: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
  },
  check: (opts: IconOptions = {}) => {
    const s = opts.size || 16;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2.5}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><polyline points="20 6 9 17 4 12"/></svg>`;
  },

  // Cycling Specific Category Glyphs
  bike: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/><path d="M8 14h5"/></svg>`;
  },
  drivetrain: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
  },
  brakes: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5"/><path d="M12 16v5"/><path d="M3 12h5"/><path d="M16 12h5"/></svg>`;
  },
  wheels: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.5"/><line x1="12" y1="3" x2="12" y2="10.5"/><line x1="12" y1="13.5" x2="12" y2="21"/><line x1="3" y1="12" x2="10.5" y2="12"/><line x1="13.5" y1="12" x2="21" y2="12"/><line x1="5.64" y1="5.64" x2="10.94" y2="10.94"/><line x1="13.06" y1="13.06" x2="18.36" y2="18.36"/><line x1="5.64" y1="18.36" x2="10.94" y2="13.06"/><line x1="13.06" y1="10.94" x2="18.36" y2="5.64"/></svg>`;
  },
  helmet: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M12 3a9 9 0 0 0-9 9c0 3.2 1.67 6 4.17 7.5L8 16h8l.83 3.5c2.5-1.5 4.17-4.3 4.17-7.5a9 9 0 0 0-9-9z"/><path d="M6 10h12"/><path d="M9 13h6"/></svg>`;
  },
  apparel: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 1.97 1.67H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10.86h1.17a2 2 0 0 0 1.97-1.67l.58-3.5a2 2 0 0 0-1.34-2.23z"/></svg>`;
  },
  nutrition: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
  },
  electronics: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/><path d="M9 6h6"/><path d="M9 10h6"/></svg>`;
  },
  tools: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  },
  lighting: (opts: IconOptions = {}) => {
    const s = opts.size || 20;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5z"/></svg>`;
  },
  search: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  },
  calendar: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  },
  database: (opts: IconOptions = {}) => {
    const s = opts.size || 18;
    const c = opts.color || 'currentColor';
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${opts.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" class="${opts.className || 'tg-svg-icon'}"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`;
  }
};

// Maps catalog category string to clean vector SVG string
export function getCategoryVectorIcon(cat: string, size = 18): string {
  switch (cat) {
    case 'Bicicletas':
      return ICONS.bike({ size });
    case 'Transmisión & Drivetrain':
      return ICONS.drivetrain({ size });
    case 'Frenos & Rotores':
      return ICONS.brakes({ size });
    case 'Ruedas & Llantas':
      return ICONS.wheels({ size });
    case 'Cascos & Seguridad':
      return ICONS.helmet({ size });
    case 'Ropa & Calzado':
      return ICONS.apparel({ size });
    case 'Nutrición & Hidratación':
      return ICONS.nutrition({ size });
    case 'Electrónica & GPS':
      return ICONS.electronics({ size });
    case 'Herramientas & Taller':
      return ICONS.tools({ size });
    case 'Iluminación & Bolsas':
    case 'Iluminación':
    case 'Bolsas & Alforjas':
      return ICONS.lighting({ size });
    default:
      return ICONS.box({ size });
  }
}
