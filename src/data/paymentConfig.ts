// src/data/paymentConfig.ts
// Configuración central de Pasarela de Pagos (MercadoPago México / SPEI / Concierge)

export interface PaymentGatewayConfig {
  mode: 'sandbox' | 'production';
  provider: 'mercadopago' | 'spei' | 'direct';
  mpPublicKey: string; // Clave pública de producción (APP_USR-...)
  mpAccessToken: string; // Token de acceso de producción (APP_USR-...)
  mpPaymentLink: string; // Link de cobro directo generado desde la app de Mercado Pago
  speiClabe: string; // CLABE Interbancaria (18 dígitos)
  speiBank: string; // Banco receptor
  speiBeneficiary: string; // Nombre o razón social
  onlineFeePercent: number; // Comisión pasarela (por defecto 0%)
  freeShippingThreshold: number; // Monto para envío gratis (por defecto $500 MXN)
  shippingCost: number; // Costo de envío estándar si no supera el umbral ($80 MXN)
  notificationWhatsApp: string; // Teléfono que recibe las órdenes pagadas
}

export const DEFAULT_PAYMENT_CONFIG: PaymentGatewayConfig = {
  mode: 'production', // 'production' para cobros y pedidos verificados
  provider: 'mercadopago',
  mpPublicKey: '',
  mpAccessToken: '',
  mpPaymentLink: '',
  speiClabe: '646690146012345678',
  speiBank: 'STP / BBVA México',
  speiBeneficiary: 'The Garage Bike Experts',
  onlineFeePercent: 0,
  freeShippingThreshold: 500,
  shippingCost: 80,
  notificationWhatsApp: '529841381493'
};
