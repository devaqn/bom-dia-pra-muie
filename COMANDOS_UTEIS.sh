#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# 🛠️ COMANDOS ÚTEIS - AUTOMAÇÃO WHATSAPP
# ═══════════════════════════════════════════════════════════════════
# Este arquivo contém comandos úteis para gerenciar a automação

# ═══════════════════════════════════════════════════════════════════
# PM2 - GERENCIAMENTO DE PROCESSOS
# ═══════════════════════════════════════════════════════════════════

# Iniciar a automação
pm2 start ecosystem.config.js

# Parar a automação
pm2 stop whatsapp-automation

# Reiniciar a automação
pm2 restart whatsapp-automation

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs whatsapp-automation

# Ver apenas erros
pm2 logs whatsapp-automation --err

# Ver linhas específicas de log
pm2 logs whatsapp-automation --lines 50

# Limpar logs
pm2 flush

# Ver informações detalhadas
pm2 show whatsapp-automation

# Monitorar recursos (CPU, memória)
pm2 monit

# Deletar processo (não remove arquivos)
pm2 delete whatsapp-automation

# Salvar configuração atual
pm2 save

# Listar todos os processos
pm2 list

# ═══════════════════════════════════════════════════════════════════
# BANCO DE DADOS - CONSULTAS ÚTEIS
# ═══════════════════════════════════════════════════════════════════

# Abrir banco de dados
sqlite3 whatsapp_automation.db

# Dentro do SQLite, você pode executar:

# Ver todas as tabelas
# .tables

# Ver últimos 10 lembretes
# SELECT * FROM lembretes_anticoncepcional ORDER BY data DESC LIMIT 10;

# Ver últimas mensagens de bom dia
# SELECT * FROM mensagens_bom_dia ORDER BY data DESC LIMIT 10;

# Ver histórico completo (últimas 20)
# SELECT * FROM historico_mensagens ORDER BY criado_em DESC LIMIT 20;

# Ver estatísticas de lembretes
# SELECT status, COUNT(*) as total FROM lembretes_anticoncepcional GROUP BY status;

# Ver lembretes de um mês específico
# SELECT * FROM lembretes_anticoncepcional WHERE data LIKE '2024-01%' ORDER BY data;

# Exportar dados para CSV
# .mode csv
# .output lembretes.csv
# SELECT * FROM lembretes_anticoncepcional;
# .output stdout

# Sair do SQLite
# .quit

# ═══════════════════════════════════════════════════════════════════
# MANUTENÇÃO E LIMPEZA
# ═══════════════════════════════════════════════════════════════════

# Ver espaço usado pelo projeto
du -sh /caminho/para/whatsapp-automation

# Limpar node_modules (caso precise reinstalar)
rm -rf node_modules package-lock.json
npm install

# Backup do banco de dados
cp whatsapp_automation.db whatsapp_automation.db.backup.$(date +%Y%m%d)

# Limpar logs antigos do PM2
pm2 flush

# Ver uso de disco
df -h

# Ver uso de memória
free -h

# ═══════════════════════════════════════════════════════════════════
# RECONECTAR WHATSAPP (se desconectar)
# ═══════════════════════════════════════════════════════════════════

# Parar PM2
pm2 stop whatsapp-automation

# Deletar autenticação
rm -rf auth_info/

# Executar manualmente para escanear QR
node index.js

# Depois de conectar, parar (Ctrl+C) e reiniciar com PM2
pm2 start ecosystem.config.js

# ═══════════════════════════════════════════════════════════════════
# TESTES MANUAIS
# ═══════════════════════════════════════════════════════════════════

# Executar em modo desenvolvimento (com logs detalhados)
node index.js

# Executar com nodemon (recarrega ao salvar)
npx nodemon index.js

# Testar apenas a conexão
node -e "const WhatsApp = require('./whatsapp'); const wa = new WhatsApp(); wa.iniciar();"

# ═══════════════════════════════════════════════════════════════════
# ATUALIZAÇÃO E SEGURANÇA
# ═══════════════════════════════════════════════════════════════════

# Verificar atualizações de dependências
npm outdated

# Atualizar dependências (cuidado!)
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix

# ═══════════════════════════════════════════════════════════════════
# MONITORAMENTO
# ═══════════════════════════════════════════════════════════════════

# Ver processos Node.js ativos
ps aux | grep node

# Ver uso de CPU e memória em tempo real
htop

# Ver logs do sistema
journalctl -u pm2-$(whoami) -f

# Ver espaço livre
df -h

# ═══════════════════════════════════════════════════════════════════
# PERMISSÕES E SEGURANÇA
# ═══════════════════════════════════════════════════════════════════

# Garantir permissões corretas
chmod 600 auth_info/*
chmod 755 *.js

# Ver quem pode acessar arquivos
ls -la

# ═══════════════════════════════════════════════════════════════════
# SCRIPTS RÁPIDOS
# ═══════════════════════════════════════════════════════════════════

# Reinício completo (usar com cuidado!)
pm2 stop whatsapp-automation && \
pm2 delete whatsapp-automation && \
pm2 start ecosystem.config.js && \
pm2 save

# Backup completo
tar -czf backup-whatsapp-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=logs \
  whatsapp-automation/

# Restaurar backup
tar -xzf backup-whatsapp-YYYYMMDD.tar.gz

# ═══════════════════════════════════════════════════════════════════
# INFORMAÇÕES DO SISTEMA
# ═══════════════════════════════════════════════════════════════════

# Ver versão do Node.js
node --version

# Ver versão do npm
npm --version

# Ver versão do PM2
pm2 --version

# Ver informações do sistema
uname -a

# Ver uptime do servidor
uptime

# ═══════════════════════════════════════════════════════════════════
# NOTAS
# ═══════════════════════════════════════════════════════════════════
#
# - Sempre faça backup antes de mudanças importantes
# - Teste em ambiente de desenvolvimento antes de produção
# - Monitore logs regularmente
# - Mantenha o sistema atualizado
# - Proteja a pasta auth_info/
#
# ═══════════════════════════════════════════════════════════════════
