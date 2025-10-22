const path = require("path");

// Prefixo padrão dos comandos
exports.PREFIX = ".";

// Informações do bot
exports.BOT_NAME = "Carolzinha Bot";
exports.BOT_EMOJI = "💕";
exports.BOT_NUMBER = "5561992416266";

// Informações da dona
exports.OWNER_NUMBER = "5511985079997"; // Número da dona (sem espaços, com DDI)
exports.OWNER_LID = "11985079997@lid"; // LID da dona (usado em alguns comandos)

// Diretórios
exports.BASE_DIR = path.resolve(__dirname);
exports.COMMANDS_DIR = path.join(__dirname, "commands");
exports.DATABASE_DIR = path.resolve(__dirname, "..", "database");
exports.ASSETS_DIR = path.resolve(__dirname, "..", "assets");
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

// Configurações de tempo e segurança
exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 1000;

// API externa (SpiderX)
exports.SPIDER_API_BASE_URL = "https://api.spiderx.com.br/api";
exports.SPIDER_API_TOKEN = "seu_token_aqui"; // Substitua pelo seu token real

// Grupo específico (opcional)
exports.ONLY_GROUP_ID = ""; // Preencha se quiser limitar a um grupo
// Modo desenvolvedor
exports.DEVELOPER_MODE = false;

// Proxy (opcional)
exports.PROXY_PROTOCOL = "http";
exports.PROXY_HOST = "ip";
exports.PROXY_PORT = "porta";
exports.PROXY_USERNAME = "usuário";
exports.PROXY_PASSWORD = "senha";