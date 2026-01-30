# 🚀 Guia Rápido de Instalação

Siga estes passos para colocar a automação funcionando rapidamente.

## ⚡ Instalação Rápida

### 1. Preparar o servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2. Configurar o projeto

```bash
# Navegar até a pasta do projeto
cd whatsapp-automation

# Instalar dependências
npm install

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### 3. Configurar números

Edite `config.js` e altere:

```javascript
NAMORADA: '5581999999999',  // ⬅️ Coloque o número dela aqui
ADMIN: '5581988888888',     // ⬅️ Coloque seu número aqui
```

### 4. Primeira execução

```bash
# Execute para gerar o QR Code
node index.js
```

**Escaneie o QR Code com WhatsApp:**
1. Abra WhatsApp no celular
2. Menu → Aparelhos conectados
3. Conectar um aparelho
4. Escaneie o QR Code no terminal

Aguarde ver: `✅ Conectado ao WhatsApp com sucesso!`

Depois pressione `Ctrl+C` para parar.

### 5. Configurar PM2

```bash
# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar para iniciar com o sistema
pm2 startup
# Execute o comando sugerido pelo PM2

# Verificar se está rodando
pm2 status
```

## ✅ Pronto!

O sistema está funcionando! 🎉

### Verificar logs

```bash
pm2 logs whatsapp-automation
```

### Comandos úteis

```bash
pm2 status                      # Ver status
pm2 restart whatsapp-automation # Reiniciar
pm2 stop whatsapp-automation    # Parar
pm2 logs whatsapp-automation    # Ver logs
```

## ⏰ Horários Configurados

Por padrão:
- **Bom dia**: Segunda a sexta, 05:00
- **Anticoncepcional**: Todos os dias, 20:00

Para alterar, edite `HORARIOS` em `config.js`.

## 🆘 Problemas?

Consulte o arquivo `README.md` completo para troubleshooting detalhado.

### Problema comum: QR Code expirado

Se o QR Code expirar:

```bash
pm2 stop whatsapp-automation
rm -rf auth_info/
node index.js
# Escaneie novamente
# Depois: pm2 restart whatsapp-automation
```

---

**Tudo funcionando? Aproveite a automação! 🤖💕**
