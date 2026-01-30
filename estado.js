/**
 * Controle de Estado
 * Gerencia os estados das conversas e fluxos ativos
 */

class ControleEstado {
  constructor() {
    // Armazena o estado atual de cada número
    // Estrutura: { numero: { tipo: 'anticoncepcional', etapa: 'aguardando_tomou', data: '2024-01-15', ... } }
    this.estados = new Map();
    
    // Armazena timeouts ativos para cada número
    this.timeouts = new Map();
  }

  // ═══════════════════════════════════════════════════════════════════
  // MÉTODOS GERAIS DE ESTADO
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Define o estado atual para um número
   * @param {string} numero - Número do contato
   * @param {object} estado - Objeto com os dados do estado
   */
  definirEstado(numero, estado) {
    this.estados.set(numero, {
      ...estado,
      dataHoraInicio: new Date().toISOString(),
    });
    
    console.log(`📝 Estado definido para ${numero}:`, estado);
  }

  /**
   * Obtém o estado atual de um número
   * @param {string} numero - Número do contato
   * @returns {object|null}
   */
  obterEstado(numero) {
    return this.estados.get(numero) || null;
  }

  /**
   * Remove o estado de um número
   * @param {string} numero - Número do contato
   */
  limparEstado(numero) {
    // Cancela timeout se existir
    this.cancelarTimeout(numero);
    
    // Remove o estado
    this.estados.delete(numero);
    
    console.log(`🗑️ Estado limpo para ${numero}`);
  }

  /**
   * Verifica se existe um estado ativo para o número
   * @param {string} numero - Número do contato
   * @returns {boolean}
   */
  temEstadoAtivo(numero) {
    return this.estados.has(numero);
  }

  /**
   * Atualiza parcialmente o estado de um número
   * @param {string} numero - Número do contato
   * @param {object} novosDados - Dados a serem atualizados
   */
  atualizarEstado(numero, novosDados) {
    const estadoAtual = this.obterEstado(numero);
    
    if (estadoAtual) {
      this.definirEstado(numero, {
        ...estadoAtual,
        ...novosDados,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MÉTODOS ESPECÍFICOS PARA ANTICONCEPCIONAL
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Inicia o fluxo de anticoncepcional
   * @param {string} numero - Número do contato
   * @param {string} data - Data do lembrete
   */
  iniciarFluxoAnticoncepcional(numero, data) {
    this.definirEstado(numero, {
      tipo: 'anticoncepcional',
      etapa: 'aguardando_tomou', // Etapas: aguardando_tomou, aguardando_bem_estar
      data: data,
      tentativas: 0,
    });
  }

  /**
   * Avança para a próxima etapa do fluxo de anticoncepcional
   * @param {string} numero - Número do contato
   * @param {string} novaEtapa - Nova etapa do fluxo
   */
  avancarEtapaAnticoncepcional(numero, novaEtapa) {
    this.atualizarEstado(numero, {
      etapa: novaEtapa,
    });
  }

  /**
   * Verifica se está no fluxo de anticoncepcional
   * @param {string} numero - Número do contato
   * @returns {boolean}
   */
  estáNoFluxoAnticoncepcional(numero) {
    const estado = this.obterEstado(numero);
    return estado !== null && estado.tipo === 'anticoncepcional';
  }

  /**
   * Verifica qual etapa do anticoncepcional está ativa
   * @param {string} numero - Número do contato
   * @returns {string|null}
   */
  obterEtapaAnticoncepcional(numero) {
    const estado = this.obterEstado(numero);
    
    if (estado && estado.tipo === 'anticoncepcional') {
      return estado.etapa;
    }
    
    return null;
  }

  /**
   * Finaliza o fluxo de anticoncepcional
   * @param {string} numero - Número do contato
   */
  finalizarFluxoAnticoncepcional(numero) {
    console.log(`✅ Fluxo de anticoncepcional finalizado para ${numero}`);
    this.limparEstado(numero);
  }

  // ═══════════════════════════════════════════════════════════════════
  // GERENCIAMENTO DE TIMEOUTS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Define um timeout para um número
   * @param {string} numero - Número do contato
   * @param {function} callback - Função a ser executada quando o timeout expirar
   * @param {number} minutos - Tempo em minutos
   */
  definirTimeout(numero, callback, minutos) {
    // Cancela timeout anterior se existir
    this.cancelarTimeout(numero);
    
    // Define novo timeout
    const timeout = setTimeout(() => {
      console.log(`⏰ Timeout expirado para ${numero} após ${minutos} minutos`);
      callback();
      this.timeouts.delete(numero);
    }, minutos * 60 * 1000); // Converte minutos para milissegundos
    
    this.timeouts.set(numero, timeout);
    console.log(`⏰ Timeout de ${minutos} minutos definido para ${numero}`);
  }

  /**
   * Cancela o timeout de um número
   * @param {string} numero - Número do contato
   */
  cancelarTimeout(numero) {
    const timeout = this.timeouts.get(numero);
    
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(numero);
      console.log(`⏰ Timeout cancelado para ${numero}`);
    }
  }

  /**
   * Verifica se existe um timeout ativo para o número
   * @param {string} numero - Número do contato
   * @returns {boolean}
   */
  temTimeoutAtivo(numero) {
    return this.timeouts.has(numero);
  }

  // ═══════════════════════════════════════════════════════════════════
  // UTILITÁRIOS E DEBUG
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Retorna todos os estados ativos
   * @returns {Map}
   */
  obterTodosEstados() {
    return new Map(this.estados);
  }

  /**
   * Retorna quantidade de estados ativos
   * @returns {number}
   */
  contarEstadosAtivos() {
    return this.estados.size;
  }

  /**
   * Limpa todos os estados (útil para testes ou reset)
   */
  limparTodosEstados() {
    // Cancela todos os timeouts
    for (const numero of this.timeouts.keys()) {
      this.cancelarTimeout(numero);
    }
    
    // Limpa todos os estados
    this.estados.clear();
    
    console.log('🗑️ Todos os estados foram limpos');
  }

  /**
   * Exibe informações de debug sobre os estados
   */
  debug() {
    console.log('\n════════════════════════════════════════');
    console.log('🔍 DEBUG - ESTADOS ATIVOS');
    console.log('════════════════════════════════════════');
    
    if (this.estados.size === 0) {
      console.log('Nenhum estado ativo no momento.');
    } else {
      for (const [numero, estado] of this.estados.entries()) {
        console.log(`\n📱 ${numero}:`);
        console.log(`   Tipo: ${estado.tipo}`);
        console.log(`   Etapa: ${estado.etapa}`);
        console.log(`   Data: ${estado.data}`);
        console.log(`   Início: ${estado.dataHoraInicio}`);
        
        if (this.temTimeoutAtivo(numero)) {
          console.log(`   ⏰ Timeout: ATIVO`);
        }
      }
    }
    
    console.log('\n════════════════════════════════════════\n');
  }
}

// Exporta uma instância única (singleton)
module.exports = new ControleEstado();
