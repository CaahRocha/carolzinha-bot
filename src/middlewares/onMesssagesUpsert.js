const {
  isAtLeastMinutesInPast,
  GROUP_PARTICIPANT_ADD,
  GROUP_PARTICIPANT_LEAVE,
  isAddOrLeave,
} = require("../utils");
const { DEVELOPER_MODE } = require("../config");
const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { onGroupParticipantsUpdate } = require("./onGroupParticipantsUpdate");
const { errorLog, infoLog } = require("../utils/logger");
const { badMacHandler } = require("../utils/badMacHandler");
const { checkIfMemberIsMuted } = require("../utils/database");
const { messageHandler } = require("./messageHandler");
const connection = require("../connection");

// Cache para prevenir processamento duplicado
const processedMessages = new Map();
const CACHE_TIMEOUT = 5000; // 5 segundos

exports.onMessagesUpsert = async ({ socket, messages, startProcess }) => {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    try {
      // Verifica duplicação
      const messageKey = `${webMessage?.key?.id}:${webMessage?.key?.remoteJid}`;
      const now = Date.now();
      
      if (processedMessages.has(messageKey)) {
        if (DEVELOPER_MODE) {
          infoLog(`[DEDUP] Mensagem duplicada ignorada: ${messageKey}`);
        }
        continue;
      }      // ...existing code...
      
      const MESSAGE_COUNT_FILE = "message-count";
      
      exports.incrementMessageCount = (groupId, memberId) => {
        const filename = MESSAGE_COUNT_FILE;
        const messageCount = readJSON(filename, {});
      
        if (!messageCount[groupId]) {
          messageCount[groupId] = {};
        }
      
        messageCount[groupId][memberId] = (messageCount[groupId][memberId] || 0) + 1;
      
        writeJSON(filename, messageCount, {});
        console.log(`[MSG-COUNT] incremented ${memberId} in ${groupId} -> ${messageCount[groupId][memberId]}`);
      };
      
      exports.getMessageCountByGroup = (groupId) => {
        const filename = MESSAGE_COUNT_FILE;
        const messageCount = readJSON(filename, {});
        const result = messageCount[groupId] || {};
        console.log(`[MSG-COUNT] get for ${groupId} ->`, result);
        return result;
      };
      
      exports.clearGroupMessageCount = (groupId) => {
        const filename = MESSAGE_COUNT_FILE;
        const messageCount = readJSON(filename, {});
      
        if (messageCount[groupId]) {
          delete messageCount[groupId];
          writeJSON(filename, messageCount, {});
          console.log(`[MSG-COUNT] cleared ${groupId}`);
        }
      };
      
      exports.resetUserMessageCount = (groupId, memberId) => {
        const filename = MESSAGE_COUNT_FILE;
        const messageCount = readJSON(filename, {});
      
        if (messageCount[groupId] && messageCount[groupId][memberId] !== undefined) {
          messageCount[groupId][memberId] = 0;
          writeJSON(filename, messageCount, {});
          console.log(`[MSG-COUNT] reset ${memberId} in ${groupId}`);
        }
      };

      // Adiciona ao cache
      processedMessages.set(messageKey, now);
      
      // Limpa mensagens antigas do cache
      for (const [key, timestamp] of processedMessages.entries()) {
        if (now - timestamp > CACHE_TIMEOUT) {
          processedMessages.delete(key);
        }
      }

      if (DEVELOPER_MODE) {
        infoLog(
          `\n\n⪨========== [ MENSAGEM RECEBIDA ] ==========⪩ \n\n${JSON.stringify(
            messages,
            null,
            2
          )}`
        );
      }

      const timestamp = webMessage.messageTimestamp;

      if (webMessage?.message) {
        await messageHandler(socket, webMessage);
      }

      if (isAtLeastMinutesInPast(timestamp)) {
        continue;
      }

      // ... resto do código existente ...
      
    } catch (error) {
      if (badMacHandler.handleError(error, "message-processing")) {
        continue;
      }

      if (badMacHandler.isSessionError(error)) {
        errorLog(`Erro de sessão ao processar mensagem: ${error.message}`);
        continue;
      }

      errorLog(
        `Erro ao processar mensagem: ${error.message} | Stack: ${error.stack}`
      );

      continue;
    }
  }
};
