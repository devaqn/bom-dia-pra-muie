# ❓ Perguntas Frequentes (FAQ)

## 📱 WhatsApp e Conexão

### P: O QR Code fica expirando, é normal?

R: Sim, o QR Code expira após alguns segundos. Você precisa escanear rapidamente. Se expirar, o sistema gera um novo automaticamente.

### P: Preciso manter o WhatsApp do celular online?

R: Não! Depois de conectar via QR Code, o sistema funciona independentemente. Seu celular pode estar offline.

### P: Posso usar o mesmo número em múltiplos dispositivos?

R: Sim, o WhatsApp permite até 4 dispositivos conectados simultaneamente (celular + web/desktop/automação).

### P: O que acontece se eu desconectar manualmente?

R: O sistema tentará reconectar automaticamente. Se você desconectou via app, será necessário escanear o QR Code novamente.

### P: Meu WhatsApp foi desconectado sozinho, por quê?

R: Pode acontecer por:
- Inatividade prolongada
- Atualização do WhatsApp no celular
- Mudança de senha/segurança
- Excesso de dispositivos conectados

**Solução**: Reconectar via QR Code.

---

## ⚙️ Configuração

### P: Como alterar os horários das mensagens?

R: Edite `config.js`, seção `HORARIOS`:

```javascript
const HORARIOS = {
  BOM_DIA: '0 6 * * 1-5', // 06:00 ao invés de 05:00
  ANTICONCEPCIONAL: '30 19 * * *', // 19:30 ao invés de 20:00
};
```

### P: Como adicionar novas mensagens?

R: Em `config.js`, adicione ao array correspondente:

```javascript
const MENSAGENS_BOM_DIA = [
  'Mensagem existente 1',
  'Mensagem existente 2',
  'Sua nova mensagem aqui!', // ⬅️ Adicione aqui
];
```

### P: Posso desativar o bom dia nos fins de semana?

R: Sim! Já está configurado assim por padrão:
- `'0 5 * * 1-5'` = segunda a sexta (1-5)
- Para incluir sábado: `'0 5 * * 1-6'`
- Para todos os dias: `'0 5 * * *'`

### P: Como mudar o tempo de espera por resposta?

R: Em `config.js`:

```javascript
const HORARIOS = {
  TIMEOUT_RESPOSTA: 45, // 45 minutos ao invés de 30
};
```

---

## 🔧 Funcionamento

### P: O que acontece se ela responder depois do timeout?

R: O sistema já terá considerado "sem resposta" e avisado o admin. A resposta será ignorada para aquele dia específico.

### P: E se ela responder algo não reconhecido?

R: O sistema registra nos logs que não reconheceu a resposta. Configure mais palavras-chave em `PALAVRAS_CHAVE` no `config.js`.

### P: Posso testar as mensagens antes?

R: Sim! Execute `node index.js` e espere conectar. Você pode:
1. Comentar temporariamente os agendamentos
2. Chamar as funções manualmente
3. Alterar horários para minutos à frente

### P: As mensagens são enviadas mesmo se o servidor reiniciar?

R: Sim! O PM2 garante que o processo reinicie automaticamente. O banco de dados persiste os envios do dia.

### P: Vai enviar mensagem duplicada se eu reiniciar o sistema?

R: Não! O sistema verifica no banco de dados se já enviou hoje antes de enviar novamente.

---

## 💾 Banco de Dados

### P: Onde ficam salvos os dados?

R: No arquivo `whatsapp_automation.db` (SQLite) na pasta do projeto.

### P: Posso deletar o banco de dados?

R: Sim, mas perderá todo o histórico. O sistema criará um novo automaticamente.

### P: Como fazer backup do banco?

```bash
cp whatsapp_automation.db whatsapp_automation.db.backup
```

### P: Como ver o histórico completo?

```bash
sqlite3 whatsapp_automation.db
SELECT * FROM historico_mensagens ORDER BY criado_em DESC LIMIT 50;
.quit
```

---

## 🖥️ Servidor e PM2

### P: O servidor precisa ficar ligado 24/7?

R: Sim! Para enviar mensagens nos horários programados, o servidor deve estar sempre online.

### P: Como ver se está rodando?

```bash
pm2 status
```

### P: O sistema reinicia automaticamente após crash?

R: Sim! O PM2 reinicia automaticamente se houver erro ou crash.

### P: E se o servidor reiniciar (queda de energia)?

R: Configure o PM2 startup:
```bash
pm2 startup
pm2 save
```

Assim o PM2 inicia automaticamente com o sistema.

### P: Como atualizar o código sem perder conexão?

```bash
# Faça as alterações no código
# Depois:
pm2 restart whatsapp-automation
```

---

## 🔒 Segurança

### P: A pasta auth_info contém o quê?

R: As credenciais de autenticação do WhatsApp. **NUNCA compartilhe esta pasta!**

### P: Posso versionar no Git?

R: **NÃO!** A pasta `auth_info/` e o arquivo `.db` devem estar no `.gitignore`.

### P: Alguém pode interceptar as mensagens?

R: As mensagens usam a criptografia E2E do próprio WhatsApp. O Baileys apenas usa a API oficial.

### P: É seguro deixar rodando?

R: Sim, mas tome precauções:
- Use servidor seguro (firewall, SSH)
- Não compartilhe `auth_info/`
- Mantenha o sistema atualizado

---

## 🐛 Problemas Comuns

### P: Erro "Cannot find module '@whiskeysockets/baileys'"

R: Execute `npm install` novamente.

### P: Erro ao enviar mensagem

R: Verifique:
1. WhatsApp está conectado? (`pm2 logs`)
2. Números estão corretos em `config.js`?
3. Formato: `5581999999999` (sem espaços)

### P: Mensagens não estão sendo enviadas no horário

R: Verifique:
1. Timezone está correto em `index.js`?
2. Horário do servidor está correto? (`date`)
3. Logs do PM2 mostram erros? (`pm2 logs`)

### P: Sistema usa muita memória/CPU

R: O sistema é leve (<100MB RAM). Se estiver alto:
1. Reinicie: `pm2 restart whatsapp-automation`
2. Verifique logs por loops infinitos
3. Considere limpar banco antigo

### P: Erro "ECONNREFUSED" ou "Network error"

R: Problema de rede. Verifique:
1. Servidor tem internet?
2. Firewall bloqueando?
3. Proxy configurado?

---

## 📊 Monitoramento

### P: Como saber se enviou as mensagens?

R: Veja os logs:
```bash
pm2 logs whatsapp-automation
```

Ou o banco de dados:
```bash
sqlite3 whatsapp_automation.db
SELECT * FROM mensagens_bom_dia ORDER BY data DESC LIMIT 5;
.quit
```

### P: Como receber alertas se o sistema cair?

R: Configure monitoramento:
- PM2 Plus (pago): https://pm2.io
- Uptimerobot (grátis): https://uptimerobot.com
- Script customizado com email/telegram

### P: Posso ver estatísticas?

R: Sim! Ao conectar, o sistema mostra estatísticas. Você também pode consultar:
```javascript
database.obterEstatisticas()
```

---

## 🔄 Manutenção

### P: Com que frequência devo fazer backup?

R: Recomendado:
- Backup automático semanal do banco
- Backup antes de atualizações
- Guardar por pelo menos 30 dias

### P: Como atualizar o Baileys?

```bash
npm update @whiskeysockets/baileys
pm2 restart whatsapp-automation
```

### P: Preciso atualizar regularmente?

R: Recomendado verificar atualizações mensalmente:
```bash
npm outdated
```

### P: Como migrar para outro servidor?

1. Backup completo da pasta do projeto
2. Copie para novo servidor
3. Execute `npm install`
4. **Importante**: Copie a pasta `auth_info/` (ou reconecte via QR)
5. Configure PM2 novamente

---

## 🎯 Personalização Avançada

### P: Posso adicionar mais fluxos de conversa?

R: Sim! Siga o padrão dos fluxos existentes:
1. Adicione configuração em `config.js`
2. Crie função em `index.js`
3. Configure cron job
4. Gerencie estado se necessário

### P: Posso enviar imagens ou áudios?

R: Sim, o Baileys suporta. Você precisará modificar a função `enviarMensagem` para aceitar diferentes tipos de mídia.

### P: Posso integrar com outras APIs?

R: Sim! Você pode fazer requisições HTTP dentro das funções e integrar com qualquer API.

### P: Funciona com grupos?

R: Sim! Basta usar o ID do grupo ao invés do número. Para obter o ID, envie uma mensagem para o grupo e veja nos logs.

---

## 💡 Dicas

### ✅ Boas práticas

- Teste sempre em desenvolvimento antes de produção
- Mantenha backups regulares
- Monitore logs semanalmente
- Atualize dependências com cuidado
- Documente suas personalizações

### ⚠️ Evite

- Enviar spam (muitas mensagens)
- Compartilhar credenciais (`auth_info/`)
- Ignorar logs de erro
- Deixar sem backup
- Alterar código sem testar

---

## 🆘 Ainda com dúvidas?

1. Consulte o `README.md` completo
2. Veja os logs: `pm2 logs whatsapp-automation`
3. Teste em modo desenvolvimento: `node index.js`
4. Verifique a documentação do Baileys: https://github.com/WhiskeySockets/Baileys

---

**Última atualização**: Janeiro 2025
