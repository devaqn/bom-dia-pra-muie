const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

class WhatsAppManager {
  constructor() {
    this.sock = null;
    this.qrGerado = false;
    this.conectado = false;
    this.callbacks = {
      onConectado: null,
      onDesconectado: null,
      onMensagemRecebida: null,
      onQR: null,
    };
    
    // 🔧 CORREÇÃO: Define caminho absoluto para auth_info
    this.authPath = path.join(__dirname, 'auth_info');
    
    // 🔧 CORREÇÃO: Garante que o diretório existe
    this.garantirDiretorioAuth();
  }

  /**
   * 🔧 NOVO: Garante que o diretório de autenticação existe
   */
  garantirDiretorioAuth() {
    if (!fs.existsSync(this.authPath)) {
      fs.mkdirSync(this.authPath, { recursive: true });
      console.log('📁 Diretório de autenticação criado:', this.authPath);
    }
  }

  /**
   * 🔧 NOVO: Verifica se existe sessão salva
   */
  temSessaoSalva() {
    const credsPath = path.join(this.authPath, 'creds.json');
    const existe = fs.existsSync(credsPath);
    
    if (existe) {
      console.log('✅ Sessão encontrada em:', credsPath);
    } else {
      console.log('❌ Nenhuma sessão encontrada');
    }
    
    return existe;
  }

  /**
   * 🔧 MODIFICADO: Limpa sessão antiga apenas quando necessário
   */
  limparSessao() {
    try {
      if (fs.existsSync(this.authPath)) {
        fs.rmSync(this.authPath, { recursive: true, force: true });
        console.log('🧹 Sessão antiga removida');
        
        // Recria o diretório
        this.garantirDiretorioAuth();
      }
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
    }
  }

  /**
   * Desempacota mensagens encapsuladas (ephemeral/viewOnce/edited).
   * @param {object} mensagem
   * @returns {object|null}
   */
  extrairMensagemInterna(mensagem) {
    if (!mensagem) return null;

    if (mensagem.ephemeralMessage?.message) {
      return this.extrairMensagemInterna(mensagem.ephemeralMessage.message);
    }

    if (mensagem.viewOnceMessage?.message) {
      return this.extrairMensagemInterna(mensagem.viewOnceMessage.message);
    }

    if (mensagem.viewOnceMessageV2?.message) {
      return this.extrairMensagemInterna(mensagem.viewOnceMessageV2.message);
    }

    if (mensagem.viewOnceMessageV2Extension?.message) {
      return this.extrairMensagemInterna(mensagem.viewOnceMessageV2Extension.message);
    }

    if (mensagem.editedMessage?.message) {
      return this.extrairMensagemInterna(mensagem.editedMessage.message);
    }

    if (mensagem.protocolMessage?.editedMessage?.message) {
      return this.extrairMensagemInterna(mensagem.protocolMessage.editedMessage.message);
    }

    if (mensagem.documentWithCaptionMessage?.message) {
      return this.extrairMensagemInterna(mensagem.documentWithCaptionMessage.message);
    }

    return mensagem;
  }

  /**
   * Extrai texto de diferentes tipos de mensagens recebidas.
   * @param {object} msg
   * @returns {string}
   */
  extrairTextoMensagem(msg) {
    const conteudo = this.extrairMensagemInterna(msg?.message);
    if (!conteudo) return '';

    const texto =
      conteudo.conversation ||
      conteudo.extendedTextMessage?.text ||
      conteudo.imageMessage?.caption ||
      conteudo.videoMessage?.caption ||
      conteudo.buttonsResponseMessage?.selectedDisplayText ||
      conteudo.buttonsResponseMessage?.selectedButtonId ||
      conteudo.listResponseMessage?.singleSelectReply?.selectedRowId ||
      conteudo.listResponseMessage?.title ||
      conteudo.templateButtonReplyMessage?.selectedDisplayText ||
      conteudo.templateButtonReplyMessage?.selectedId ||
      conteudo.interactiveResponseMessage?.body?.text ||
      conteudo.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
      '';

    return typeof texto === 'string' ? texto.trim() : '';
  }
  async iniciar() {
    try {
      console.log('🚀 Iniciando conexão com WhatsApp...');
      
      // 🔧 CORREÇÃO: Verifica se tem sessão antes de tentar conectar
      const temSessao = this.temSessaoSalva();
      
      if (temSessao) {
        console.log('🔄 Tentando reconectar com sessão salva...');
      } else {
        console.log('🆕 Primeira conexão - QR Code será gerado');
      }

      // 🔧 CORREÇÃO: Usa caminho absoluto definido no construtor
      const { state, saveCreds } = await useMultiFileAuthState(this.authPath);

      // Obtém a versão mais recente do Baileys
      const { version } = await fetchLatestBaileysVersion();

      // Cria o socket do WhatsApp
      this.sock = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['whatsapp-routine-bot', 'Chrome', '10.0'],
        generateHighQualityLinkPreview: true,
        // 🔧 Configurações para não marcar como lido automaticamente
        markOnlineOnConnect: false,
        syncFullHistory: false,
        // 🔧 NOVO: Configurações para melhor persistência
        defaultQueryTimeoutMs: undefined,
        keepAliveIntervalMs: 30000, // Mantém conexão viva a cada 30s
      });

      // ═══════════════════════════════════════════════════════════════════
      // EVENTOS DO WHATSAPP
      // ═══════════════════════════════════════════════════════════════════

      // 🔧 MODIFICADO: Salva credenciais com log para debug
      this.sock.ev.on('creds.update', async () => {
        await saveCreds();
        console.log('💾 Credenciais atualizadas e salvas');
      });

      // Evento: Atualização de conexão
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Exibe QR Code quando disponível
        if (qr && !this.qrGerado) {
          console.log('\n═══════════════════════════════════════');
          console.log('📱 ESCANEIE O QR CODE ABAIXO:');
          console.log('═══════════════════════════════════════\n');
          qrcode.generate(qr, { small: true });
          console.log('\n═══════════════════════════════════════');
          console.log('⏳ Aguardando leitura do QR Code...');
          console.log('═══════════════════════════════════════\n');
          
          this.qrGerado = true;
          
          if (this.callbacks.onQR) {
            this.callbacks.onQR(qr);
          }
        }

        // Trata conexão fechada
        if (connection === 'close') {
          this.conectado = false;
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          
          console.log('❌ Conexão fechada. Código:', statusCode);
          console.log('   Motivo:', lastDisconnect?.error?.message);
          
          // 🔧 MODIFICADO: Tratamento melhorado de erros
          if (statusCode === DisconnectReason.loggedOut) {
            console.log('🚪 Deslogado do WhatsApp');
            console.log('🧹 Limpando sessão...');
            this.limparSessao();
            console.log('📱 Execute novamente para gerar novo QR Code');
            
          } else if (statusCode === 401 || statusCode === 403) {
            console.log('🔐 Erro de autenticação detectado');
            console.log('🧹 Limpando sessão corrompida...');
            this.limparSessao();
            console.log('🔄 Aguardando 3 segundos para reiniciar...');
            setTimeout(() => this.iniciar(), 3000);
            
          } else if (statusCode === 440) {
            console.log('📱 WhatsApp Web desconectado pelo celular');
            console.log('🧹 Limpando sessão...');
            this.limparSessao();
            console.log('📱 Execute novamente para gerar novo QR Code');
            
          } else if (shouldReconnect) {
            console.log('🔄 Tentando reconectar em 5 segundos...');
            setTimeout(() => this.iniciar(), 5000);
            
          } else {
            console.log('🚪 Conexão encerrada');
          }
          
          if (this.callbacks.onDesconectado) {
            this.callbacks.onDesconectado(lastDisconnect?.error);
          }
        }

        // Trata conexão aberta
        if (connection === 'open') {
          this.conectado = true;
          this.qrGerado = false;
          console.log('\n✅ Conectado ao WhatsApp com sucesso!');
          console.log('💾 Sessão salva em:', this.authPath);
          console.log('═══════════════════════════════════════\n');
          
          if (this.callbacks.onConectado) {
            this.callbacks.onConectado();
          }
        }
      });

      // Evento: Mensagens recebidas
      this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
        // Processa apenas mensagens novas
        if (type !== 'notify') return;

        for (const msg of messages) {
          // Ignora mensagens enviadas por nós mesmos
          if (msg.key.fromMe) continue;

          // Extrai informações da mensagem
          const remetente = msg.key.remoteJid;
          const mensagem = this.extrairTextoMensagem(msg);

          // Ignora mensagens de status/broadcast
          if (!remetente || remetente === 'status@broadcast') continue;

          // Verifica se é uma mensagem válida
          if (!mensagem) continue;

          console.log(`\n📩 Mensagem recebida de ${remetente}:`);
          console.log(`   "${mensagem}"`);

          // Chama o callback de mensagem recebida
          if (this.callbacks.onMensagemRecebida) {
            this.callbacks.onMensagemRecebida(remetente, mensagem, msg);
          }
        }
      });

    } catch (error) {
      console.error('❌ Erro ao inicializar WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Envia uma mensagem de texto
   * @param {string} numero - Número do destinatário (formato: 5581999999999@s.whatsapp.net)
   * @param {string} mensagem - Mensagem a ser enviada
   * @returns {Promise}
   */
  async enviarMensagem(numero, mensagem) {
    if (!this.conectado) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      await this.sock.sendMessage(numero, { text: mensagem });
      console.log(`✅ Mensagem enviada para ${numero}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao enviar mensagem para ${numero}:`, error);
      throw error;
    }
  }

  /**
   * Envia mensagem com delay para parecer mais humano
   * @param {string} numero - Número do destinatário
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {number} delaySegundos - Delay em segundos (padrão: 1-3 segundos aleatórios)
   * @returns {Promise}
   */
  async enviarMensagemComDelay(numero, mensagem, delaySegundos = null) {
    // Se não especificou delay, usa um valor aleatório entre 1 e 3 segundos
    const delay = delaySegundos || (Math.random() * 2 + 1);
    
    console.log(`⏳ Aguardando ${delay.toFixed(1)}s antes de enviar...`);
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
    
    return this.enviarMensagem(numero, mensagem);
  }

  /**
   * Simula digitação (typing)
   * @param {string} numero - Número do destinatário
   * @param {number} segundos - Tempo de digitação em segundos
   * @returns {Promise}
   */
  async simularDigitacao(numero, segundos = 2) {
    if (!this.conectado) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      // Envia indicador de "digitando..."
      await this.sock.sendPresenceUpdate('composing', numero);
      
      // Aguarda o tempo especificado
      await new Promise(resolve => setTimeout(resolve, segundos * 1000));
      
      // Remove indicador de digitação
      await this.sock.sendPresenceUpdate('paused', numero);
      
      console.log(`⌨️ Digitação simulada por ${segundos}s para ${numero}`);
    } catch (error) {
      console.error(`❌ Erro ao simular digitação para ${numero}:`, error);
    }
  }

  /**
   * Envia mensagem com simulação de digitação
   * @param {string} numero - Número do destinatário
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {number} tempoDigitacao - Tempo de digitação em segundos
   * @returns {Promise}
   */
  async enviarMensagemHumana(numero, mensagem, tempoDigitacao = null) {
    // Calcula tempo de digitação baseado no tamanho da mensagem
    // Aproximadamente 0.05 segundos por caractere, com mínimo de 1s e máximo de 5s
    const tempoCalculado = tempoDigitacao || Math.min(Math.max(mensagem.length * 0.05, 1), 5);
    
    // Simula digitação
    await this.simularDigitacao(numero, tempoCalculado);
    
    // Envia mensagem
    return this.enviarMensagem(numero, mensagem);
  }

  /**
   * Verifica se um número está no WhatsApp
   * @param {string} numero - Número a verificar
   * @returns {Promise<boolean>}
   */
  async verificarNumero(numero) {
    if (!this.conectado) {
      throw new Error('WhatsApp não está conectado');
    }

    try {
      const [result] = await this.sock.onWhatsApp(numero.replace('@s.whatsapp.net', ''));
      return result?.exists || false;
    } catch (error) {
      console.error(`❌ Erro ao verificar número ${numero}:`, error);
      return false;
    }
  }

  /**
   * Marca mensagem como lida
   * @param {object} mensagem - Objeto da mensagem
   */
  async marcarComoLida(mensagem) {
    if (!this.conectado) return;

    try {
      await this.sock.readMessages([mensagem.key]);
      console.log('   ✓ Mensagem marcada como lida');
    } catch (error) {
      console.error('❌ Erro ao marcar mensagem como lida:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // CALLBACKS E EVENTOS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Define callback para quando conectar
   * @param {function} callback
   */
  aoConectar(callback) {
    this.callbacks.onConectado = callback;
  }

  /**
   * Define callback para quando desconectar
   * @param {function} callback
   */
  aoDesconectar(callback) {
    this.callbacks.onDesconectado = callback;
  }

  /**
   * Define callback para quando receber mensagem
   * @param {function} callback
   */
  aoReceberMensagem(callback) {
    this.callbacks.onMensagemRecebida = callback;
  }

  /**
   * Define callback para quando gerar QR
   * @param {function} callback
   */
  aoGerarQR(callback) {
    this.callbacks.onQR = callback;
  }

  // ═══════════════════════════════════════════════════════════════════
  // UTILITÁRIOS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Verifica se está conectado
   * @returns {boolean}
   */
  estaConectado() {
    return this.conectado;
  }

  /**
   * Obtém informações do próprio número
   * @returns {string|null}
   */
  obterMeuNumero() {
    if (!this.conectado || !this.sock.user) {
      return null;
    }
    
    return this.sock.user.id.split(':')[0] + '@s.whatsapp.net';
  }

  /**
   * Desconecta do WhatsApp
   */
  async desconectar() {
    if (this.sock) {
      await this.sock.logout();
      this.conectado = false;
      console.log('👋 Desconectado do WhatsApp');
    }
  }
  
  /**
   * 🔧 NOVO: Obtém informações sobre a sessão
   */
  obterInfoSessao() {
    try {
      const credsPath = path.join(this.authPath, 'creds.json');
      
      if (!fs.existsSync(credsPath)) {
        return {
          existe: false,
          caminho: this.authPath,
          mensagem: 'Nenhuma sessão salva'
        };
      }
      
      const stats = fs.statSync(credsPath);
      const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
      
      return {
        existe: true,
        caminho: this.authPath,
        tamanho: `${(stats.size / 1024).toFixed(2)} KB`,
        modificado: stats.mtime.toLocaleString('pt-BR'),
        numero: creds.me?.id ? creds.me.id.split(':')[0] : 'Desconhecido',
        mensagem: 'Sessão válida encontrada'
      };
    } catch (error) {
      return {
        existe: false,
        caminho: this.authPath,
        erro: error.message,
        mensagem: 'Erro ao verificar sessão'
      };
    }
  }
}

module.exports = WhatsAppManager;
