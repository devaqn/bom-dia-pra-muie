# 🚀 GUIA RÁPIDO - COMEÇAR AGORA!

## ✅ NÚMEROS JÁ CONFIGURADOS!

Seus números já estão prontos no sistema:
- **Namorada**: +55 81 8907-0413 ✅
- **Admin (você)**: +55 81 9819-1625 ✅

## 📝 O QUE FAZER (PASSO A PASSO)

### 1️⃣ Copiar a pasta para seu servidor

Coloque a pasta `whatsapp-automation` no seu servidor Ubuntu.

### 2️⃣ Entrar na pasta

```bash
cd whatsapp-automation
```

### 3️⃣ Instalar dependências

```bash
npm install
```

**IMPORTANTE**: Aguarde terminar! Pode demorar 1-2 minutos.

### 4️⃣ Executar pela primeira vez

```bash
node index.js
```

### 5️⃣ Escanear QR Code

1. Um QR Code vai aparecer no terminal
2. Abra WhatsApp no celular
3. Vá em: **Menu (3 pontinhos) → Aparelhos conectados**
4. Toque em: **Conectar um aparelho**
5. Aponte a câmera para o QR Code no terminal

### 6️⃣ Aguardar conexão

Você vai ver:
```
✅ Conectado ao WhatsApp com sucesso!
🎉 Sistema pronto e operacional!
```

**PRONTO! Já está funcionando!** 🎉

### 7️⃣ Parar o teste (Ctrl+C)

Pressione `Ctrl+C` para parar.

### 8️⃣ Rodar 24/7 com PM2

```bash
# Instalar PM2 (só precisa fazer 1 vez)
sudo npm install -g pm2

# Iniciar automação
pm2 start ecosystem.config.js

# Salvar para reiniciar automaticamente
pm2 save

# Configurar para iniciar com o sistema
pm2 startup
```

Execute o comando que o PM2 sugerir (algo como `sudo env PATH=...`)

## 🎯 PRONTO! ESTÁ FUNCIONANDO!

### Ver se está rodando:
```bash
pm2 status
```

### Ver logs (mensagens enviadas):
```bash
pm2 logs whatsapp-automation
```

### Parar:
```bash
pm2 stop whatsapp-automation
```

### Reiniciar:
```bash
pm2 restart whatsapp-automation
```

## ⏰ HORÁRIOS CONFIGURADOS

✅ **Bom dia**: Segunda a sexta, 05:00  
✅ **Anticoncepcional**: Todos os dias, 20:00  

## 💬 MENSAGENS

✅ **20 mensagens diferentes de bom dia** (sorteia uma por dia)  
✅ **20 mensagens diferentes de anticoncepcional** (sorteia uma por dia)  

## 🔄 O FLUXO DO ANTICONCEPCIONAL

**20:00** - Sistema envia lembrete  
↓  
Ela responde **"tomei"** ou **"sim"**  
↓  
Sistema pergunta: **"Está tudo bem com você?"**  
↓  
Ela responde **"sim"** ou **"estou bem"**  
↓  
Sistema agradece E **AVISA VOCÊ** que ela tomou e está bem ✅  

### Se ela NÃO responder em 30 minutos:
- Sistema **AVISA VOCÊ** automaticamente ⚠️

### Se ela disser que NÃO tomou:
- Sistema **AVISA VOCÊ** imediatamente ⚠️

### Se ela disser que NÃO está bem:
- Sistema demonstra preocupação
- **AVISA VOCÊ** para verificar ⚠️

## ✨ TUDO AUTOMÁTICO!

Você não precisa fazer NADA depois de configurar!

O sistema vai:
- ✅ Enviar bom dia automaticamente
- ✅ Enviar lembrete de anticoncepcional
- ✅ Conversar com ela
- ✅ Te avisar sobre tudo importante
- ✅ Salvar tudo no banco de dados

## 📱 VOCÊ VAI RECEBER AVISOS

Quando ela:
- ✅ Tomar e estiver bem → Você recebe confirmação
- ⚠️ Tomar e NÃO estiver bem → Você recebe alerta
- ⚠️ NÃO tomar → Você recebe alerta
- ⚠️ Não responder em 30min → Você recebe alerta

## 🆘 PROBLEMAS?

### QR Code expirou?
```bash
pm2 stop whatsapp-automation
rm -rf auth_info/
node index.js
# Escaneie novamente
pm2 restart whatsapp-automation
```

### Erro ao instalar?
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Não está enviando mensagens?
```bash
pm2 logs whatsapp-automation
```

Veja os logs e me avise o erro!

## ⚡ RESUMÃO

1. `cd whatsapp-automation`
2. `npm install`
3. `node index.js` (escanear QR)
4. `Ctrl+C` (depois de conectar)
5. `pm2 start ecosystem.config.js`
6. `pm2 save`
7. `pm2 startup` (seguir instruções)

**PRONTO! 24/7 RODANDO!** 🚀

---

**Dúvidas? Olhe o FAQ.md ou README.md**
