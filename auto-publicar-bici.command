#!/bin/bash
# ==============================================================================
# The Garage — Auto-Publicar Bicicleta con IA (Doble Clic)
# ==============================================================================

cd "$(dirname "$0")"

echo "======================================================"
echo "🚲 INICIANDO AUTO-CATALOGADOR DE BICICLETAS CON IA"
echo "======================================================"
echo ""

# Ejecutar el procesador inteligente de imágenes y catálogo
node scripts/ai-bike-ingest.mjs

echo ""
read -p "Presiona Enter para cerrar esta ventana..."
