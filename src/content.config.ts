import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const bicis = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/bicis' }),
  schema: z.object({
    id: z.string(),
    modelo: z.string(),
    marca: z.string(),
    categoria: z.enum(['MTB', 'Ruta', 'Urbana', 'Eléctrica', 'Infantil']),
    precio: z.number(),
    moneda: z.string().default('MXN'),
    estado: z.enum(['Nueva', 'Seminueva']),
    disponibilidad: z.enum(['Disponible', 'Apartada', 'Vendida']),
    talla: z.string(),
    color: z.string(),
    specs: z.object({
      cuadro: z.string().optional(),
      grupo: z.string().optional(),
      frenos: z.string().optional(),
      rodada: z.string().optional(),
    }).optional(),
    fotos: z.array(z.string()),
    mensajeWhatsApp: z.string(),
    destacada: z.boolean().default(false),
    esMuestra: z.boolean().default(false),
  }),
});

export const collections = { bicis };
