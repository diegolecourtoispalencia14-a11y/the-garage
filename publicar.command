#!/bin/bash
# ==============================================================================
# The Garage — Publicar en Internet (Cloudflare Pages y GitHub)
# ==============================================================================

cd "$(dirname "$0")"

echo "======================================================"
echo "🚲 SUBIENDO THE GARAGE A LA NUBE (CLOUDFLARE PAGES)"
echo "======================================================"
echo ""

# 1. Comprobar que todo compile sin errores
echo "🔍 1. Verificando que todo el sitio esté perfecto..."
ASTRO_TELEMETRY_DISABLED=1 npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Ocurrió un error al compilar. Revisa las fotos o archivos."
  read -p "Presiona Enter para cerrar..."
  exit 1
fi

echo "✅ Compilación perfecta."
echo ""

# 2. Subir a GitHub
echo "🚀 2. Subiendo tus cambios a GitHub..."
git add .
git commit -m "Actualización: $(date +'%d/%m/%Y %H:%M:%S')" 2>/dev/null || true
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "======================================================"
  echo "🎉 ¡LISTO! Tu sitio se está publicando en la nube."
  echo ""
  echo "🌐 Tu sitio web en vivo:"
  echo "   https://thegarageplaya.pages.dev"
  echo ""
  echo "📱 Tu panel de administración en vivo:"
  echo "   https://thegarageplaya.pages.dev/admin/"
  echo "======================================================"
else
  echo ""
  echo "⚠️ Si te pide usuario o contraseña de GitHub la primera vez:"
  echo "1. Asegúrate de haber creado el repositorio 'the-garage' en github.com/new"
  echo "2. Ingresa tus credenciales de GitHub para autorizar la subida."
fi

echo ""
read -p "Presiona Enter para cerrar esta ventana..."
