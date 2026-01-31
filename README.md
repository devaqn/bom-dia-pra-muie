# 🤖 Bot de Automação WhatsApp - Lembretes Personalizados

> Sistema automatizado de mensagens via WhatsApp para lembretes diários de bom dia e controle de anticoncepcional.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Baileys-25D366.svg)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Funciona](#-como-funciona)
- [Banco de Dados](#-banco-de-dados)
- [Manutenção](#-manutenção)
- [Troubleshooting](#-troubleshooting)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Este bot foi desenvolvido para automatizar lembretes importantes via WhatsApp, mantendo um acompanhamento inteligente e discreto de rotinas diárias. Ele envia mensagens programadas e interage de forma natural, armazenando todas as respostas em um banco de dados local.

### ✨ Diferenciais

- ✅ **Persistência de sessão** - Não pede QR Code após reiniciar o servidor
- ✅ **Comportamento humano** - Simula digitação e delays naturais
- ✅ **Inteligência contextual** - Entende respostas em linguagem natural
- ✅ **Notificações seletivas** - Marca como "lida" apenas mensagens do fluxo ativo
- ✅ **Banco de dados local** - Histórico completo e estatísticas
- ✅ **Notificações ao admin** - Alertas sobre status e respostas

---

## 🚀 Funcionalidades

### 1️⃣ **Mensagem de Bom Dia** ☀️

- **Quando:** Segunda a sexta-feira, às 05:00
- **O que faz:**
  - Envia mensagem de bom dia personalizada
  - Escolhe aleatoriamente entre várias mensagens configuradas
  - Simula digitação para parecer natural
  - Registra envio no banco de dados
  - Evita enviar duplicadas no mesmo dia

**Exemplo de mensagens:**
```
"Bom dia, meu amor! ☀️ Tenha um dia maravilhoso! 💕"
"Acordei pensando em você... Bom dia! 😘"
"Bom dia, linda! Que seu dia seja incrível! ❤️"
```

---

### 2️⃣ **Lembrete de Anticoncepcional** 💊

- **Quando:** Todos os dias, às 20:00
- **O que faz:**
  - Envia lembrete personalizado
  - Aguarda confirmação se tomou ou não
  - Pergunta sobre bem-estar (se tomou)
  - Notifica administrador sobre o status
  - Registra tudo no banco de dados

#### 📊 **Fluxo Completo:**

```
┌─────────────────────────────────────────────────────┐
│ 20:00 - Bot envia lembrete                         │
│ "Amor, já tomou o remédio hoje? 💊"                │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    [TOMOU]          [NÃO TOMOU]
        │                 │
        ▼                 ▼
┌───────────────┐  ┌──────────────────┐
│ Bot pergunta: │  │ Bot demonstra    │
│ "Como está    │  │ preocupação      │
│  se sentindo?"│  │ "Amor, não       │
└───────┬───────┘  │  esquece! ❤️"    │
        │          └────────┬─────────┘
   ┌────┴────┐              │
   │         │              │
 [BEM]   [MAL/ENJOADA]      │
   │         │              │
   ▼         ▼              ▼
┌──────┐ ┌────────┐  ┌────────────┐
│"Que  │ │"Fica   │  │ Admin      │
│ótimo!│ │tranquila│  │ recebe     │
│ ❤️"  │ │ Te amo"│  │ notificação│
└──┬───┘ └───┬────┘  └─────┬──────┘
   │         │              │
   └─────────┴──────────────┘
            │
            ▼
   ┌────────────────┐
   │ Admin recebe   │
   │ notificação    │
   │ com status     │
   └────────────────┘
```

#### 🔍 **Reconhecimento de Respostas:**

O bot entende linguagem natural através de palavras-chave:

**Se tomou:**
- "sim", "tomei", "já tomei", "tomado", "tô tomando"

**Se NÃO tomou:**
- "não", "nao", "esqueci", "ainda não", "vou tomar"

**Se está bem:**
- "bem", "normal", "ótima", "ok", "tranquila", "de boa"

**Se NÃO está bem:**
- "mal", "enjoada", "ruim", "não muito bem", "passando mal"

---

### 3️⃣ **Sistema de Notificações para Admin** 📧

O administrador recebe notificações automáticas sobre:

- ✅ **Tomou e está bem** - "Ela tomou o remédio às 20:05 e está se sentindo bem! ❤️"
- ⚠️ **Tomou mas não está bem** - "Ela tomou o remédio às 20:05 mas não está se sentindo bem 😟"
- ❌ **Não tomou** - "Atenção! Ela não tomou o remédio hoje às 20:05 ⚠️"
- ⏰ **Sem resposta** - "Ela não respondeu sobre o remédio após 30 minutos"

---

### 4️⃣ **Comportamento Inteligente** 🧠

#### **Marcação de Mensagens Como Lidas:**

O bot é **SELETIVO** sobre quais mensagens marca como lidas:

**❌ NÃO marca como lida:**
- Mensagens enviadas fora dos horários programados
- Mensagens quando não há fluxo ativo
- Mensagens de números desconhecidos

**✅ Marca como lida:**
- Respostas durante o fluxo do lembrete (20:00-20:30)
- Apenas quando reconhece a resposta corretamente

**Resultado:** Você continua recebendo notificações normais de mensagens aleatórias, mas as respostas do fluxo são automaticamente processadas.

---

### 5️⃣ **Timeout e Fallback** ⏱️

- **Tempo de espera:** 30 minutos (configurável)
- **O que acontece:**
  1. Bot envia lembrete às 20:00
  2. Aguarda resposta por 30 minutos
  3. Se não responder até 20:30:
     - Marca no banco como "sem_resposta"
     - Notifica o administrador
     - Finaliza o fluxo

---

## 🛠️ Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** v18+ - Runtime JavaScript
- **[@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)** - Biblioteca WhatsApp Web
- **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** - Banco de dados SQLite
- **[node-cron](https://github.com/node-cron/node-cron)** - Agendamento de tarefas
- **[pino](https://github.com/pinojs/pino)** - Logger de alta performance
- **[qrcode-terminal](https://github.com/gtanner/qrcode-terminal)** - QR Code no terminal
- **[PM2](https://pm2.keymetrics.io/)** - Gerenciador de processos

---

## 📋 Pré-requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- WhatsApp instalado no celular
- Servidor Linux (recomendado Ubuntu/Debian)
- PM2 (opcional, mas recomendado)

---

## 📥 Instalação

### 1️⃣ **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/whatsapp-automation.git
cd whatsapp-automation
```

### 2️⃣ **Instale as dependências**

```bash
npm install
```

### 3️⃣ **Instale o PM2 (opcional, mas recomendado)**

```bash
npm install -g pm2
```

---

## ⚙️ Configuração

### 1️⃣ **Configure os números (config.js)**

Abra o arquivo `config.js` e configure:

```javascript
CONFIG: {
  NAMORADA: '5581999999999',  // Número da pessoa que vai receber
  ADMIN: '5581988888888',      // Seu número (para notificações)
},
```

### 2️⃣ **Configure os horários (config.js)**

```javascript
HORARIOS: {
  BOM_DIA: '0 5 * * 1-5',           // Segunda a sexta, 05:00
  ANTICONCEPCIONAL: '0 20 * * *',   // Todos os dias, 20:00
  TIMEOUT_RESPOSTA: 30,              // 30 minutos de espera
},
```

### 3️⃣ **Personalize as mensagens (config.js)**

```javascript
MENSAGENS_BOM_DIA: [
  'Bom dia, meu amor! ☀️',
  'Acordei pensando em você... 😘',
  // Adicione quantas quiser!
],

MENSAGENS_ANTICONCEPCIONAL: {
  LEMBRETE: [
    'Amor, já tomou o remédio hoje? 💊',
    'Oi linda! Hora do remédio! 💕',
  ],
  // ... mais configurações
},
```

### 4️⃣ **Ajuste palavras-chave (config.js)**

Personalize as palavras que o bot reconhece:

```javascript
PALAVRAS_CHAVE: {
  TOMOU: ['sim', 'tomei', 'já tomei', 'tomado'],
  NAO_TOMOU: ['não', 'nao', 'esqueci', 'ainda não'],
  ESTA_BEM: ['bem', 'normal', 'ótima', 'ok', 'tranquila'],
  NAO_ESTA_BEM: ['mal', 'enjoada', 'ruim', 'não muito bem'],
},
```

---

## 🎮 Uso

### **Primeira Execução - Conectar ao WhatsApp**

```bash
node index.js
```

**O que vai acontecer:**
1. Bot inicializa
2. QR Code aparece no terminal
3. Abra WhatsApp no celular
4. Vá em **Dispositivos Conectados** > **Conectar dispositivo**
5. Escaneie o QR Code
6. Aguarde a confirmação: `✅ Conectado ao WhatsApp com sucesso!`

**Importante:** A sessão é salva automaticamente! Você SÓ precisa escanear o QR Code na primeira vez.

---

### **Executar com PM2 (recomendado)**

```bash
# Inicia o bot
pm2 start ecosystem.config.js

# Salva a configuração
pm2 save

# Habilita auto-start após reiniciar servidor
pm2 startup
# Siga as instruções que aparecerem

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs whatsapp-automation

# Parar o bot
pm2 stop whatsapp-automation

# Reiniciar o bot
pm2 restart whatsapp-automation

# Remover do PM2
pm2 delete whatsapp-automation
```

---

### **Verificar Sessão Salva**

Use o script utilitário para verificar se a sessão está OK:

```bash
node verificar_sessao.js
```

**Saída esperada:**
```
🔍 VERIFICADOR DE SESSÃO DO WHATSAPP
═══════════════════════════════════════════════════════════

✅ Diretório existe
✅ 5 arquivo(s) de sessão
✅ Credenciais válidas
✅ Permissões OK

🚀 O bot está pronto para reconectar automaticamente!
```

---

## 📁 Estrutura do Projeto

```
whatsapp-automation/
│
├── index.js                    # Arquivo principal - inicialização
├── whatsapp.js                 # Gerenciador de conexão WhatsApp
├── database.js                 # Gerenciador de banco de dados
├── config.js                   # Configurações (números, horários, mensagens)
├── estado.js                   # Controle de estado dos fluxos
├── utils.js                    # Funções utilitárias
├── verificar_sessao.js         # Script de verificação de sessão
│
├── auth_info/                  # Sessão do WhatsApp (criado automaticamente)
│   ├── creds.json             # Credenciais principais
│   └── *.json                 # Outros arquivos de sessão
│
├── whatsapp_automation.db      # Banco de dados SQLite
│
├── logs/                       # Logs do PM2
│   ├── error.log
│   └── output.log
│
├── ecosystem.config.js         # Configuração do PM2
├── package.json
├── package-lock.json
└── README.md                   # Este arquivo
```

---

## 🔧 Como Funciona

### **Arquitetura do Sistema**

```
┌─────────────────────────────────────────────────────────┐
│                    INDEX.JS                             │
│              (Orquestrador Principal)                   │
└───────┬─────────────────────────────────────┬───────────┘
        │                                     │
        ▼                                     ▼
┌───────────────┐                    ┌────────────────┐
│  WHATSAPP.JS  │◄───────────────────┤   CONFIG.JS    │
│   (Conexão)   │                    │ (Configurações)│
└───────┬───────┘                    └────────────────┘
        │
        ├──► ENVIA MENSAGENS
        │    - Bom dia (cron: 05:00)
        │    - Lembrete (cron: 20:00)
        │
        └──► RECEBE RESPOSTAS
             │
             ▼
      ┌──────────────┐
      │  ESTADO.JS   │
      │ (Controle de │
      │   Fluxo)     │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │ DATABASE.JS  │
      │ (Armazena    │
      │  tudo)       │
      └──────────────┘
```

### **Fluxo de Execução**

#### **1. Inicialização**

```javascript
1. index.js inicia
2. Valida configurações (números, mensagens)
3. whatsapp.js verifica se tem sessão salva
   ├─ SIM → Conecta automaticamente
   └─ NÃO → Gera QR Code
4. database.js inicializa banco SQLite
5. Configura cron jobs (agendamentos)
6. Sistema fica aguardando...
```

#### **2. Envio de Bom Dia (05:00)**

```javascript
1. Cron dispara às 05:00
2. Verifica se já enviou hoje (evita duplicação)
3. Escolhe mensagem aleatória
4. Simula digitação (1-5 segundos)
5. Envia mensagem
6. Registra no banco de dados
```

#### **3. Envio de Lembrete (20:00)**

```javascript
1. Cron dispara às 20:00
2. Verifica se já enviou hoje
3. Escolhe mensagem aleatória
4. Simula digitação
5. Envia lembrete: "Já tomou o remédio? 💊"
6. Registra no banco
7. INICIA FLUXO DE CONTROLE:
   ├─ estado.js marca: "aguardando_tomou"
   └─ Define timeout de 30 minutos
```

#### **4. Processamento de Resposta**

```javascript
1. Mensagem recebida
2. Verificações:
   ├─ É da namorada? → SIM
   ├─ Há fluxo ativo? → SIM
   └─ Qual etapa? → "aguardando_tomou"
3. Analisa a resposta:
   ├─ Contém "sim"/"tomei"? → TOMOU
   └─ Contém "não"/"esqueci"? → NÃO TOMOU
4. MARCA COMO LIDA (só agora!)
5. Executa ação correspondente
6. Registra no banco
```

---

## 🗄️ Banco de Dados

### **Tabelas Criadas Automaticamente**

#### **1. mensagens_bom_dia**

Registra envios de bom dia:

```sql
CREATE TABLE mensagens_bom_dia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL UNIQUE,           -- 2024-01-30
  mensagem_enviada TEXT NOT NULL,       -- "Bom dia, amor! ☀️"
  horario_envio TEXT NOT NULL,          -- 05:00:00
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **2. lembretes_anticoncepcional**

Registra lembretes e respostas:

```sql
CREATE TABLE lembretes_anticoncepcional (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT NOT NULL UNIQUE,            -- 2024-01-30
  horario_lembrete TEXT NOT NULL,       -- 20:00:00
  horario_resposta TEXT,                -- 20:05:23
  status TEXT NOT NULL,                 -- Ver status abaixo
  respondeu_bem TEXT,                   -- 'sim' ou 'nao'
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Status possíveis:**
- `aguardando` - Enviou lembrete, aguardando resposta
- `tomou_aguardando_bem_estar` - Respondeu que tomou, aguardando se está bem
- `tomou_bem` - Tomou e está se sentindo bem ✅
- `tomou_mal` - Tomou mas não está se sentindo bem ⚠️
- `nao_tomou` - Não tomou o remédio ❌
- `sem_resposta` - Não respondeu no prazo ⏰

#### **3. historico_mensagens**

Histórico completo de todas as mensagens:

```sql
CREATE TABLE historico_mensagens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,                   -- Tipo de mensagem
  de TEXT NOT NULL,                     -- Número de quem enviou
  para TEXT NOT NULL,                   -- Número de quem recebeu
  mensagem TEXT NOT NULL,               -- Conteúdo
  data_hora TEXT NOT NULL,              -- 2024-01-30 20:05:23
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Tipos de mensagem:**
- `bom_dia`
- `anticoncepcional_lembrete`
- `anticoncepcional_resposta`
- `aviso_admin`

---

### **Consultas Úteis**

#### Ver estatísticas gerais:

```javascript
const stats = database.obterEstatisticas();

console.log(stats);
// {
//   totalBomDia: 45,
//   totalLembretes: 30,
//   tomouBem: 25,
//   tomouMal: 3,
//   naoTomou: 1,
//   semResposta: 1
// }
```

#### Ver histórico de um dia específico:

```sql
SELECT * FROM lembretes_anticoncepcional 
WHERE data = '2024-01-30';
```

#### Ver todas as mensagens trocadas:

```sql
SELECT * FROM historico_mensagens 
ORDER BY criado_em DESC 
LIMIT 50;
```

---

## 🔧 Manutenção

### **Ver Logs**

```bash
# Logs em tempo real
pm2 logs whatsapp-automation

# Últimas 100 linhas
pm2 logs whatsapp-automation --lines 100

# Apenas erros
pm2 logs whatsapp-automation --err

# Limpar logs antigos
pm2 flush
```

### **Backup do Banco de Dados**

```bash
# Fazer backup
cp whatsapp_automation.db whatsapp_automation_backup_$(date +%Y%m%d).db

# Restaurar backup
cp whatsapp_automation_backup_20240130.db whatsapp_automation.db
```

### **Verificar Status da Sessão**

```bash
node verificar_sessao.js
```

### **Limpar Sessão (forçar novo QR Code)**

```bash
# Pare o bot
pm2 stop whatsapp-automation

# Delete a sessão
rm -rf auth_info/

# Reinicie o bot
pm2 restart whatsapp-automation

# Escaneie o novo QR Code
pm2 logs whatsapp-automation
```

---

## 🐛 Troubleshooting

### **Problema: Bot pede QR Code toda vez que reinicia**

**Causa:** Sessão não está sendo salva corretamente.

**Solução:**
```bash
# 1. Verifique permissões
chmod -R 755 auth_info/

# 2. Verifique se o diretório existe
ls -la auth_info/

# 3. Use o verificador
node verificar_sessao.js

# 4. Se necessário, leia o guia completo
cat GUIA_PERSISTENCIA.md
```

---

### **Problema: Bot não marca mensagens como lida**

**Causa:** Comportamento normal! O bot só marca como lida durante fluxo ativo.

**Explicação:**
- Mensagens normais (fora do horário) → NÃO marca como lida
- Respostas ao lembrete → Marca como lida

Isso é intencional para você continuar recebendo notificações normais.

---

### **Problema: Bot não reconhece resposta**

**Causa:** Resposta não contém palavras-chave configuradas.

**Solução:**
1. Abra `config.js`
2. Adicione mais palavras em `PALAVRAS_CHAVE`:

```javascript
PALAVRAS_CHAVE: {
  TOMOU: ['sim', 'tomei', 'já tomei', 'tomado', 'tô tomando', 'acabei de tomar'],
  // Adicione variações que ela costuma usar
},
```

---

### **Problema: Bot desconecta após alguns dias**

**Causa:** WhatsApp Web foi desconectado manualmente no celular.

**Solução:**
O bot detecta isso automaticamente e limpa a sessão. Basta:
1. Verificar os logs: `pm2 logs`
2. Escanear novo QR Code quando solicitado

---

### **Problema: Mensagens não estão sendo enviadas**

**Verificações:**

```bash
# 1. Bot está rodando?
pm2 status

# 2. Está conectado?
pm2 logs whatsapp-automation | grep "Conectado"

# 3. Horários estão corretos?
cat config.js | grep HORARIOS

# 4. Número está correto?
cat config.js | grep NAMORADA

# 5. Já enviou hoje?
# (bot evita duplicação)
```

---

### **Problema: Erro "WhatsApp não está conectado"**

**Solução:**

```bash
# Reinicie o bot
pm2 restart whatsapp-automation

# Se persistir, limpe a sessão
rm -rf auth_info/
pm2 restart whatsapp-automation
```

---

## 📊 Monitoramento

### **Dashboard do PM2**

```bash
# Instalar PM2 Plus (opcional)
pm2 install pm2-logrotate

# Configurar rotação de logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Ver dashboard web
pm2 plus
```

### **Verificação Diária Recomendada**

```bash
# Status geral
pm2 status

# Últimos logs (verificar erros)
pm2 logs whatsapp-automation --lines 50 --nostream

# Verificar sessão
node verificar_sessao.js
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ⚠️ Disclaimer

Este bot foi desenvolvido para uso pessoal e educacional. O uso de automação no WhatsApp pode violar os Termos de Serviço do WhatsApp. Use por sua conta e risco.

**Recomendações:**
- Não use para spam ou mensagens em massa
- Respeite a privacidade das pessoas
- Use apenas em conversas onde há consentimento
- Mantenha o bot privado (não compartilhe acesso)

---

## 📞 Suporte

Encontrou um bug? Tem alguma dúvida?

1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Leia o arquivo `GUIA_PERSISTENCIA.md`
3. Abra uma [Issue](https://github.com/seu-usuario/whatsapp-automation/issues)

---

<div align="center">

**Desenvolvido com ❤️ para quem você ama**

⭐ Se este projeto foi útil para você, considere dar uma estrela!

</div>