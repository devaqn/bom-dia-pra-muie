# 🤖 Automação de WhatsApp - Lembretes Personalizados

Sistema de automação para envio de mensagens programadas via WhatsApp usando Node.js e Baileys.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Comandos PM2](#-comandos-pm2)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Troubleshooting](#-troubleshooting)

## ✨ Funcionalidades

### 1️⃣ Mensagem de Bom Dia
- **Horário**: 05:00 (configurável)
- **Dias**: Segunda a sexta-feira
- **Comportamento**:
  - Envia mensagem de bom dia variada
  - Deseja bom trabalho
  - Mensagens aleatórias de um array
  - Evita repetição imediata

### 2️⃣ Lembrete de Anticoncepcional
- **Horário**: 20:00 (configurável)
- **Dias**: Todos os dias
- **Comportamento**:
  1. Envia lembrete humanizado
  2. Aguarda resposta (30 minutos configurável)
  3. Se responder "tomei":
     - Registra data e hora
     - Pergunta se está tudo bem
     - Se sim: agradece e avisa admin
     - Se não: demonstra preocupação e avisa admin
  4. Se responder "não tomei":
     - Registra
     - Avisa admin imediatamente
  5. Se não responder:
     - Registra como "sem resposta"
     - Avisa admin após timeout

## 📦 Requisitos

- **Sistema Operacional**: Ubuntu Server 20.04+ (ou similar)
- **Node.js**: v16 ou superior
- **npm**: v7 ou superior
- **PM2**: Para gerenciamento de processo
- **WhatsApp**: Conta ativa com número válido

## 🚀 Instalação

### 1. Clonar/Baixar o projeto

```bash
# Navegue até o diretório desejado
cd /home/seu-usuario

# Copie a pasta do projeto para o servidor
# (pode usar scp, rsync, git clone, etc.)
```

### 2. Instalar dependências

```bash
cd whatsapp-automation
npm install
```

### 3. Instalar PM2 globalmente

```bash
sudo npm install -g pm2
```

## ⚙️ Configuração

### 1️⃣ Configurar números de telefone

Edite o arquivo `config.js`:

```javascript
const CONFIG = {
  // 👩 Número da namorada (quem recebe os lembretes)
  NAMORADA: '5581999999999', // ⬅️ ALTERE AQUI
  
  // 👨‍💻 Número do administrador (você - quem recebe os avisos)
  ADMIN: '5581988888888', // ⬅️ ALTERE AQUI
};
```

**Formato**: Use o código do país + DDD + número (sem espaços ou caracteres especiais)
- Exemplo Brasil: `5581987654321`

### 2️⃣ Ajustar horários (opcional)

No arquivo `config.js`, seção `HORARIOS`:

```javascript
const HORARIOS = {
  // Formato cron: minuto hora dia mês dia-da-semana
  BOM_DIA: '0 5 * * 1-5', // 05:00 de segunda a sexta
  ANTICONCEPCIONAL: '0 20 * * *', // 20:00 todos os dias
  TIMEOUT_RESPOSTA: 30, // 30 minutos para responder
};
```

**Exemplos de horários cron**:
- `0 6 * * 1-5` - 06:00 de segunda a sexta
- `30 19 * * *` - 19:30 todos os dias
- `0 8 * * 6,0` - 08:00 sábado e domingo

### 3️⃣ Personalizar mensagens (opcional)

No arquivo `config.js`, você pode:
- Adicionar/remover mensagens do array `MENSAGENS_BOM_DIA`
- Modificar mensagens em `MENSAGENS_ANTICONCEPCIONAL`
- Ajustar palavras-chave em `PALAVRAS_CHAVE`

### 4️⃣ Ajustar timezone (opcional)

No arquivo `index.js`, procure por:

```javascript
timezone: 'America/Sao_Paulo'
```

E altere conforme sua localização:
- `America/Sao_Paulo` - Brasília
- `America/Manaus` - Manaus
- `America/Fortaleza` - Fortaleza
- Lista completa: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

## 🎯 Uso

### Primeira execução

1. **Execute o sistema**:

```bash
node index.js
```

2. **Escaneie o QR Code**:
   - Um QR Code aparecerá no terminal
   - Abra o WhatsApp no celular
   - Vá em "Aparelhos conectados"
   - Escaneie o QR Code exibido

3. **Aguarde a confirmação**:
   - Você verá "✅ Conectado ao WhatsApp com sucesso!"
   - O sistema está pronto!

4. **Pare a execução** (Ctrl+C) e configure o PM2

### Executar com PM2 (produção)

```bash
# Inicia o processo
pm2 start ecosystem.config.js

# Salva a configuração para reiniciar automaticamente
pm2 save

# Configura PM2 para iniciar com o sistema
pm2 startup
# Execute o comando que o PM2 sugerir
```

## 🔧 Comandos PM2

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs whatsapp-automation

# Ver logs de erro apenas
pm2 logs whatsapp-automation --err

# Parar o processo
pm2 stop whatsapp-automation

# Reiniciar o processo
pm2 restart whatsapp-automation

# Remover o processo
pm2 delete whatsapp-automation

# Ver informações detalhadas
pm2 show whatsapp-automation

# Monitorar em tempo real
pm2 monit
```

## 📁 Estrutura do Projeto

```
whatsapp-automation/
├── index.js                    # Arquivo principal
├── config.js                   # ⚙️ CONFIGURAÇÕES (números, horários, mensagens)
├── whatsapp.js                 # Gerenciador do WhatsApp (Baileys)
├── database.js                 # Gerenciador do banco de dados
├── estado.js                   # Controle de estados dos fluxos
├── utils.js                    # Funções utilitárias
├── package.json                # Dependências do projeto
├── ecosystem.config.js         # Configuração do PM2
├── .gitignore                  # Arquivos ignorados pelo Git
├── README.md                   # Este arquivo
├── auth_info/                  # 🔐 Sessão do WhatsApp (gerada automaticamente)
├── logs/                       # Logs do PM2 (gerado automaticamente)
└── whatsapp_automation.db      # Banco de dados SQLite (gerado automaticamente)
```

## 🗃️ Banco de Dados

O sistema usa SQLite para armazenar:

- Histórico de mensagens de bom dia enviadas
- Registro de lembretes de anticoncepcional
- Status de cada lembrete (tomou/não tomou/sem resposta)
- Bem-estar reportado
- Histórico completo de mensagens

### Visualizar dados

```bash
# Instalar SQLite (se necessário)
sudo apt install sqlite3

# Abrir banco de dados
sqlite3 whatsapp_automation.db

# Ver tabelas
.tables

# Ver registros de anticoncepcional
SELECT * FROM lembretes_anticoncepcional ORDER BY data DESC LIMIT 10;

# Ver mensagens de bom dia
SELECT * FROM mensagens_bom_dia ORDER BY data DESC LIMIT 10;

# Sair
.quit
```

## 🔍 Troubleshooting

### Problema: QR Code não aparece

**Solução**:
```bash
# Instale a dependência do qrcode-terminal
npm install qrcode-terminal
```

### Problema: Erro "auth_info not found"

**Solução**:
- É normal na primeira execução
- O sistema criará a pasta automaticamente
- Escaneie o QR Code novamente

### Problema: Mensagens não estão sendo enviadas

**Verificações**:
1. Confira se os números estão corretos em `config.js`
2. Verifique se o timezone está correto
3. Veja os logs: `pm2 logs whatsapp-automation`
4. Verifique se está conectado: `pm2 status`

### Problema: Bot foi desconectado

**Solução**:
```bash
# Pare o PM2
pm2 stop whatsapp-automation

# Delete a pasta de autenticação
rm -rf auth_info/

# Reinicie
node index.js

# Escaneie o QR Code novamente
# Depois configure novamente com PM2
```

### Problema: Erro ao instalar dependências

**Solução**:
```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstale
npm install
```

### Problema: Sistema não reconhece respostas

**Verificação**:
- Confira `PALAVRAS_CHAVE` em `config.js`
- Adicione variações das respostas que ela usa
- Veja os logs para entender o que está sendo recebido

## 📊 Estatísticas

O sistema exibe estatísticas ao conectar:

```
📊 Estatísticas:
   Mensagens de bom dia: 45
   Lembretes enviados: 60
   Tomou e está bem: 55
   Tomou mas não está bem: 2
   Não tomou: 1
   Sem resposta: 2
```

## 🔒 Segurança

**IMPORTANTE**:

1. **NUNCA** compartilhe a pasta `auth_info/`
2. **NUNCA** versione no Git a pasta `auth_info/`
3. Mantenha o arquivo `whatsapp_automation.db` seguro
4. Use senhas fortes no servidor
5. Configure firewall adequadamente

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `pm2 logs whatsapp-automation`
2. Consulte a seção Troubleshooting
3. Verifique se todas as configurações estão corretas
4. Teste com `node index.js` antes de usar PM2

## 📝 Notas Importantes

- O sistema respeita limites do WhatsApp (mensagens não são spam)
- Volume extremamente baixo (2-3 mensagens/dia)
- Mensagens humanizadas com delays
- Não envia mídias ou links
- Código organizado e comentado
- Preparado para rodar 24/7

## 🔄 Atualizações Futuras

Para adicionar novos fluxos:

1. Adicione configurações em `config.js`
2. Crie funções específicas em `index.js`
3. Configure agendamento no `configurarAgendamentos()`
4. Atualize o controle de estado se necessário
5. Teste antes de colocar em produção

---

**Desenvolvido com ❤️ para automação pessoal**
