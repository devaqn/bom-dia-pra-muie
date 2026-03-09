const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    // Cria o banco de dados na pasta do projeto
    const dbPath = path.join(__dirname, 'whatsapp_automation.db');
    this.db = new Database(dbPath);
    
    // Inicializa as tabelas
    this.inicializarTabelas();
  }

  /**
   * Cria as tabelas necessárias no banco de dados
   */
  inicializarTabelas() {
    // Tabela para registrar mensagens de bom dia enviadas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS mensagens_bom_dia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL UNIQUE,
        mensagem_enviada TEXT NOT NULL,
        horario_envio TEXT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela para registrar lembretes de anticoncepcional
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS lembretes_anticoncepcional (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL UNIQUE,
        horario_lembrete TEXT NOT NULL,
        horario_resposta TEXT,
        status TEXT NOT NULL, -- 'aguardando', 'tomou_aguardando_bem_estar', 'tomou_bem', 'tomou_mal', 'nao_tomou', 'sem_resposta'
        respondeu_bem TEXT, -- 'sim', 'nao', null
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela para histórico de mensagens (útil para debug)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS historico_mensagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL, -- 'bom_dia', 'anticoncepcional_lembrete', 'anticoncepcional_resposta', 'aviso_admin'
        de TEXT NOT NULL,
        para TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        data_hora TEXT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Banco de dados inicializado com sucesso!');
  }

  // ═══════════════════════════════════════════════════════════════════
  // MÉTODOS PARA BOM DIA
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Verifica se já enviou mensagem de bom dia hoje
   * @param {string} data - Data no formato YYYY-MM-DD
   * @returns {boolean}
   */
  jáEnviouBomDiaHoje(data) {
    const stmt = this.db.prepare('SELECT id FROM mensagens_bom_dia WHERE data = ?');
    const result = stmt.get(data);
    return result !== undefined;
  }

  /**
   * Registra o envio de mensagem de bom dia
   * @param {string} data - Data no formato YYYY-MM-DD
   * @param {string} mensagem - Mensagem enviada
   * @param {string} horario - Horário no formato HH:MM:SS
   */
  registrarBomDia(data, mensagem, horario) {
    const stmt = this.db.prepare(`
      INSERT INTO mensagens_bom_dia (data, mensagem_enviada, horario_envio)
      VALUES (?, ?, ?)
    `);
    
    try {
      stmt.run(data, mensagem, horario);
      console.log(`✅ Bom dia registrado para ${data} às ${horario}`);
    } catch (error) {
      console.error('❌ Erro ao registrar bom dia:', error.message);
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MÉTODOS PARA ANTICONCEPCIONAL
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Verifica se já enviou lembrete de anticoncepcional hoje
   * @param {string} data - Data no formato YYYY-MM-DD
   * @returns {boolean}
   */
  jáEnviouAnticoncepcionalHoje(data) {
    const stmt = this.db.prepare('SELECT id FROM lembretes_anticoncepcional WHERE data = ?');
    const result = stmt.get(data);
    return result !== undefined;
  }

  /**
   * Registra o envio do lembrete de anticoncepcional
   * @param {string} data - Data no formato YYYY-MM-DD
   * @param {string} horario - Horário no formato HH:MM:SS
   */
  registrarLembreteAnticoncepcional(data, horario) {
    const stmt = this.db.prepare(`
      INSERT INTO lembretes_anticoncepcional (data, horario_lembrete, status)
      VALUES (?, ?, 'aguardando')
    `);
    
    try {
      stmt.run(data, horario);
      console.log(`✅ Lembrete de anticoncepcional registrado para ${data} às ${horario}`);
    } catch (error) {
      console.error('❌ Erro ao registrar lembrete:', error.message);
    }
  }

  /**
   * Obtém o status atual do lembrete de hoje
   * @param {string} data - Data no formato YYYY-MM-DD
   * @returns {object|null}
   */
  obterStatusAnticoncepcionalHoje(data) {
    const stmt = this.db.prepare('SELECT * FROM lembretes_anticoncepcional WHERE data = ?');
    return stmt.get(data);
  }

  /**
   * Atualiza o status quando ela responde se tomou ou não
   * @param {string} data - Data no formato YYYY-MM-DD
   * @param {string} tomou - 'sim' ou 'nao'
   * @param {string} horario - Horário da resposta
   */
  registrarRespostaTomou(data, tomou, horario) {
    const status = tomou === 'sim' ? 'tomou_aguardando_bem_estar' : 'nao_tomou';
    
    const stmt = this.db.prepare(`
      UPDATE lembretes_anticoncepcional 
      SET status = ?, horario_resposta = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE data = ?
    `);
    
    stmt.run(status, horario, data);
    console.log(`✅ Resposta registrada: ${tomou} às ${horario}`);
  }

  /**
   * Atualiza o status quando ela responde se está bem ou não
   * @param {string} data - Data no formato YYYY-MM-DD
   * @param {string} estaBem - 'sim' ou 'nao'
   */
  registrarRespostaBemEstar(data, estaBem) {
    const status = estaBem === 'sim' ? 'tomou_bem' : 'tomou_mal';
    
    const stmt = this.db.prepare(`
      UPDATE lembretes_anticoncepcional 
      SET status = ?, respondeu_bem = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE data = ?
    `);
    
    stmt.run(status, estaBem, data);
    console.log(`✅ Bem-estar registrado: ${estaBem}`);
  }

  /**
   * Marca como sem resposta quando o timeout é atingido
   * @param {string} data - Data no formato YYYY-MM-DD
   */
  registrarSemResposta(data) {
    const stmt = this.db.prepare(`
      UPDATE lembretes_anticoncepcional 
      SET status = 'sem_resposta', atualizado_em = CURRENT_TIMESTAMP
      WHERE data = ? AND status IN ('aguardando', 'tomou_aguardando_bem_estar')
    `);
    
    const result = stmt.run(data);
    
    if (result.changes > 0) {
      console.log(`⏰ Marcado como sem resposta para ${data}`);
      return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════
  // HISTÓRICO DE MENSAGENS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Registra uma mensagem no histórico
   * @param {string} tipo - Tipo da mensagem
   * @param {string} de - Número de quem enviou
   * @param {string} para - Número de quem recebeu
   * @param {string} mensagem - Conteúdo da mensagem
   * @param {string} dataHora - Data e hora no formato YYYY-MM-DD HH:MM:SS
   */
  registrarHistorico(tipo, de, para, mensagem, dataHora) {
    const stmt = this.db.prepare(`
      INSERT INTO historico_mensagens (tipo, de, para, mensagem, data_hora)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    try {
      stmt.run(tipo, de, para, mensagem, dataHora);
    } catch (error) {
      console.error('❌ Erro ao registrar histórico:', error.message);
    }
  }

  /**
   * Obtém estatísticas gerais
   * @returns {object}
   */
  obterEstatisticas() {
    const stats = {
      totalBomDia: this.db.prepare('SELECT COUNT(*) as count FROM mensagens_bom_dia').get().count,
      totalLembretes: this.db.prepare('SELECT COUNT(*) as count FROM lembretes_anticoncepcional').get().count,
      tomouBem: this.db.prepare("SELECT COUNT(*) as count FROM lembretes_anticoncepcional WHERE status = 'tomou_bem'").get().count,
      tomouMal: this.db.prepare("SELECT COUNT(*) as count FROM lembretes_anticoncepcional WHERE status = 'tomou_mal'").get().count,
      naoTomou: this.db.prepare("SELECT COUNT(*) as count FROM lembretes_anticoncepcional WHERE status = 'nao_tomou'").get().count,
      semResposta: this.db.prepare("SELECT COUNT(*) as count FROM lembretes_anticoncepcional WHERE status = 'sem_resposta'").get().count,
    };
    
    return stats;
  }

  /**
   * Fecha a conexão com o banco de dados
   */
  fechar() {
    this.db.close();
    console.log('🔒 Banco de dados fechado');
  }
}

module.exports = DatabaseManager;
