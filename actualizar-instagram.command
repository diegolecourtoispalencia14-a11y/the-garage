#!/bin/bash
# ==============================================================================
# THE GARAGE • BIKE EXPERTS | Sincronizador Autónomo de Instagram
# ==============================================================================
clear
echo "================================================================="
echo "  🚴 THE GARAGE • BIKE EXPERTS | SINCRONIZADOR DE INSTAGRAM"
echo "================================================================="
echo "Iniciando agente autónomo para extraer publicaciones en vivo..."
echo ""

cd "/Users/dlpo.c./Desktop/the-garage" || exit 1
node scripts/sync-instagram-live.mjs

echo ""
echo "================================================================="
echo "  ✅ PROCESO TERMINADO: La web ha sido actualizada en Cloudflare"
echo "================================================================="
sleep 3
