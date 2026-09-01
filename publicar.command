#!/bin/bash
# ==============================================================================
# The Garage — Publicar / Sincronizar Cambios con Cloudflare (Doble Clic)
# ==============================================================================

cd "$(dirname "$0")"

echo "======================================================"
echo "🚲 PUBLICAR CAMBIOS — THE GARAGE"
echo "======================================================"
echo ""

# 1. Comprobar que el sitio compile sin errores
echo "🔍 1. Verificando que todo el código y las fotos estén bien..."
npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Error al compilar. Hay un detalle en alguna foto o archivo."
  echo "Corrige el detalle antes de publicar."
  read -p "Presiona Enter para cerrar..."
  exit 1
fi

echo "✅ Compilación exitosa."
echo ""

# 2. Subir a GitHub si hay repositorio inicializado
if [ -d ".git" ]; then
  echo "🚀 2. Subiendo actualización a GitHub y Cloudflare..."
  git add .
  git commit -m "Actualización de catálogo: $(date +'%d/%m/%Y %H:%M')"
  git push origin main
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "======================================================"
    echo "🎉 ¡LISTO! Tu sitio se está actualizando en Cloudflare Pages."
    echo "Tu web: https://thegarageplaya.pages.dev"
    echo "======================================================"
  else
    echo "⚠️ Hubo un aviso al subir con Git. Revisa tu conexión con GitHub."
  fi
else
  echo "ℹ️  La carpeta aún no tiene Git conectado a tu cuenta de GitHub."
  echo "Cuando conectes tu repositorio diegolecourtoispalencia14-a11y/the-garage,"
  echo "este script subirá los cambios con un solo clic."
fi

echo ""
read -p "Presiona Enter para cerrar esta ventana..."
