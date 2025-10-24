const { TIMEOUT_IN_MILLISECONDS_BY_EVENT } = require("./config");
const { onMessagesUpsert } = require("./middlewares/onMesssagesUpsert");
const path = require("node:path");
const { errorLog, infoLog } = require("./utils/logger");
const { badMacHandler } = require("./utils/badMacHandler");

// Tracking de eventos registrados
let isLoaded = false;

exports.load = (socket) => {
  // Previne carregamento duplicado
  if (isLoaded) {
    infoLog("Loader já foi inicializado, removendo listeners antigos...");
    socket.ev.removeAllListeners("messages.upsert");
  }

  global.BASE_DIR = path.resolve(__dirname);
  
  const safeEventHandler = async (callback, data, eventName) => {
    try {
      await callback(data);
    } catch (error) {
      if (badMacHandler.handleError(error, eventName)) {
        return;
      }

      errorLog(`Erro ao processar evento ${eventName}: ${error.message}`);

      if (error.stack) {
        errorLog(`Stack trace: ${error.stack}`);
      }
    }
  };

  // Registra novo listener
  socket.ev.on("messages.upsert", async (data) => {
    const startProcess = Date.now();
    setTimeout(() => {
      safeEventHandler(
        () =>
          onMessagesUpsert({
            socket,
            messages: data.messages,
            startProcess,
          }),
        data,
        "messages.upsert"
      );
    }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
  });

  // Registra handlers de erro globais apenas uma vez
  if (!isLoaded) {
    process.on("uncaughtException", (error) => {
      if (badMacHandler.handleError(error, "uncaughtException")) {
        return;
      }
      errorLog(`Erro não capturado: ${error.message}`);
    });

    process.on("unhandledRejection", (reason) => {
      if (badMacHandler.handleError(reason, "unhandledRejection")) {
        return;
      }
      errorLog(`Promessa rejeitada não tratada: ${reason}`);
    });
  }

  isLoaded = true;
};
