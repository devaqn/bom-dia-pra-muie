// ═══════════════════════════════════════════════════════════════════
// 📱 CONFIGURAÇÃO DE CONTATOS
// ═══════════════════════════════════════════════════════════════════
// IMPORTANTE: Números já configurados!
// Formato: 55 (Brasil) + 81 (DDD) + número (sem espaços, traços ou parênteses)

const CONFIG = {
  // 👩 Número da namorada (quem recebe os lembretes)
  NAMORADA: '558189070413',
  
  // 👨‍💻 Número do administrador (você - quem recebe os avisos)
  ADMIN: '558187338645',
};

// ═══════════════════════════════════════════════════════════════════
// ⏰ CONFIGURAÇÃO DE HORÁRIOS
// ═══════════════════════════════════════════════════════════════════

const HORARIOS = {
  // Mensagem de bom dia (formato cron: minuto hora dia mês dia-da-semana)
  // "0 5 * * 1-5" = 05:00 de segunda a sexta
  BOM_DIA: '0 5 * * 1-5', // ⬅️ ALTERE AQUI SE NECESSÁRIO
  
  // Lembrete do anticoncepcional (todos os dias às 20:00)
  // "0 20 * * *" = 20:00 todos os dias
  ANTICONCEPCIONAL: '0 20 * * *', // ⬅️ ALTERE AQUI SE NECESSÁRIO
  
  // Tempo de espera para resposta do anticoncepcional (em minutos)
  TIMEOUT_RESPOSTA: 30, // ⬅️ ALTERE AQUI (30 minutos padrão)
};

// ═══════════════════════════════════════════════════════════════════
// 💬 MENSAGENS DE BOM DIA
// ═══════════════════════════════════════════════════════════════════
// Array de mensagens variadas - uma será escolhida aleatoriamente a cada dia
// 20 MENSAGENS DIFERENTES para máxima humanização!

const MENSAGENS_BOM_DIA = [
  'Bom dia, pincesinha, acordei com saudade. Bom trabalho 💕',

  'Bom dia, pincesinha, já acordei pensando em você. Bom trabalho 🩷',

  'Bom dia, pincesinha, tô com saudade já. Bom trabalho 🩷',

  'Bom dia, pincesinha, queria estar aí te dando um abraço. Bom trabalho 🫶',

  'Bom dia, pincesinha, tô pensando em você. Bom trabalho 💗',

  'Bom dia, pincesinha, só passando pra te mandar carinho. Bom trabalho 💌',

  'Bom dia, pincesinha, acordei sorrindo por sua causa. Bom trabalho 💕',

  'Bom dia, pincesinha, só vim te desejar uma boa manhã. Bom trabalho 🌷',

  'Bom dia, pincesinha, te mando carinho de longe. Bom trabalho 💌',

  'Bom dia, pincesinha, começo meu dia por você. Bom trabalho 💖',

  'Bom dia, pincesinha, tô contando os minutos. Bom trabalho ⏳',

  'Bom dia, pincesinha, só pra te lembrar de mim. Bom trabalho 💗',

  'Bom dia, pincesinha, tô pensando em você. Bom trabalho 💕',

  'Bom dia, pincesinha, já acordei sentindo sua falta. Bom trabalho 💗',

  'Bom dia, pincesinha, você faz falta logo cedo. Bom trabalho 💗',

  'Bom dia, minha vida! 🥰\n\nQue hoje seja um dia especial e produtivo! Bom trabalho! ✨',
  
  'Bom dia, coração! 💓\n\nVai com tudo que você consegue! Bom trabalho! 💪',
  
  'Bom dia, minha linda! 😍\n\nTenha um dia maravilhoso e cheio de conquistas! Bom trabalho! 🎯',
  
  'Bom dia, meu amor! 💗\n\nQue hoje seja um dia repleto de coisas boas pra você! Bom trabalho! 🌈',
];

// ═══════════════════════════════════════════════════════════════════
// 💊 MENSAGENS DO ANTICONCEPCIONAL
// ═══════════════════════════════════════════════════════════════════

const MENSAGENS_ANTICONCEPCIONAL = {
  // Lembrete inicial (20 MENSAGENS DIFERENTES!)
  LEMBRETE: [
    'Oi, amor! 💊\n\nHora de tomar o anticoncepcional! Já tomou?',
    
    'Oi, linda! ⏰\n\nLembrando do anticoncepcional! Tomou hoje?',
    
    'Oi, meu bem! 💕\n\nHora do remédio! Já conseguiu tomar?',
    
    'Oi, amor! 🕐\n\nSó passando pra lembrar do anticoncepcional! Tomou?',
    
    'Oi, princesa! 💊\n\nLembrete importante: anticoncepcional! Já tomou?',
    
    'Oi, meu amor! ⏰\n\nTá na hora do seu remédio! Tomou?',
    
    'Oi, flor! 💕\n\nE aí, tomou o anticoncepcional hoje?',
    
    'Oi, vida! 💊\n\nLembrando: hora do anticoncepcional! Já tomou?',
    
    'Oi, linda! 🕐\n\nOpa, tá na hora! Tomou o remédio?',
    
    'Oi, meu bem! ⏰\n\nSó passando aqui pra lembrar do anticoncepcional! Tomou?',
    
    'Oi, amor! 💊\n\nE o anticoncepcional? Já conseguiu tomar?',
    
    'Oi, princesa! 💕\n\nBoa noite! Lembra do anticoncepcional? Já tomou?',
    
    'Oi, meu amor! ⏰\n\nHorário do remédio! Tomou?',
    
    'Oi, linda! 💊\n\nLembrete carinhoso: hora do anticoncepcional! Já tomou?',
    
    'Oi, vida! 🕐\n\nOi amor! Tomou o anticoncepcional hoje?',
    
    'Oi, flor! 💕\n\nPassando pra lembrar: anticoncepcional! Tomou?',
    
    'Oi, meu bem! ⏰\n\nE aí, já tomou o remédio?',
    
    'Oi, amor! 💊\n\nTá na hora! Tomou o anticoncepcional?',
    
    'Oi, princesa! 💕\n\nLembrando você do anticoncepcional! Já tomou?',
    
    'Oi, meu amor! ⏰\n\nHora do anticoncepcional! Conseguiu tomar?',
  ],
  
  // Quando ela diz que tomou
  CONFIRMACAO_POSITIVA: [
    'Ótimo, amor! 💚\n\nEstá tudo bem com você?',
    
    'Que bom! 😊\n\nComo você está se sentindo?',
    
    'Maravilha! ✨\n\nEstá tudo ok?',
  ],
  
  // Quando ela confirma que está bem
  AGRADECIMENTO: [
    'Que ótimo! Fico feliz! 💕\n\nQualquer coisa me avisa, tá? 😘',
    
    'Perfeito, amor! 💖\n\nEstou aqui se precisar de mim! 🥰',
    
    'Maravilha! 💗\n\nSempre que precisar, me fala! 😊',
  ],
  
  // Quando ela diz que não está bem
  PREOCUPACAO: [
    'Entendi, amor. 😔\n\nO que está sentindo? Quer conversar?',
    
    'Que pena... 💙\n\nEstou aqui pra você. Me conta o que está acontecendo?',
    
    'Poxa, meu bem. 🤗\n\nPode me contar? Estou aqui pra te ouvir.',
  ],
  
  // Avisos ao administrador
  AVISO_ADMIN_TOMOU_BEM: '✅ Ela tomou o anticoncepcional e está tudo bem! ({{horario}})',
  
  AVISO_ADMIN_TOMOU_MAL: '⚠️ Ela tomou o anticoncepcional mas não está bem! ({{horario}})\n\nVerifique com ela.',
  
  AVISO_ADMIN_NAO_TOMOU: '❌ Ela NÃO tomou o anticoncepcional! ({{horario}})\n\nAtenção necessária.',
  
  AVISO_ADMIN_SEM_RESPOSTA: '⏰ Sem resposta sobre o anticoncepcional após {{minutos}} minutos. ({{horario}})',
};

// ═══════════════════════════════════════════════════════════════════
// 🧠 PALAVRAS-CHAVE PARA DETECÇÃO DE RESPOSTAS
// ═══════════════════════════════════════════════════════════════════

const PALAVRAS_CHAVE = {
  // Respostas indicando que tomou
  TOMOU: [
    'sim', 'tomei', 'já tomei', 'ja tomei', 'já', 'ja', 'ss', 's',
    'tomado', 'acabei de tomar', 'tomar', 'ok', 'uhum', 'uh hum',
    'claro', 'com certeza', 'pode deixar', 'feito'
  ],
  
  // Respostas indicando que NÃO tomou
  NAO_TOMOU: [
    'não', 'nao', 'n', 'nn', 'ainda não', 'ainda nao', 'não tomei',
    'nao tomei', 'esqueci', 'vou tomar', 'agora', 'já vou', 'ja vou'
  ],
  
  // Respostas indicando que está BEM
  ESTA_BEM: [
    'sim', 'estou', 'tudo', 'bem', 'ótimo', 'otimo', 'tranquilo',
    'normal', 'ok', 'ss', 's', 'uhum', 'tá tudo', 'ta tudo',
    'tudo bem', 'tudo ótimo', 'tudo otimo', 'tá bem', 'ta bem'
  ],
  
  // Respostas indicando que NÃO está bem
  NAO_ESTA_BEM: [
    'não', 'nao', 'n', 'nn', 'mal', 'ruim', 'enjoada', 'tontura',
    'dor', 'efeito', 'colateral', 'enjoo', 'passando mal', 'estranho'
  ],
};

module.exports = {
  CONFIG,
  HORARIOS,
  MENSAGENS_BOM_DIA,
  MENSAGENS_ANTICONCEPCIONAL,
  PALAVRAS_CHAVE,
};
