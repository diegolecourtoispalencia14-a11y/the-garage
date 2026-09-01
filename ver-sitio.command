#!/bin/bash
# ==============================================================================
# The Garage — Ver Sitio Web en tu Computadora (Doble Clic)
# ==============================================================================

# Nos posicionamos en la carpeta del proyecto
cd "$(dirname "$0")"

echo "======================================================"
echo "🚲 INICIANDO THE GARAGE — VISTA PREVIA LOCAL"
echo "======================================================"
echo ""

# Auto-reparación: Si no están instaladas las dependencias, las instala solo
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando componentes necesarios por primera vez..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ Ocurrió un problema al instalar. Revisa tu conexión a internet."
    read -p "Presiona Enter para salir..."
    exit 1
  fi
fi

# Abrir el navegador automáticamente en 2 segundos
(sleep 2 && open "http://localhost:4321") &

echo "✅ Abriendo http://localhost:4321 en tu navegador..."
echo "ℹ️  Para detener el servidor en cualquier momento, cierra esta ventana."
echo ""
echo "------------------------------------------------------"

# Iniciar servidor de desarrollo de Astro
npm run dev
