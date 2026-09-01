#!/bin/bash
# ==============================================================================
# The Garage — Abrir Panel de Administración Local en Mac (Doble Clic)
# ==============================================================================

cd "$(dirname "$0")"

echo "======================================================"
echo "🚲 INICIANDO PANEL DE ADMINISTRACIÓN LOCAL — THE GARAGE"
echo "======================================================"
echo ""
echo "Iniciando servidor de edición local..."

# Iniciar decap-server en segundo plano para permitir guardar cambios en tus archivos locales
(npx --yes decap-server) &
SERVER_PID=$!

# Abrir el panel de administración en el navegador
(sleep 3 && open "http://localhost:4321/admin/") &

echo "✅ Abriendo http://localhost:4321/admin/ en tu navegador..."
echo "ℹ️  Para cerrar el panel de administración, cierra esta ventana."
echo ""
echo "------------------------------------------------------"

# Esperar a que el usuario cierre la ventana y limpiar el proceso
trap "kill $SERVER_PID" EXIT
wait $SERVER_PID
