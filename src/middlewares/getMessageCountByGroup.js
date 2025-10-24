const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON que armazenará as contagens
const MESSAGE_COUNT_FILE = path.join(__dirname, '../../data/messageCount.json');

// Garante que o diretório data existe
if (!fs.existsSync(path.dirname(MESSAGE_COUNT_FILE))) {
  fs.mkdirSync(path.dirname(MESSAGE_COUNT_FILE), { recursive: true });
}

// Carrega dados existentes ou inicia novo objeto
let messageCountDB = {};
try {
  if (fs.existsSync(MESSAGE_COUNT_FILE)) {
    messageCountDB = JSON.parse(fs.readFileSync(MESSAGE_COUNT_FILE, 'utf8'));
  }
} catch (error) {
  console.error('Erro ao carregar arquivo de contagem:', error);
  messageCountDB = {};
}

// Salva os dados em arquivo
const saveMessageCount = () => {
  try {
    fs.writeFileSync(MESSAGE_COUNT_FILE, JSON.stringify(messageCountDB, null, 2));
  } catch (error) {
    console.error('Erro ao salvar contagem de mensagens:', error);
  }
};

/**
 * Incrementa contador de mensagens do usuário no grupo
 * @param {string} groupJid ID do grupo
 * @param {string} userJid ID do usuário
 */
exports.incrementMessageCount = (groupJid, userJid) => {
  if (!messageCountDB[groupJid]) {
    messageCountDB[groupJid] = {};
  }
  
  if (!messageCountDB[groupJid][userJid]) {
    messageCountDB[groupJid][userJid] = 0;
  }
  
  messageCountDB[groupJid][userJid]++;
  saveMessageCount();
};

/**
 * Retorna objeto com contagem de mensagens do grupo
 * @param {string} groupJid ID do grupo
 * @returns {Object} Objeto com contagens {userJid: count}
 */
exports.getMessageCountByGroup = (groupJid) => {
  return messageCountDB[groupJid] || {};
};

/**
 * Limpa contagem de mensagens de um grupo
 * @param {string} groupJid ID do grupo
 */
exports.clearGroupMessageCount = (groupJid) => {
  if (messageCountDB[groupJid]) {
    delete messageCountDB[groupJid];
    saveMessageCount();
  }
};

/**
 * Reseta contagem de um usuário específico no grupo
 * @param {string} groupJid ID do grupo
 * @param {string} userJid ID do usuário
 */
exports.resetUserMessageCount = (groupJid, userJid) => {
  if (messageCountDB[groupJid]?.[userJid]) {
    messageCountDB[groupJid][userJid] = 0;
    saveMessageCount();
  }
};
