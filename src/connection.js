// ...existing code...

// Adicione esta variável no topo do arquivo, após os requires
let currentSocket = null;

async function connect() {
  // Se já existe uma conexão, remove os listeners antigos
  if (currentSocket) {
    currentSocket.ev.removeAllListeners('connection.update');
    currentSocket.ev.removeAllListeners('creds.update');
    currentSocket.ev.removeAllListeners('messages.upsert');
  }

  const baileysFolder = path.resolve(
    __dirname,
    "..",
    "assets",
    "auth",
    "baileys"
  );



  const socket = makeWASocket({
    // ...existing socket options...
  });

  // Guarda referência do socket atual
  currentSocket = socket;

  // ...rest of the connection code...

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      // ...existing disconnect handling...
      
      if (statusCode === DisconnectReason.loggedOut) {
        errorLog("Bot desconectado!");
        badMacErrorCount = 0;
      } else {
        // ...existing reconnect code...
        
        // Atualiza referência do socket
        const newSocket = await connect();
        currentSocket = newSocket;
        load(newSocket);
      }
    }
    // ...rest of connection.update handler...
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

// ...existing exports...
const path = require("node:path");
const { question, onlyNumbers } = require("./utils");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  isJidStatusBroadcast,
  isJidNewsletter,
} = require("baileys");
const pino = require("pino");
const { load } = require("./loader");
const {
  warningLog,
  infoLog,
  errorLog,
  sayLog,
  successLog,
} = require("./utils/logger");
const NodeCache = require("node-cache");
const { TEMP_DIR } = require("./config");
const { badMacHandler } = require("./utils/badMacHandler");
const fs = require("node:fs");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const logger = pino(
  { timestamp: () => `,"time":"${new Date().toJSON()}"` },
  pino.destination(path.join(TEMP_DIR, "wa-logs.txt"))
);

logger.level = "error";

const msgRetryCounterCache = new NodeCache();

const oneDay = 60 * 60 * 24;
const groupCache = new NodeCache({ stdTTL: oneDay, checkperiod: 60 });

function updateGroupMetadataCache(jid, metadata) {
  groupCache.set(jid, metadata);
}

async function connect() {
  const baileysFolder = path.resolve(
    __dirname,
    "..",
    "assets",
    "auth",
    "baileys"
  );

  const { state, saveCreds } = await useMultiFileAuthState(baileysFolder);

  const { version, isLatest } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger,
    defaultQueryTimeoutMs: undefined,
    retryRequestDelayMs: 5000,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
    connectTimeoutMs: 20_000,
    keepAliveIntervalMs: 30_000,
    maxMsgRetryCount: 5,
    markOnlineOnConnect: true,
    syncFullHistory: false,
    emitOwnEvents: false,
    msgRetryCounterCache,
    shouldSyncHistoryMessage: () => false,
    cachedGroupMetadata: (jid) => groupCache.get(jid),
  });

  if (!socket.authState.creds.registered) {
    warningLog("Credenciais ainda não configuradas!");

    infoLog('Informe o número de telefone do bot (exemplo: "5511920202020"):');

    const phoneNumber = await question("Informe o número de telefone do bot: ");

    if (!phoneNumber) {
      errorLog(
        'Número de telefone inválido! Tente novamente com o comando "npm start".'
      );

      process.exit(1);
    }

    const code = await socket.requestPairingCode(onlyNumbers(phoneNumber));

    sayLog(`Código de pareamento: ${code}`);
  }

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
// Add at the top with other requires
const { load } = require("./loader");

// Add these variables at the top level
let currentSocket = null;
let isConnecting = false;

async function connect() {
  // Prevent multiple concurrent connection attempts
  if (isConnecting) {
    warningLog("Conexão já em andamento, aguardando...");
    return currentSocket;
  }

  try {
    isConnecting = true;

    // Cleanup previous socket if exists
    if (currentSocket) {
      currentSocket.ev.removeAllListeners();
      currentSocket.end();
    }

    // ...existing auth state and version code...

    const socket = makeWASocket({
      // ...existing socket options...
    });

    currentSocket = socket;

    // Move connection.update handler to separate function
    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const error = lastDisconnect?.error;
        const statusCode = error?.output?.statusCode;

        // Handle Bad MAC errors
        if (error?.message?.includes("Bad MAC") || error?.toString()?.includes("Bad MAC")) {
          errorLog("Bad MAC error na desconexão detectado");
          if (badMacHandler.handleError(error, "connection.update")) {
            if (badMacHandler.hasReachedLimit()) {
              warningLog("Limite de erros Bad MAC atingido. Limpando sessão...");
              badMacHandler.clearProblematicSessionFiles();
              badMacHandler.resetErrorCount();
              
              // Reconnect with clean state
              currentSocket = null;
              const newSocket = await connect();
              await load(newSocket);
              return;
            }
          }
        }

        // Handle other disconnect reasons
        if (statusCode === DisconnectReason.loggedOut) {
          errorLog("Bot desconectado!");
          badMacErrorCount = 0;
        } else {
          // ...existing disconnect reason handling...

          // Clean reconnect
          currentSocket = null;
          const newSocket = await connect();
          await load(newSocket);
        }
      } else if (connection === "open") {
        successLog("Fui conectado com sucesso!");
        infoLog("Versão do WhatsApp Web: " + version.join("."));
        infoLog("É a última versão do WhatsApp Web?: " + (isLatest ? "Sim" : "Não"));
        badMacErrorCount = 0;
        badMacHandler.resetErrorCount();
      } else {
        infoLog("Atualizando conexão...");
      }
    });

    socket.ev.on("creds.update", saveCreds);

    return socket;

  } finally {
    isConnecting = false;
  }
}

// ...rest of existing exports...
    if (connection === "close") {
      const error = lastDisconnect?.error;
      const statusCode = error?.output?.statusCode;

      if (
        error?.message?.includes("Bad MAC") ||
        error?.toString()?.includes("Bad MAC")
      ) {
        errorLog("Bad MAC error na desconexão detectado");

        if (badMacHandler.handleError(error, "connection.update")) {
          if (badMacHandler.hasReachedLimit()) {
            warningLog(
              "Limite de erros Bad MAC atingido. Limpando arquivos de sessão problemáticos..."
            );
            badMacHandler.clearProblematicSessionFiles();
            badMacHandler.resetErrorCount();

            const newSocket = await connect();
            load(newSocket);
            return;
          }
        }
      }

      if (statusCode === DisconnectReason.loggedOut) {
        errorLog("Bot desconectado!");
        badMacErrorCount = 0;
      } else {
        switch (statusCode) {
          case DisconnectReason.badSession:
            warningLog("Sessão inválida!");

            const sessionError = new Error("Bad session detected");
            if (badMacHandler.handleError(sessionError, "badSession")) {
              if (badMacHandler.hasReachedLimit()) {
                warningLog(
                  "Limite de erros de sessão atingido. Limpando arquivos de sessão..."
                );
                badMacHandler.clearProblematicSessionFiles();
                badMacHandler.resetErrorCount();
              }
            }
            break;
          case DisconnectReason.connectionClosed:
            warningLog("Conexão fechada!");
            break;
          case DisconnectReason.connectionLost:
            warningLog("Conexão perdida!");
            break;
          case DisconnectReason.connectionReplaced:
            warningLog("Conexão substituída!");
            break;
          case DisconnectReason.multideviceMismatch:
            warningLog("Dispositivo incompatível!");
            break;
          case DisconnectReason.forbidden:
            warningLog("Conexão proibida!");
            break;
          case DisconnectReason.restartRequired:
            infoLog('Me reinicie por favor! Digite "npm start".');
            break;
          case DisconnectReason.unavailableService:
            warningLog("Serviço indisponível!");
            break;
        }

        const newSocket = await connect();
        load(newSocket);
      }
    } else if (connection === "open") {
      successLog("Fui conectado com sucesso!");
      infoLog("Versão do WhatsApp Web: " + version.join("."));
      infoLog(
        "É a última versão do WhatsApp Web?: " + (isLatest ? "Sim" : "Não")
      );
      badMacErrorCount = 0;
      badMacHandler.resetErrorCount();
    } else {
      infoLog("Atualizando conexão...");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

exports.updateGroupMetadataCache = updateGroupMetadataCache;
exports.connect = connect;
