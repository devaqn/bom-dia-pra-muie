#!/bin/bash

echo "════════════════════════════════════════"
echo "🧹 LIMPEZA DE SESSÃO DO WHATSAPP"
echo "════════════════════════════════════════"
echo ""

# Verifica se a pasta auth_info existe
if [ -d "auth_info" ]; then
    echo "📁 Pasta auth_info encontrada"
    echo "🗑️  Removendo sessão antiga..."
    rm -rf auth_info
    echo "✅ Sessão removida com sucesso!"
else
    echo "ℹ️  Pasta auth_info não encontrada (nada para limpar)"
fi

echo ""
echo "════════════════════════════════════════"
echo "✨ Pronto! Agora execute:"
echo "   pm2 restart bom-dia-pra-muie"
echo "   OU"
echo "   node index.js"
echo "════════════════════════════════════════"








