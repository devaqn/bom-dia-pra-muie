const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');

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
  }

  /**
   * Inicializa a conexão com o WhatsApp
   */
  async iniciar() {
    try {
      console.log('🚀 Iniciando conexão com WhatsApp...');

      // Carrega a autenticação salva ou cria uma nova
      const { state, saveCreds } = await useMultiFileAuthState('auth_info');

      // Obtém a versão mais recente do Baileys
      const { version } = await fetchLatestBaileysVersion();

      // Cria o socket do WhatsApp
      this.sock = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        printQRInTerminal: false, // Vamos controlar o QR manualmente
        logger: pino({ level: 'silent' }), // Remove logs verbosos do Baileys
        browser: ['WhatsApp Bot', 'Chrome', '10.0'], // Identificação do dispositivo
        generateHighQualityLinkPreview: true,
      });

      // ═══════════════════════════════════════════════════════════════
      // EVENTOS DO WHATSAPP
      // ═══════════════════════════════════════════════════════════════

      // Evento: Atualização de credenciais (salva automaticamente)
      this.sock.ev.on('creds.update', saveCreds);

      // Evento: Atualização de conexão
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Exibe QR Code quando disponível
        if (qr && !this.qrGerado) {
          console.log('\n════════════════════════════════════════');
          console.log('📱 ESCANEIE O QR CODE ABAIXO:');
          console.log('════════════════════════════════════════\n');
          qrcode.generate(qr, { small: true });
          console.log('\n════════════════════════════════════════');
          console.log('⏳ Aguardando leitura do QR Code...');
          console.log('════════════════════════════════════════\n');
          
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
          
          console.log('❌ Conexão fechada. Motivo:', lastDisconnect?.error);
          
          // Se for erro 401 (Unauthorized), limpa a sessão
          if (statusCode === 401) {
            console.log('🔐 Erro 401 detectado - Sessão inválida!');
            console.log('🧹 Limpando arquivos de autenticação...');
            
            const fs = require('fs');
            const path = require('path');
            const authPath = path.join(__dirname, 'auth_info');
            
            if (fs.existsSync(authPath)) {
              fs.rmSync(authPath, { recursive: true, force: true });
              console.log('✅ Sessão antiga removida!');
              console.log('🔄 Gerando novo QR Code...');
            }
            
            // Aguarda 3 segundos e reinicia para gerar novo QR
            setTimeout(() => this.iniciar(), 3000);
          } else if (shouldReconnect) {
            console.log('🔄 Reconectando...');
            setTimeout(() => this.iniciar(), 5000); // Aguarda 5 segundos antes de reconectar
          } else {
            console.log('🚪 Desconectado do WhatsApp. Execute novamente para reconectar.');
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
          console.log('════════════════════════════════════════\n');
          
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
          const mensagem = msg.message?.conversation || 
                          msg.message?.extendedTextMessage?.text || 
                          '';

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
}

module.exports = WhatsAppManager;