/**
 * Módulo de utilitários
 * Contém funções auxiliares usadas em todo o projeto
 */

/**
 * Formata número de telefone para o padrão do WhatsApp
 * @param {string} numero - Número no formato 5581999999999
 * @returns {string} - Número formatado (5581999999999@s.whatsapp.net)
 */
function formatarNumeroWhatsApp(numero) {
  // Remove espaços, traços e parênteses
  const numeroLimpo = numero.replace(/[\s\-\(\)]/g, '');
  
  // Adiciona o sufixo do WhatsApp
  return `${numeroLimpo}@s.whatsapp.net`;
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns {string}
 */
function obterDataAtual() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
}

/**
 * Obtém o horário atual no formato HH:MM:SS
 * @returns {string}
 */
function obterHorarioAtual() {
  const agora = new Date();
  const hora = String(agora.getHours()).padStart(2, '0');
  const minuto = String(agora.getMinutes()).padStart(2, '0');
  const segundo = String(agora.getSeconds()).padStart(2, '0');
  
  return `${hora}:${minuto}:${segundo}`;
}

/**
 * Obtém data e hora atual no formato YYYY-MM-DD HH:MM:SS
 * @returns {string}
 */
function obterDataHoraAtual() {
  return `${obterDataAtual()} ${obterHorarioAtual()}`;
}

/**
 * Escolhe uma mensagem aleatória de um array
 * @param {array} mensagens - Array de mensagens
 * @returns {string}
 */
function escolherMensagemAleatoria(mensagens) {
  const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
  return mensagens[indiceAleatorio];
}

/**
 * Normaliza texto para comparação (remove acentos, converte para minúsculas)
 * @param {string} texto
 * @returns {string}
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
}

/**
 * Verifica se o texto contém alguma das palavras-chave
 * @param {string} texto - Texto a verificar
 * @param {array} palavrasChave - Array de palavras-chave
 * @returns {boolean}
 */
function contemPalavraChave(texto, palavrasChave) {
  const textoNormalizado = normalizarTexto(texto);
  
  return palavrasChave.some(palavra => {
    const palavraNormalizada = normalizarTexto(palavra);
    
    // Verifica se a palavra está presente (palavra completa ou como parte do texto)
    const regex = new RegExp(`\\b${palavraNormalizada}\\b|${palavraNormalizada}`, 'i');
    return regex.test(textoNormalizado);
  });
}

/**
 * Substitui placeholders em uma mensagem
 * @param {string} mensagem - Mensagem com placeholders {{variavel}}
 * @param {object} variaveis - Objeto com as variáveis
 * @returns {string}
 */
function substituirPlaceholders(mensagem, variaveis) {
  let resultado = mensagem;
  
  for (const [chave, valor] of Object.entries(variaveis)) {
    const placeholder = `{{${chave}}}`;
    resultado = resultado.replace(new RegExp(placeholder, 'g'), valor);
  }
  
  return resultado;
}

/**
 * Aguarda por um número de segundos
 * @param {number} segundos
 * @returns {Promise}
 */
function aguardar(segundos) {
  return new Promise(resolve => setTimeout(resolve, segundos * 1000));
}

/**
 * Formata minutos em texto legível
 * @param {number} minutos
 * @returns {string}
 */
function formatarTempoEspera(minutos) {
  if (minutos < 60) {
    return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  }
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  
  let resultado = `${horas} hora${horas !== 1 ? 's' : ''}`;
  
  if (minutosRestantes > 0) {
    resultado += ` e ${minutosRestantes} minuto${minutosRestantes !== 1 ? 's' : ''}`;
  }
  
  return resultado;
}

/**
 * Valida se um número de telefone está no formato correto
 * @param {string} numero
 * @returns {boolean}
 */
function validarNumeroTelefone(numero) {
  // Remove espaços e caracteres especiais
  const numeroLimpo = numero.replace(/[\s\-\(\)]/g, '');
  
  // Verifica se tem entre 12 e 13 dígitos (formato brasileiro com DDI)
  // Exemplo: 5581999999999 (13 dígitos)
  return /^55\d{10,11}$/.test(numeroLimpo);
}

/**
 * Cria um delay aleatório para parecer mais humano
 * @param {number} min - Tempo mínimo em segundos
 * @param {number} max - Tempo máximo em segundos
 * @returns {Promise}
 */
async function delayHumano(min = 1, max = 3) {
  const delay = Math.random() * (max - min) + min;
  return aguardar(delay);
}

/**
 * Formata uma data para exibição
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string} - Data no formato DD/MM/YYYY
 */
function formatarDataExibicao(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * Obtém o dia da semana por extenso
 * @param {Date} data
 * @returns {string}
 */
function obterDiaSemana(data = new Date()) {
  const diasSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado'
  ];
  
  return diasSemana[data.getDay()];
}

/**
 * Verifica se hoje é dia útil (segunda a sexta)
 * @returns {boolean}
 */
function éDiaUtil() {
  const hoje = new Date();
  const diaSemana = hoje.getDay();
  
  // 0 = domingo, 6 = sábado
  return diaSemana >= 1 && diaSemana <= 5;
}

module.exports = {
  formatarNumeroWhatsApp,
  obterDataAtual,
  obterHorarioAtual,
  obterDataHoraAtual,
  escolherMensagemAleatoria,
  normalizarTexto,
  contemPalavraChave,
  substituirPlaceholders,
  aguardar,
  formatarTempoEspera,
  validarNumeroTelefone,
  delayHumano,
  formatarDataExibicao,
  obterDiaSemana,
  éDiaUtil,
};
