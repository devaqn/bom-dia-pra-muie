/**
 * ═══════════════════════════════════════════════════════════════════
 * 🤖 AUTOMAÇÃO DE WHATSAPP - LEMBRETES PERSONALIZADOS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Sistema de automação para envio de mensagens programadas:
 * - Mensagem de bom dia (segunda a sexta, 05:00)
 * - Lembrete de anticoncepcional (todos os dias, 20:00)
 * 
 * Desenvolvido com Node.js + Baileys
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

const cron = require('node-cron');
const WhatsAppManager = require('./whatsapp');
const DatabaseManager = require('./database');
const controleEstado = require('./estado');
const {
  CONFIG,
  HORARIOS,
  MENSAGENS_BOM_DIA,
  MENSAGENS_ANTICONCEPCIONAL,
  PALAVRAS_CHAVE,
} = require('./config');
const {
  formatarNumeroWhatsApp,
  obterDataAtual,
  obterHorarioAtual,
  obterDataHoraAtual,
  escolherMensagemAleatoria,
  contemPalavraChave,
  substituirPlaceholders,
  validarNumeroTelefone,
  formatarTempoEspera,
} = require('./utils');

// ═══════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════════

// Instâncias globais
const whatsapp = new WhatsAppManager();
const database = new DatabaseManager();

// Formata números para o padrão do WhatsApp
const NUMERO_NAMORADA = formatarNumeroWhatsApp(CONFIG.NAMORADA);
const NUMERO_ADMIN = formatarNumeroWhatsApp(CONFIG.ADMIN);

/**
 * Obtém a data vinculada ao fluxo ativo para evitar inconsistência quando vira o dia.
 * @param {string} remetente
 * @returns {string}
 */
function obterDataFluxo(remetente) {
  const estadoAtivo = controleEstado.obterEstado(remetente);
  return estadoAtivo?.data || obterDataAtual();
}

// ═══════════════════════════════════════════════════════════════════
// VALIDAÇÃO DE CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════════

function validarConfiguracao() {
  console.log('\n🔍 Validando configuração...');
  
  const erros = [];
  
  // Valida números de telefone
  if (!validarNumeroTelefone(CONFIG.NAMORADA)) {
    erros.push(`❌ Número da namorada inválido: ${CONFIG.NAMORADA}`);
  }
  
  if (!validarNumeroTelefone(CONFIG.ADMIN)) {
    erros.push(`❌ Número do administrador inválido: ${CONFIG.ADMIN}`);
  }
  
  // Valida arrays de mensagens
  if (!MENSAGENS_BOM_DIA || MENSAGENS_BOM_DIA.length === 0) {
    erros.push('❌ Nenhuma mensagem de bom dia configurada');
  }
  
  if (!MENSAGENS_ANTICONCEPCIONAL.LEMBRETE || MENSAGENS_ANTICONCEPCIONAL.LEMBRETE.length === 0) {
    erros.push('❌ Nenhuma mensagem de lembrete configurada');
  }
  
  // Exibe erros se houver
  if (erros.length > 0) {
    console.error('\n⚠️ ERROS DE CONFIGURAÇÃO ENCONTRADOS:\n');
    erros.forEach(erro => console.error(erro));
    console.error('\n⚠️ Corrija os erros no arquivo config.js antes de continuar.\n');
    process.exit(1);
  }
  
  console.log('✅ Configuração validada com sucesso!');
  console.log(`   📱 Namorada: ${CONFIG.NAMORADA}`);
  console.log(`   👨‍💻 Admin: ${CONFIG.ADMIN}`);
}

// ═══════════════════════════════════════════════════════════════════
// FLUXO 1: MENSAGEM DE BOM DIA
// ═══════════════════════════════════════════════════════════════════

async function enviarMensagemBomDia() {
  try {
    const dataAtual = obterDataAtual();
    const horarioAtual = obterHorarioAtual();
    
    // Verifica se já enviou hoje
    if (database.jáEnviouBomDiaHoje(dataAtual)) {
      console.log(`⏭️ Mensagem de bom dia já foi enviada hoje (${dataAtual})`);
      return;
    }
    
    // Escolhe uma mensagem aleatória
    const mensagem = escolherMensagemAleatoria(MENSAGENS_BOM_DIA);
    
    console.log(`\n☀️ Enviando mensagem de bom dia...`);
    console.log(`   Data: ${dataAtual}`);
    console.log(`   Horário: ${horarioAtual}`);
    
    // Envia mensagem com comportamento humano
    await whatsapp.enviarMensagemHumana(NUMERO_NAMORADA, mensagem);
    
    // Registra no banco de dados
    database.registrarBomDia(dataAtual, mensagem, horarioAtual);
    database.registrarHistorico(
      'bom_dia',
      'bot',
      CONFIG.NAMORADA,
      mensagem,
      obterDataHoraAtual()
    );
    
    console.log('✅ Mensagem de bom dia enviada com sucesso!\n');
    
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem de bom dia:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════
// FLUXO 2: LEMBRETE DO ANTICONCEPCIONAL
// ═══════════════════════════════════════════════════════════════════

async function enviarLembreteAnticoncepcional() {
  try {
    const dataAtual = obterDataAtual();
    const horarioAtual = obterHorarioAtual();
    
    // Verifica se já enviou hoje
    if (database.jáEnviouAnticoncepcionalHoje(dataAtual)) {
      console.log(`⏭️ Lembrete de anticoncepcional já foi enviado hoje (${dataAtual})`);
      return;
    }
    
    // Escolhe uma mensagem aleatória
    const mensagem = escolherMensagemAleatoria(MENSAGENS_ANTICONCEPCIONAL.LEMBRETE);
    
    console.log(`\n💊 Enviando lembrete de anticoncepcional...`);
    console.log(`   Data: ${dataAtual}`);
    console.log(`   Horário: ${horarioAtual}`);
    
    // Envia mensagem com comportamento humano
    await whatsapp.enviarMensagemHumana(NUMERO_NAMORADA, mensagem);
    
    // Registra no banco de dados
    database.registrarLembreteAnticoncepcional(dataAtual, horarioAtual);
    database.registrarHistorico(
      'anticoncepcional_lembrete',
      'bot',
      CONFIG.NAMORADA,
      mensagem,
      obterDataHoraAtual()
    );
    
    // Inicia o fluxo de controle de estado
    controleEstado.iniciarFluxoAnticoncepcional(NUMERO_NAMORADA, dataAtual);
    
    // Define timeout para verificar se não houve resposta
    controleEstado.definirTimeout(
      NUMERO_NAMORADA,
      () => tratarSemResposta(dataAtual),
      HORARIOS.TIMEOUT_RESPOSTA
    );
    
    console.log(`✅ Lembrete enviado! Aguardando resposta por ${HORARIOS.TIMEOUT_RESPOSTA} minutos...\n`);
    
  } catch (error) {
    console.error('❌ Erro ao enviar lembrete de anticoncepcional:', error);
  }
}

/**
 * Trata quando não há resposta no tempo esperado
 */
async function tratarSemResposta(data) {
  try {
    console.log(`\n⏰ Timeout atingido - Sem resposta sobre o anticoncepcional`);
    
    // Registra como sem resposta no banco
    const registrou = database.registrarSemResposta(data);
    
    if (!registrou) {
      console.log('   ℹ️ Já foi registrado ou respondido anteriormente');
      return;
    }
    
    // Envia aviso ao administrador
    const mensagemAdmin = substituirPlaceholders(
      MENSAGENS_ANTICONCEPCIONAL.AVISO_ADMIN_SEM_RESPOSTA,
      {
        minutos: HORARIOS.TIMEOUT_RESPOSTA,
        horario: obterHorarioAtual(),
      }
    );
    
    await whatsapp.enviarMensagem(NUMERO_ADMIN, mensagemAdmin);
    
    database.registrarHistorico(
      'aviso_admin',
      'bot',
      CONFIG.ADMIN,
      mensagemAdmin,
      obterDataHoraAtual()
    );
    
    // Limpa o estado
    controleEstado.finalizarFluxoAnticoncepcional(NUMERO_NAMORADA);
    
    console.log('✅ Administrador notificado sobre falta de resposta\n');
    
  } catch (error) {
    console.error('❌ Erro ao tratar sem resposta:', error);
  }
}

/**
 * Processa resposta sobre se tomou ou não o anticoncepcional
 */
async function processarRespostaTomou(remetente, mensagemTexto, tomou) {
  try {
    const dataFluxo = obterDataFluxo(remetente);
    const horarioAtual = obterHorarioAtual();
    
    console.log(`\n💬 Processando resposta: ${tomou ? 'TOMOU' : 'NÃO TOMOU'}`);
    
    // Cancela o timeout de sem resposta
    controleEstado.cancelarTimeout(remetente);
    
    // Registra a resposta no banco
    database.registrarRespostaTomou(dataFluxo, tomou ? 'sim' : 'nao', horarioAtual);
    database.registrarHistorico(
      'anticoncepcional_resposta',
      CONFIG.NAMORADA,
      'bot',
      mensagemTexto,
      obterDataHoraAtual()
    );
    
    if (tomou) {
      // TOMOU - pergunta como está se sentindo
      const mensagem = escolherMensagemAleatoria(MENSAGENS_ANTICONCEPCIONAL.CONFIRMACAO_POSITIVA);
      await whatsapp.enviarMensagemHumana(remetente, mensagem);
      
      // Atualiza etapa para aguardar resposta sobre bem-estar
      controleEstado.avancarEtapaAnticoncepcional(remetente, 'aguardando_bem_estar');
      
      // Define novo timeout para a pergunta de bem-estar
      controleEstado.definirTimeout(
        remetente,
        () => tratarSemResposta(dataFluxo),
        HORARIOS.TIMEOUT_RESPOSTA
      );
      
      console.log('   ✓ Pergunta sobre bem-estar enviada');
      
    } else {
      // NÃO TOMOU - finaliza o fluxo e notifica admin
      const mensagensNaoTomou = MENSAGENS_ANTICONCEPCIONAL.NAO_TOMOU || MENSAGENS_ANTICONCEPCIONAL.PREOCUPACAO;
      const mensagemPreocupacao = escolherMensagemAleatoria(mensagensNaoTomou);
      await whatsapp.enviarMensagemHumana(remetente, mensagemPreocupacao);
      
      // Notifica admin
      const mensagemAdmin = substituirPlaceholders(
        MENSAGENS_ANTICONCEPCIONAL.AVISO_ADMIN_NAO_TOMOU,
        { horario: horarioAtual }
      );
      
      await whatsapp.enviarMensagem(NUMERO_ADMIN, mensagemAdmin);
      
      database.registrarHistorico(
        'aviso_admin',
        'bot',
        CONFIG.ADMIN,
        mensagemAdmin,
        obterDataHoraAtual()
      );
      
      // Finaliza o fluxo
      controleEstado.finalizarFluxoAnticoncepcional(remetente);
      
      console.log('⚠️ Fluxo finalizado - Não tomou o anticoncepcional');
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar resposta sobre anticoncepcional:', error);
  }
}

/**
 * Processa resposta sobre como está se sentindo
 */
async function processarRespostaBemEstar(remetente, mensagemTexto, estaBem) {
  try {
    const dataFluxo = obterDataFluxo(remetente);
    
    console.log(`\n💬 Processando resposta: ${estaBem ? 'ESTÁ BEM' : 'NÃO ESTÁ BEM'}`);
    
    // Cancela o timeout
    controleEstado.cancelarTimeout(remetente);
    
    // Registra a resposta no banco
    database.registrarRespostaBemEstar(dataFluxo, estaBem ? 'sim' : 'nao');
    database.registrarHistorico(
      'anticoncepcional_resposta',
      CONFIG.NAMORADA,
      'bot',
      mensagemTexto,
      obterDataHoraAtual()
    );
    
    if (estaBem) {
      // ESTÁ bem - envia mensagem de agradecimento
      const mensagem = escolherMensagemAleatoria(MENSAGENS_ANTICONCEPCIONAL.AGRADECIMENTO);
      await whatsapp.enviarMensagemHumana(remetente, mensagem);
      
      await finalizarFluxoComSucesso(dataFluxo, true);
      
    } else {
      // NÃO está bem - demonstra preocupação
      const mensagem = escolherMensagemAleatoria(MENSAGENS_ANTICONCEPCIONAL.PREOCUPACAO);
      await whatsapp.enviarMensagemHumana(remetente, mensagem);
      
      await finalizarFluxoComSucesso(dataFluxo, false);
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar resposta sobre bem-estar:', error);
  }
}

/**
 * Finaliza o fluxo e notifica o administrador
 */
async function finalizarFluxoComSucesso(data, estaBem) {
  try {
    const horarioAtual = obterHorarioAtual();
    
    // Escolhe a mensagem apropriada para o admin
    const mensagemAdmin = estaBem
      ? substituirPlaceholders(
          MENSAGENS_ANTICONCEPCIONAL.AVISO_ADMIN_TOMOU_BEM,
          { horario: horarioAtual }
        )
      : substituirPlaceholders(
          MENSAGENS_ANTICONCEPCIONAL.AVISO_ADMIN_TOMOU_MAL,
          { horario: horarioAtual }
        );
    
    // Envia aviso ao admin
    await whatsapp.enviarMensagem(NUMERO_ADMIN, mensagemAdmin);
    
    database.registrarHistorico(
      'aviso_admin',
      'bot',
      CONFIG.ADMIN,
      mensagemAdmin,
      obterDataHoraAtual()
    );
    
    // Finaliza o fluxo
    controleEstado.finalizarFluxoAnticoncepcional(NUMERO_NAMORADA);
    
    console.log(estaBem
      ? '✅ Fluxo finalizado - Tomou e está bem'
      : '⚠️ Fluxo finalizado - Tomou mas não está bem'
    );
    
  } catch (error) {
    console.error('❌ Erro ao finalizar fluxo:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════
// PROCESSAMENTO DE MENSAGENS RECEBIDAS
// ═══════════════════════════════════════════════════════════════════

async function processarMensagemRecebida(remetente, mensagemTexto, mensagemCompleta) {
  try {
    // 🔧 CORREÇÃO 1: Primeiro verifica se é da namorada
    if (remetente !== NUMERO_NAMORADA) {
      console.log('   ℹ️ Mensagem de número desconhecido - ignorando');
      return;
    }
    
    // 🔧 CORREÇÃO 2: Verifica se está em algum fluxo ativo ANTES de marcar como lida
    if (!controleEstado.estáNoFluxoAnticoncepcional(remetente)) {
      console.log('   ℹ️ Nenhum fluxo ativo - ignorando mensagem');
      return;
    }
    
    // 🔧 CORREÇÃO 3: SÓ MARCA COMO LIDA SE ESTIVER NO FLUXO ATIVO
    await whatsapp.marcarComoLida(mensagemCompleta);
    
    // Obtém a etapa atual do fluxo
    const etapa = controleEstado.obterEtapaAnticoncepcional(remetente);
    
    console.log(`   🔄 Fluxo ativo: anticoncepcional - Etapa: ${etapa}`);
    
    // Processa de acordo com a etapa
    if (etapa === 'aguardando_tomou') {
      // Verifica se respondeu que NAO tomou
      if (contemPalavraChave(mensagemTexto, PALAVRAS_CHAVE.NAO_TOMOU)) {
        await processarRespostaTomou(remetente, mensagemTexto, false);
        return;
      }
      
      // Verifica se respondeu que tomou
      if (contemPalavraChave(mensagemTexto, PALAVRAS_CHAVE.TOMOU)) {
        await processarRespostaTomou(remetente, mensagemTexto, true);
        return;
      }
      
      console.log('   ⚠️ Resposta não reconhecida na etapa "aguardando_tomou"');
      console.log('   💡 Dica: Procure por palavras como "sim", "tomei", "não", "esqueci"');
      
    } else if (etapa === 'aguardando_bem_estar') {
      // Verifica se NAO esta bem
      if (contemPalavraChave(mensagemTexto, PALAVRAS_CHAVE.NAO_ESTA_BEM)) {
        await processarRespostaBemEstar(remetente, mensagemTexto, false);
        return;
      }
      
      // Verifica se esta bem
      if (contemPalavraChave(mensagemTexto, PALAVRAS_CHAVE.ESTA_BEM)) {
        await processarRespostaBemEstar(remetente, mensagemTexto, true);
        return;
      }
      
      console.log('   ⚠️ Resposta não reconhecida na etapa "aguardando_bem_estar"');
      console.log('   💡 Dica: Procure por palavras como "bem", "normal", "mal", "enjoada"');
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════
// AGENDAMENTO DE TAREFAS (CRON JOBS)
// ═══════════════════════════════════════════════════════════════════

function configurarAgendamentos() {
  console.log('\n⏰ Configurando agendamentos...\n');
  
  // Agendamento: Mensagem de bom dia
  cron.schedule(HORARIOS.BOM_DIA, () => {
    console.log(`\n⏰ Cron ativado: Mensagem de bom dia (${HORARIOS.BOM_DIA})`);
    enviarMensagemBomDia();
  }, {
    timezone: 'America/Sao_Paulo', // Ajuste o timezone conforme necessário
  });
  
  console.log(`✅ Bom dia agendado para: ${HORARIOS.BOM_DIA}`);
  console.log('   (Segunda a sexta, 05:00)');
  
  // Agendamento: Lembrete de anticoncepcional
  cron.schedule(HORARIOS.ANTICONCEPCIONAL, () => {
    console.log(`\n⏰ Cron ativado: Lembrete de anticoncepcional (${HORARIOS.ANTICONCEPCIONAL})`);
    enviarLembreteAnticoncepcional();
  }, {
    timezone: 'America/Sao_Paulo',
  });
  
  console.log(`✅ Anticoncepcional agendado para: ${HORARIOS.ANTICONCEPCIONAL}`);
  console.log('   (Todos os dias, 20:00)');
  
  console.log('\n════════════════════════════════════════\n');
}

// ═══════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO DO SISTEMA
// ═══════════════════════════════════════════════════════════════════

async function iniciarSistema() {
  try {
    console.log('\n════════════════════════════════════════');
    console.log('🤖 AUTOMAÇÃO DE WHATSAPP');
    console.log('════════════════════════════════════════\n');
    
    // Valida configuração
    validarConfiguracao();
    
    // Configura callbacks do WhatsApp
    whatsapp.aoConectar(() => {
      console.log('🎉 Sistema pronto e operacional!\n');
      
      // Exibe estatísticas
      const stats = database.obterEstatisticas();
      console.log('📊 Estatísticas:');
      console.log(`   Mensagens de bom dia: ${stats.totalBomDia}`);
      console.log(`   Lembretes enviados: ${stats.totalLembretes}`);
      console.log(`   Tomou e está bem: ${stats.tomouBem}`);
      console.log(`   Tomou mas não está bem: ${stats.tomouMal}`);
      console.log(`   Não tomou: ${stats.naoTomou}`);
      console.log(`   Sem resposta: ${stats.semResposta}\n`);
      
      // Configura agendamentos
      configurarAgendamentos();
    });
    
    whatsapp.aoDesconectar((erro) => {
      console.log('🔌 Desconectado do WhatsApp');
      if (erro) {
        console.error('   Erro:', erro);
      }
    });
    
    whatsapp.aoReceberMensagem((remetente, mensagem, mensagemCompleta) => {
      processarMensagemRecebida(remetente, mensagem, mensagemCompleta);
    });
    
    // Inicia conexão com WhatsApp
    await whatsapp.iniciar();
    
  } catch (error) {
    console.error('\n❌ Erro fatal ao iniciar sistema:', error);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════════
// TRATAMENTO DE SINAIS E ENCERRAMENTO
// ═══════════════════════════════════════════════════════════════════

function configurarEncerramento() {
  const encerrar = async (sinal) => {
    console.log(`\n\n📴 Recebido sinal ${sinal} - Encerrando graciosamente...`);
    
    // Limpa estados ativos
    controleEstado.limparTodosEstados();
    
    // Fecha banco de dados
    database.fechar();
    
    // Desconecta do WhatsApp
    if (whatsapp.estaConectado()) {
      await whatsapp.desconectar();
    }
    
    console.log('👋 Sistema encerrado com sucesso!\n');
    process.exit(0);
  };
  
  process.on('SIGINT', () => encerrar('SIGINT'));
  process.on('SIGTERM', () => encerrar('SIGTERM'));
  
  // Trata erros não capturados
  process.on('uncaughtException', (error) => {
    console.error('\n❌ Erro não capturado:', error);
    encerrar('uncaughtException');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ Promise rejeitada não tratada:', reason);
    encerrar('unhandledRejection');
  });
}

// ═══════════════════════════════════════════════════════════════════
// EXECUÇÃO
// ═══════════════════════════════════════════════════════════════════

configurarEncerramento();
iniciarSistema();
