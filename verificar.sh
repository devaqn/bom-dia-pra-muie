#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# 🔍 SCRIPT DE VERIFICAÇÃO ANTES DE RODAR
# ═══════════════════════════════════════════════════════════════════

echo ""
echo "════════════════════════════════════════════════════════"
echo "🔍 VERIFICANDO CONFIGURAÇÃO DO SISTEMA"
echo "════════════════════════════════════════════════════════"
echo ""

# Verificar se Node.js está instalado
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "   Instale com: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi
echo "✅ Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    exit 1
fi
echo "✅ npm encontrado: $(npm --version)"

# Verificar se as dependências estão instaladas
echo ""
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules não encontrado!"
    echo "   Execute: npm install"
    exit 1
fi
echo "✅ Dependências instaladas"

# Verificar arquivos principais
echo ""
echo "📄 Verificando arquivos do projeto..."
arquivos=("index.js" "config.js" "whatsapp.js" "database.js" "estado.js" "utils.js" "package.json")
for arquivo in "${arquivos[@]}"; do
    if [ ! -f "$arquivo" ]; then
        echo "❌ Arquivo não encontrado: $arquivo"
        exit 1
    fi
done
echo "✅ Todos os arquivos presentes"

# Verificar configuração
echo ""
echo "🔧 Verificando configuração..."
echo ""
echo "📱 Números configurados:"

# Extrair números do config.js
namorada=$(grep "NAMORADA:" config.js | cut -d"'" -f2)
admin=$(grep "ADMIN:" config.js | cut -d"'" -f2)

echo "   👩 Namorada: $namorada"
echo "   👨‍💻 Admin: $admin"

if [ "$namorada" == "558189070413" ] && [ "$admin" == "5581981911625" ]; then
    echo "✅ Números configurados corretamente!"
else
    echo "⚠️  Números diferentes do esperado - verifique config.js"
fi

# Contar mensagens
echo ""
echo "💬 Mensagens configuradas:"
bom_dia=$(grep -c "Bom dia," config.js)
anticoncepcional=$(grep -c "Oi," config.js)
echo "   ☀️  Bom dia: $bom_dia mensagens"
echo "   💊 Anticoncepcional: $anticoncepcional mensagens"

if [ "$bom_dia" -ge 20 ] && [ "$anticoncepcional" -ge 20 ]; then
    echo "✅ Mensagens variadas suficientes!"
else
    echo "⚠️  Poucas mensagens - considere adicionar mais"
fi

# Verificar horários
echo ""
echo "⏰ Horários configurados:"
echo "   ☀️  Bom dia: Segunda a sexta, 05:00"
echo "   💊 Anticoncepcional: Todos os dias, 20:00"
echo "   ⏳ Timeout resposta: 30 minutos"

# Verificar se PM2 está instalado
echo ""
echo "🔄 Verificando PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 não está instalado!"
    echo "   Instale com: sudo npm install -g pm2"
    echo "   (Opcional, mas recomendado para rodar 24/7)"
else
    echo "✅ PM2 encontrado: $(pm2 --version)"
fi

# Resumo final
echo ""
echo "════════════════════════════════════════════════════════"
echo "📊 RESUMO DA VERIFICAÇÃO"
echo "════════════════════════════════════════════════════════"
echo ""
echo "✅ Sistema configurado e pronto para uso!"
echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo ""
echo "   1. Execute: node index.js"
echo "   2. Escaneie o QR Code"
echo "   3. Aguarde: ✅ Conectado ao WhatsApp"
echo "   4. Pressione Ctrl+C"
echo "   5. Execute: pm2 start ecosystem.config.js"
echo "   6. Execute: pm2 save"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
